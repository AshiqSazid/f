const Stat = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#8B857D]">{label}</p>
      <p className="text-xl font-semibold text-[#2E2E2E]">{value}</p>
    </div>
  );
};

export default Stat;
