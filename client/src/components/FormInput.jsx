import { forwardRef } from "react";

const FormInput = forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input py-2 ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
