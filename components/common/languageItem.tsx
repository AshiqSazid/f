"use client";
import { IntakeFormValues } from "@/lib/types";
import React from "react";

interface LanguageItemProps {
  language: string;
  formData: Pick<IntakeFormValues, "preferredLanguages">;
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

const LanguageItem: React.FC<LanguageItemProps> = ({
  language,
  formData,
  error,
  handleToggleOption,
}) => {
  const isSelected = formData.preferredLanguages.includes(language);
  return (
    <label
      className={`flex justify-start items-center gap-3 p-1 rounded-sm border cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : error?.preferredLanguages
          ? "border-red-500 hover:border-red-300"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => handleToggleOption("preferredLanguages", language)}
        className="hidden"
      />
      <div
        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
          isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
        }`}
      >
        {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
      </div>
      <span className="font-medium text-gray-700 text-sm">{language}</span>
    </label>
  );
};

export default LanguageItem;
