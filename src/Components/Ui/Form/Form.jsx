import React, { useState } from "react";
import Button from "../Button/Button"; // Reuse the button we built

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Form Component
 * Props:
 *  - title: string (form heading)
 *  - description: string (optional subtext)
 *  - fields: array of { name, label, type, placeholder, icon(optional), required(optional) }
 *  - onSubmit: function(values) (handles submit logic)
 *  - submitLabel: string (button text)
 */
export default function Form({
  title,
  description,
  fields = [],
  onSubmit,
  submitLabel = "Submit",
}) {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validation
    fields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await onSubmit(formValues);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor={field.name}>
              {field.label}
            </label>
            <div className="relative">
              {field.icon && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  {field.icon}
                </span>
              )}
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                onChange={handleChange}
                value={formValues[field.name] || ""}
                className={cn(
                  "w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2",
                  field.icon ? "pl-10" : ""
                )}
              />
            </div>
            {errors[field.name] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        <Button type="submit" loading={loading} fullWidth>
          {submitLabel}
        </Button>
      </form>
    </div>
  );
}
