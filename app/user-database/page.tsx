"use client";
import React, { useMemo, useState } from "react";
import Header from "@/components/common/header";
import StatCard from "@/components/common/statCard";
import { Calendar, ChevronDown, Filter, Search, Users } from "lucide-react";
import { PatientRecord } from "@/lib/types";

interface PatientDatabaseViewProps {
  records?: PatientRecord[];
}

const CONDITION_OPTIONS = [
  { label: "All Conditions", value: "all" },
  { label: "Dementia / Alzheimer's", value: "dementia" },
  { label: "Down Syndrome", value: "down_syndrome" },
  { label: "ADHD", value: "adhd" },
];

const UserDatabase = ({ records }: PatientDatabaseViewProps) => {
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("all");

  const filtered = useMemo(() => {
    return records?.filter((record) => {
      const matchesQuery = query
        ? record.name?.toLowerCase().includes(query.toLowerCase()) ||
          (record.patientInfo?.name as string | undefined)
            ?.toLowerCase()
            .includes(query.toLowerCase())
        : true;
      const matchesCondition =
        condition === "all"
          ? true
          : record.condition?.toLowerCase() === condition.toLowerCase();
      return matchesQuery && matchesCondition;
    });
  }, [records, query, condition]);

  const totals = useMemo(() => {
    const byCondition: Record<string, number> = {};
    records?.forEach((record) => {
      const key = record.condition || "unknown";
      byCondition[key] = (byCondition[key] ?? 0) + 1;
    });
    return {
      patients: records?.length,
      dementia: byCondition["dementia"] ?? 0,
      downSyndrome: byCondition["down_syndrome"] ?? 0,
      adhd: byCondition["adhd"] ?? 0,
    };
  }, [records]);

  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6 bg-linear-to-br from-slate-50 to-blue-50/30 py-8">
      {/* Header Section */}
      <Header
        title={"Patient Repository"}
        description={"Persisted sessions, feedback, and personality snapshots."}
      />

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 bg-white rounded-lg border border-gray-100">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search patients by name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-blue-100 outline-blue-50 transition-all duration-200 placeholder:text-gray-500 text-gray-900"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-blue-100 outline-blue-50 transition-all duration-200 appearance-none text-gray-900 cursor-pointer"
          >
            <option value="">All Conditions</option>
            {CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Patients"
          value={39}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Dementia"
          value={50}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Down Syndrome"
          value={748}
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="ADHD"
          value={23}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[]">
            <tr>
              <th className="table-head">Patient</th>
              <th className="table-head">Condition</th>
              <th className="table-head">Age</th>
              <th className="table-head">Created</th>
              <th className="table-head">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered?.map((record) => (
              <tr key={record.patientId} className="hover:bg-accent-olive/10">
                <td className="table-cell">
                  <div className="text-sm font-semibold text-gray-800">
                    {record.name || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {record.patientId}
                  </div>
                </td>
                {/* <td className="table-cell text-sm font-medium text-gray-700">{formatCondition(record.condition)}</td> */}
                <td className="table-cell text-sm text-gray-600">
                  {record.age ?? "—"}
                </td>
                {/* <td className="table-cell text-sm text-gray-600">{formatDate(record.createdAt)}</td> */}
                <td className="table-cell">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-accent-teal underline transition group-open:text-accent-olive">
                      View profile
                    </summary>
                    <div className="mt-2 rounded-lg bg-accent-teal/5 p-3 text-xs text-gray-700">
                      <JsonPreview data={record.patientInfo} />
                    </div>
                  </details>
                </td>
              </tr>
            ))}
            {!filtered?.length && (
              <tr>
                <td
                  className="table-cell text-center text-sm text-gray-500"
                  colSpan={5}
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDatabase;

function JsonPreview({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data || {});
  if (!entries.length) {
    return <p className="text-gray-500">No stored profile data.</p>;
  }
  return (
    <dl className="grid gap-2">
      {entries.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[120px_1fr] items-start gap-2">
          <dt className="text-gray-500">{formatKey(key)}</dt>
          <dd className="font-medium text-gray-700">{renderValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
