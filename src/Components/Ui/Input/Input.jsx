import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * UIInput Component
 * Props:
 *  - label: string (optional label)
 *  - name: string (input name)
 *  - type: text, email, password, etc.
 *  - placeholder: string
 *  - value: controlled value
 *  - onChange: function for input change
 *  - error: string (optional error message)
 *  - helperText: string (optional helper text)
 *  - leftIcon: React node (optional icon on the left)
 *  - rightIcon: React node (optional icon on the right)
 *  - fullWidth: boolean
 *  - size: sm | md | lg
 */
const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 text-sm",
      md: "h-10 text-base",
      lg: "h-12 text-lg",
    };

    return (
      <div className={cn("flex flex-col", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={name}
            className="mb-1 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cn(
              "w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition",
              sizeClasses[size],
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {helperText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helperText}</p>
        )}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "UIInput";

export default Input;
