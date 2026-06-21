import { useState } from "react";

export default function TagInput({
  value = [],
  onChange,
  placeholder = "تگ جدید را بنویسید و Enter بزنید",
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed === "") {
      setError("تگ نمی‌تواند خالی باشد");
      return;
    }
    if (value.includes(trimmed)) {
      setError("این تگ قبلاً اضافه شده است");
      return;
    }

    onChange([...value, trimmed]);
    setInputValue("");
    setError("");
  };

  const removeTag = (tagToRemove) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
    setError(""); 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "،" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="w-full">
    
      <div
        className="border border-gray-300 rounded-md p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500"
        dir="rtl"
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-yellow-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full outline-none text-sm"
        />
      </div>
     
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {!error && value.length === 0 && (
        <p className="text-gray-400 text-xs mt-1">
          برای افزودن تگ، بنویسید و Enter یا کاما بزنید
        </p>
      )}
    </div>
  );
}