import * as React from "react";
export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`block w-full rounded-md border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm ${className || ""}`}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
