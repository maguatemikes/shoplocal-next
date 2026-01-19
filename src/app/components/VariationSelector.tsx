"use client";

import React from 'react';

export default function VariationSelector({ attributes, variations, onChange }: any) {
  return (
    <div className="space-y-4">
      {attributes.map((attr: any) => (
        <div key={attr.name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{attr.name}</label>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option: string) => (
              <button
                key={option}
                onClick={() => onChange({ [attr.name]: option })}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
