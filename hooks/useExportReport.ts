import { EXPORT } from "@/lib/api";
import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";

type ExportFormat = "pdf" | "docx";

interface ExportReportParams {
  format: ExportFormat;
  recommendations: any; // Replace with your actual types
  bigFive: any;
  patientSummary: any;
  patientInfo: any;
}

interface ExportReportState {
  isLoading: boolean;
  error: string | null;
  progress: number | null; // null if unknown
  abort: () => void;
}

interface UseExportReportReturn {
  download: (params: ExportReportParams) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  progress: number | null;
  retry: () => void;
  abort: () => void;
}

function base64ToBlob(base64: string, contentType: string) {
  const cleaned = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteCharacters = atob(cleaned);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useExportReport(): UseExportReportReturn {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const abortController = useRef<AbortController | null>(null);
  const lastParams = useRef<ExportReportParams | null>(null);

  const abort = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setLoading(false);
      setProgress(null);
      toast.dismiss();
      toast("Export cancelled.");
    }
  }, []);

  const download = useCallback(async (params: ExportReportParams) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(null);
      abortController.current = new AbortController();
      lastParams.current = params;

      const payload = {
        format: params.format,
        recommendations: params.recommendations,
        big_five: params.bigFive,
        patient_summary: params.patientSummary,
        patient_info: params.patientInfo,
      };

      // Start fetch
      const res = await fetch(EXPORT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: abortController.current.signal,
      });

      if (!res.ok) {
        let json: any = null;
        try {
          json = await res.json();
        } catch {}
        throw new Error(json?.detail ?? json?.error ?? "Failed to export file.");
      }

      const responseType = res.headers.get("content-type") || "";
      if (responseType.includes("application/json")) {
        const payloadJson = await res.json();
        const base64Data = payloadJson?.base64_data;
        if (!base64Data) {
          throw new Error("Export response missing file data.");
        }
        const contentType = payloadJson?.content_type ?? "application/octet-stream";
        const filename =
          payloadJson?.filename ?? `TheramuseRX_report.${params.format}`;
        const blob = base64ToBlob(base64Data, contentType);
        triggerDownload(blob, filename);
        toast.success(`${params.format.toUpperCase()} exported successfully.`);
        return;
      }

      // Try to get content length for progress (may be null)
      const contentLength = res.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : null;

      // Stream the response to track progress
      if (!res.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const reader = res.body.getReader();
      let receivedLength = 0; // received bytes
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          if (total) {
            setProgress((receivedLength / total) * 100);
          }
        }
      }

      // Combine chunks into a Blob
      const blob = new Blob(chunks, {
        type: res.headers.get("content-type") || "application/octet-stream",
      });

      // Extract filename from headers
      const disposition = res.headers.get("content-disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/);
      const filename = match ? match[1] : `TheramuseRX_report.${params.format}`;

      // Create link and trigger download
      triggerDownload(blob, filename);

      toast.success(`${params.format.toUpperCase()} exported successfully.`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Abort is handled separately, no toast
        return;
      }
      const msg = err instanceof Error ? err.message : "Export failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setProgress(null);
      abortController.current = null;
    }
  }, []);

  const retry = useCallback(() => {
    if (lastParams.current) {
      download(lastParams.current);
    }
  }, [download]);

  return { download, isLoading, error, progress, retry, abort };
}
