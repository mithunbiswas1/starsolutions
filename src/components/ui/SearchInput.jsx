// components/ui/SearchInput.jsx
"use client";

import { FaSearch } from "react-icons/fa";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear,
  showClearButton = false,
  disabled = false,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <FaSearch
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        size={14}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/80/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {showClearButton && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
