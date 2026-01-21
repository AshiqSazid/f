"use client";

const HighlightCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 relative bg-white rounded-lg border border-gray-100 text-left">
      {/* Content */}
      <div className="relative">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-b from-[#338AFF] to-[#1E6FFF] shadow-lg">
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm leading-6 text-gray-700/90">{description}</p>
      </div>
    </div>
  );
};

export default HighlightCard;
