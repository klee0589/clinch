"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { MuayThaiStyle } from "@clinch/shared";

interface TrainerFiltersProps {
  onFilterChange: (filters: {
    city?: string;
    state?: string;
    specialties?: string[];
    minRate?: number;
    maxRate?: number;
    availableForOnline?: boolean;
    minRating?: number;
  }) => void;
}

export function TrainerFilters({ onFilterChange }: TrainerFiltersProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [minRating, setMinRating] = useState("");

  const handleApplyFilters = () => {
    onFilterChange({
      city: city || undefined,
      state: state || undefined,
      specialties:
        selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
      minRate: minRate ? Number(minRate) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      availableForOnline: onlineOnly ? true : undefined,
      minRating: minRating ? Number(minRating) : undefined,
    });
  };

  const handleReset = () => {
    setCity("");
    setState("");
    setMinRate("");
    setMaxRate("");
    setSelectedSpecialties([]);
    setOnlineOnly(false);
    setMinRating("");
    onFilterChange({});
  };

  const toggleSpecialty = (specialty: string) => {
    const newSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter((s) => s !== specialty)
      : [...selectedSpecialties, specialty];

    setSelectedSpecialties(newSpecialties);

    // Auto-apply filters when specialty changes
    onFilterChange({
      city: city || undefined,
      state: state || undefined,
      specialties: newSpecialties.length > 0 ? newSpecialties : undefined,
      minRate: minRate ? Number(minRate) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      availableForOnline: onlineOnly ? true : undefined,
      minRating: minRating ? Number(minRating) : undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Filter Trainers
      </h3>

      <div className="space-y-4">
        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            placeholder="e.g. Bangkok"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label="State/Province"
            placeholder="e.g. Bangkok"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        {/* Hourly Rate Range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min Rate ($/hr)"
            type="number"
            placeholder="0"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
          />
          <Input
            label="Max Rate ($/hr)"
            type="number"
            placeholder="500"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
          />
        </div>

        {/* Minimum Rating */}
        <Select
          label="Minimum Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          options={[
            { value: "", label: "Any rating" },
            { value: "4", label: "4+ stars" },
            { value: "4.5", label: "4.5+ stars" },
          ]}
        />

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specialties
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(MuayThaiStyle).map((specialty) => (
              <button
                key={specialty}
                onClick={() => toggleSpecialty(specialty)}
                className={`
                  px-3 py-1 text-sm rounded-full transition-colors
                  ${
                    selectedSpecialties.includes(specialty)
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                {specialty.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Online Availability */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onlineOnly}
            onChange={(e) => setOnlineOnly(e.target.checked)}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Available for online sessions
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="ghost">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
