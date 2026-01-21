const SummaryItem = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="rounded-2xl border border-[#E6DED4] bg-[#EFE9E2] p-4">
      <p className="text-xs uppercase tracking-wide text-[#8B857D]">{label}</p>
      <p className="text-sm font-semibold text-[#2E2E2E]">{value || "-"}</p>
    </div>
  );
};

export default SummaryItem;
