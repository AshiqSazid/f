"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  User,
  Heart,
  Music,
  CloudSun,
  Feather,
  Brain,
  Star,
  Moon,
  Clock,
  AlertCircle,
  Snowflake,
  HeartPlus,
  Languages,
} from "lucide-react";

import type { IntakeFormValues } from "@/lib/types";
import FormHeader from "../common/formHeader";
import CustomTextfield from "../common/customTextfield";
import CustomSelectfield from "../common/customSelectfield";
import CustomDatePicker from "../common/customDatePicker";
import CustomButton from "../common/customButton";
import GenresItem from "../common/genresItem";
import InstrumentsItem from "../common/instrumentsItem";
import LanguageItem from "../common/languageItem";

interface IntakeFormProps {
  onSubmit: (data: IntakeFormValues) => void;
  loading: boolean;
}

const INSTRUMENTS = [
  "Accordion",
  "Acoustic Guitar",
  "Bass Guitar",
  "Bongos",
  "Drum Kit",
  "Drums",
  "Electric Bass",
  "Electric Guitar",
  "Esraj",
  "Flute",
  "Guitar",
  "Harmonium",
  "Keyboard",
  "Saxophone",
  "Synthesizer",
  "Tabla",
  "Tanpura",
  "Violin",
  "Piano",
  "Sitar",
  "Cello",
];

const LANGUAGES = [
  "English",
  "Bengali",
  "Hindi",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Mandarin",
  "Japanese",
];

const NATURAL_ELEMENTS = [
  "Rain",
  "Ocean",
  "Forest",
  "Wind",
  "Fireplace",
  "Birdsong",
  "Mountain Breeze",
];

const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "Monsoon"];

const BIG_FIVE_STATEMENTS = [
  "I see myself as extraverted, enthusiastic",
  "I see myself as critical, quarrelsome",
  "I see myself as dependable, self-disciplined",
  "I see myself as anxious, easily upset",
  "I see myself as open to new experiences, complex",
  "I see myself as reserved, quiet",
  "I see myself as sympathetic, warm",
  "I see myself as disorganized, careless",
  "I see myself as calm, emotionally stable",
  "I see myself as conventional, uncreative",
];

const INITIAL_FORM: IntakeFormValues = {
  name: "",
  sex: "Female",
  birthplaceCity: "",
  birthplaceCountry: "",
  dateOfBirth: "",
  condition: "dementia",
  instruments: [],
  preferredLanguages: ["Bengali"],
  favoriteGenres: [],
  favoriteMusician: "",
  favoriteSeason: "",
  naturalElements: [],
  difficultySleeping: false,
  troubleRemembering: false,
  forgetsEverydayThings: false,
  difficultyRecallingOldMemories: false,
  memoryWorseThanYearAgo: false,
  visitedMentalHealthProfessional: false,
  bigFiveResponses: Array(10).fill(4),
};

