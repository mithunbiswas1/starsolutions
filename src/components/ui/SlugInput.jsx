// src/components/ui/SlugInput.jsx

import { useState, useEffect } from "react";
import Input from "./Input";

const SlugInput = ({
  title,
  value,
  onChange,
  onBlur,
  error,
  required,
  label = "Slug",
  placeholder,
  prefix,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [slugValue, setSlugValue] = useState(value || "");

  // Auto-generate slug from title
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Update slug when title changes (if not in editing mode)
  useEffect(() => {
    if (!isEditing && title) {
      const newSlug = generateSlug(title);
      setSlugValue(newSlug);
      // Only update parent if slug is empty or was auto-generated
      if (!value || value === generateSlug(value)) {
        onChange({ target: { name: "slug", value: newSlug } });
      }
    }
  }, [title, isEditing, onChange]);

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== slugValue && !isEditing) {
      setSlugValue(value);
    }
  }, [value, isEditing]);

  const handleSlugChange = (e) => {
    const newValue = e.target.value;
    // Only allow lowercase letters, numbers, and hyphens
    const sanitizedValue = newValue
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setSlugValue(sanitizedValue);
    onChange({ target: { name: "slug", value: sanitizedValue } });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // When entering edit mode, set the current value
      setSlugValue(value || "");
    }
  };

  const handleResetSlug = () => {
    if (title) {
      const newSlug = generateSlug(title);
      setSlugValue(newSlug);
      onChange({ target: { name: "slug", value: newSlug } });
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {!isEditing && title && (
            <button
              type="button"
              onClick={handleEditToggle}
              className="text-xs text-green-600 hover:text-green-800 hover:underline"
            >
              Edit
            </button>
          )}
          {isEditing && (
            <>
              <button
                type="button"
                onClick={handleResetSlug}
                className="text-xs text-green-600 hover:text-green-800 hover:underline"
              >
                Reset to auto
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Revert to auto-generated if empty
                  if (!slugValue && title) {
                    const newSlug = generateSlug(title);
                    setSlugValue(newSlug);
                    onChange({ target: { name: "slug", value: newSlug } });
                  }
                }}
                className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center">
          <span className="absolute left-0 pl-3 text-gray-400 text-sm">
            {prefix}
          </span>
          <input
            type="text"
            id="slug"
            name="slug"
            value={slugValue || ""}
            onChange={handleSlugChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`
              w-full pl-15 px-3 py-2 pl-${prefix.length * 8 + 8}px 
              border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500
              ${error ? "border-red-500" : "border-gray-300"}
              ${isEditing ? "bg-white" : "bg-gray-50"}
              ${className}
            `}
            disabled={!isEditing}
            required={required}
          />
        </div>
        {!isEditing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </div>

      {!isEditing && (
        <p className="text-xs text-gray-500">
          Slug is auto-generated from title. Click "Edit" to modify manually.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SlugInput;
