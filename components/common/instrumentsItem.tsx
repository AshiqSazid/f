"use client";
import { IntakeFormValues } from "@/lib/types";
import React from "react";

interface InstrumentsItemItemProps {
  instrument: string;
  formData: Pick<IntakeFormValues, "instruments">;
  error?: Record<string, string>;
  handleToggleOption: (
    field: keyof Pick<
      IntakeFormValues,
      | "instruments"
      | "preferredLanguages"
      | "favoriteGenres"
      | "naturalElements"
      | "favoriteSeason"
    >,
    option: string
  ) => void;
}

const InstrumentsItem: React.FC<InstrumentsItemItemProps> = ({
  instrument,
  formData,
  handleToggleOption,
}) => {
  const isSelected = formData.instruments.includes(instrument);
  return (
    <label
      key={instrument}
      className={`flex justify-start items-center gap-3 p-1 rounded-sm border cursor-pointer transition-all duration-200 ${
        formData.instruments.includes(instrument)
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <input
        type="checkbox"
        checked={formData.instruments.includes(instrument)}
        onChange={() => handleToggleOption("instruments", instrument)}
        className="hidden"
      />
      <div
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
          formData.instruments.includes(instrument)
            ? "border-blue-500 bg-blue-500"
            : "border-[#1e6fff]"
        }`}
      >
        {formData.instruments.includes(instrument) && (
          <div className="w-2 h-2 bg-white rounded-sm" />
        )}
      </div>
      <span className="font-medium text-gray-700 text-sm">{instrument}</span>
    </label>
  );
};

export default InstrumentsItem;