export default function IntakeForm({ onSubmit, loading }: IntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormValues>(INITIAL_FORM);
  const [error, setError] = useState<Record<string, string>>({});

  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setError((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    };

  const handleToggleOption = (
    field: keyof Pick<
      IntakeFormValues,
      | "instruments"
      | "preferredLanguages"
      | "favoriteGenres"
      | "naturalElements"
      | "favoriteSeason"
    >,
    option: string
  ) => {
    setFormData((prev) => {
      const current = new Set(prev[field]);
      if (current.has(option)) {
        current.delete(option);
      } else {
        current.add(option);
      }
      return {
        ...prev,
        [field]: Array.from(current),
      };
    });

    setError((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleCheckboxChange =
    (
      field: keyof Pick<
        IntakeFormValues,
        | "difficultySleeping"
        | "troubleRemembering"
        | "forgetsEverydayThings"
        | "difficultyRecallingOldMemories"
        | "memoryWorseThanYearAgo"
        | "visitedMentalHealthProfessional"
      >
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleBigFiveChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setFormData((prev) => {
        const updated = [...prev.bigFiveResponses];
        updated[index] = value;
        return { ...prev, bigFiveResponses: updated };
      });
    };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setError({});
  };

  const handleModify = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim())
      errors.name = "Please provide the patient's full name.";
    if (!formData.dateOfBirth)
      errors.dateOfBirth = "Date of birth is required.";
    if (!formData.birthplaceCountry.trim())
      errors.birthplaceCountry = "Birthplace country is required.";
    if (formData.favoriteGenres.length === 0)
      errors.favoriteGenres = "Select at least one favorite genre.";

    return errors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();

    if (Object.keys(validationError).length > 0) {
      setError(validationError);
      return;
    }
    setError({});
    onSubmit(formData);
  };

  return (
    <div className="">
      {/* Main Form Card */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-12">
          {/* Demographics Section */}
          <section className="space-y-1">
            <FormHeader icon={User} title="Demographics" />

            <div className="grid gap-4 md:grid-cols-2">
              <CustomTextfield
                label="Full Name"
                placeholder="e.g. John Doe"
                name="name"
                value={formData?.name}
                required
                type="text"
                onChange={handleFieldChange("name")}
                error={error?.name}
              />

              <CustomSelectfield
                label="Sex"
                name="sex"
                value={formData.sex}
                onChange={handleFieldChange("sex")}
                required
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />

              <CustomDatePicker
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleFieldChange("dateOfBirth")}
                required
                error={error?.dateOfBirth}
              />

              <CustomTextfield
                label="Birthplace City"
                placeholder="e.g. Dhaka"
                name="city"
                value={formData?.birthplaceCity}
                type="text"
                onChange={handleFieldChange("birthplaceCity")}
              />

              <CustomTextfield
                label="Birthplace Country"
                placeholder="e.g. Bangladesh"
                name="country"
                value={formData?.birthplaceCountry}
                type="text"
                onChange={handleFieldChange("birthplaceCountry")}
                required
                error={error?.birthplaceCountry}
              />
            </div>
          </section>

          {/* Condition for therapy */}
          <section className="space-y-6">
            <FormHeader icon={HeartPlus} title="Therapy Focus" color="red" />
            <div className="grid gap-6">
              <CustomSelectfield
                label="Primary Condition"
                name="condition"
                value={formData.condition}
                onChange={handleFieldChange("condition")}
                options={[
                  { label: "Dementia / Alzheimer's", value: "dementia" },
                  { label: "Down Syndrome", value: "down_syndrome" },
                  { label: "ADHD", value: "adhd" },
                ]}
                required
              />
            </div>
          </section>

          {/* Musical Preferences Section */}
          <section className="space-y-6">
            <FormHeader icon={Music} title="Musical Preferences" />

            <div className="space-y-6">
              <CustomTextfield
                label="Favorite Musician / Artist"
                placeholder="e.g. Miles Davis, Lata Mangeshkar"
                name="favoriteMusician"
                value={formData?.favoriteMusician}
                type="text"
                onChange={handleFieldChange("favoriteMusician")}
              />

              {/* =====Favorite Genres===== */}
              <div>
                <label
                  className={`${
                    error?.favoriteGenres ? "text-red-500" : "text-gray-700"
                  } block text-sm font-bold mb-2`}
                >
                  Favorite Genres <span className="text-red-500">*</span>
                  <span
                    className={`${
                      error?.favoriteGenres ? "text-red-500" : "text-gray-500"
                    } text-sm font-normal ml-2`}
                  >
                    
                  </span>
                </label>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {[
                    "Classical",
                    "Folk",
                    "Jazz",
                    "Pop",
                    "Rabindra Sangeet",
                    "Rock",
                    "Traditional",
                    "Instrumental",
                    "Devotional",
                    "Ambient",
                    "Meditation",
                  ].map((genre) => (
                    <GenresItem
                      key={genre}
                      genre={genre}
                      formData={formData}
                      error={error}
                      handleToggleOption={handleToggleOption}
                    />
                  ))}
                </div>
              </div>

              {/* ======Instruments====== */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Music className="w-4 h-4 text-purple-600" />
                  Preferred Instruments
                </label>

                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {INSTRUMENTS.map((instrument) => (
                    <InstrumentsItem
                      key={instrument}
                      instrument={instrument}
                      formData={formData}
                      handleToggleOption={handleToggleOption}
                      error={error}
                    />
                  ))}
                </div>
              </div>

              {/* =====Languages===== */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Languages className="w-4 h-4 text-purple-600" />
                  Preferred Languages
                </label>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {LANGUAGES.map((language) => (
                    <LanguageItem
                      key={language}
                      language={language}
                      formData={formData}
                      error={error}
                      handleToggleOption={handleToggleOption}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Environment Assessment Section */}
          <section className="space-y-6">
            <FormHeader icon={Snowflake} title="Environmental Preferences" />
            <div className="grid gap-6">
              {/* =====Favorite Season=====
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <CloudSun className="w-4 h-4 text-blue-600" />
                  Favorite Season
                </label>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {SEASONS.map((season) => (
                    <label
                      key={season}
                      className={`flex justify-start items-center gap-3 p-1 rounded-sm border cursor-pointer transition-all duration-200 ${
                        formData.favoriteSeason.includes(season)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.favoriteSeason.includes(season)}
                        onChange={() =>
                          handleToggleOption("favoriteSeason", season)
                        }
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
                          formData.favoriteSeason.includes(season)
                            ? "border-blue-500 bg-blue-500"
                            : "border-[#1e6fff]"
                        }`}
                      >
                        {formData.favoriteSeason.includes(season) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700 text-sm">
                        {season}
                      </span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* =====Natural Element===== */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <Feather className="w-4 h-4 text-blue-600" />
                  Natural Elements You Connect With
                </label>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {NATURAL_ELEMENTS.map((element) => (
                    <label
                      key={element}
                      className={`flex justify-start items-center gap-3 p-1 rounded-sm border cursor-pointer transition-all duration-200 ${
                        formData.naturalElements.includes(element)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.naturalElements.includes(element)}
                        onChange={() =>
                          handleToggleOption("naturalElements", element)
                        }
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
                          formData.naturalElements.includes(element)
                            ? "border-blue-500 bg-blue-500"
                            : "border-[#1e6fff]"
                        }`}
                      >
                        {formData.naturalElements.includes(element) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700 text-sm">
                        {element}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Health Assessment Section */}
          <section className="space-y-6">
            <FormHeader
              icon={Brain}
              title="Cognitive & Lifestyle Indicators"
              color="red"
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  key: "difficultySleeping" as const,
                  label: "Difficulty Sleeping",
                  icon: Moon,
                },
                {
                  key: "troubleRemembering" as const,
                  label: "Trouble Remembering Recent Events",
                  icon: Clock,
                },
                {
                  key: "forgetsEverydayThings" as const,
                  label: "Forgets Everyday Tasks",
                  icon: AlertCircle,
                },
                {
                  key: "difficultyRecallingOldMemories" as const,
                  label: "Difficulty Recalling Older Memories",
                  icon: Brain,
                },
                {
                  key: "memoryWorseThanYearAgo" as const,
                  label: "Memory Worse Than a Year Ago",
                  icon: Star,
                },
                {
                  key: "visitedMentalHealthProfessional" as const,
                  label: "Visited Mental Health Professional",
                  icon: Heart,
                },
              ].map(({ key, label, icon: Icon }) => (
                <label
                  key={key}
                  className={`flex justify-center items-center gap-3 p-1 rounded-sm border cursor-pointer transition-all duration-200 ${
                    formData[key]
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[key]}
                    onChange={handleCheckboxChange(key)}
                    className="hidden"
                  />
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
                      formData[key]
                        ? "border-blue-500 bg-blue-500"
                        : "border-[#1e6fff]"
                    }`}
                  >
                    {formData[key] && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-start items-center">
                      <span className="font-medium text-gray-700 text-sm">
                        {label}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Big Five Personality Assessment */}
          <section className="space-y-6">
            <FormHeader
              icon={Star}
              title="Big Five Personality Assessment"
              description="Rate each statement from 1 (Strongly Disagree) to 7 (Strongly Agree)"
              color="indigo"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {BIG_FIVE_STATEMENTS.map((statement, index) => (
                <div
                  key={statement}
                  className="bg-gray-50 rounded-lg p-2 md:p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-gray-800 flex-1 pr-4">
                      {index + 1}. {statement}
                    </p>
                    <div className="bg-white px-2 py-0 rounded-full border border-gray-300">
                      <span className="text-sm font-bold text-indigo-600">
                        {formData.bigFiveResponses[index]} / 7
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={formData.bigFiveResponses[index]}
                    onChange={handleBigFiveChange(index)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />

                  <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-2">
                    <span>Strongly Disagree</span>
                    <span>Neutral</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-gray-200">
            <CustomButton
              type="submit"
              loading={loading}
              variant="primary"
              minWidth="min-w-60"
              onClick={handleSubmit as any}
            >
              Click for TheramuseRX Recommendations
            </CustomButton>

            <CustomButton
              type="button"
              onClick={handleModify}
              disabled={loading}
              variant="black"
              minWidth="min-w-60"
            >
              Modify
            </CustomButton>

            <CustomButton
              type="button"
              onClick={resetForm}
              disabled={loading}
              variant="danger"
              minWidth="min-w-60"
            >
              Clear Form
            </CustomButton>
          </div>
        </form>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
