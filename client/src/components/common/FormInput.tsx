import { type FormInputProps } from "../../types/auth.types";

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  validation = {},
}: FormInputProps) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label}
        {validation?.required ? (
          <span className="text-red-500 mr-1 text-[20px]">*</span>
        ) : (
          <span className="text-gray-500 mr-1 text-[16px]">(اختیاری )</span>
        )}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}

export default FormInput;
