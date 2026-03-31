import * as React from "react";

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "base", ...props }, ref) => {
    let classes =
      "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
    if (variant === "outline") {
      classes += " bg-white border";
    } else if (variant === "default") {
      classes += " bg-gray-900 text-white";
    }
    if (size === "sm") classes += " text-sm px-3 py-2";
    else if (size === "base") classes += " text-base px-4 py-2";
    else classes += " px-4 py-2";
    if (className) classes += ` ${className}`;
    return <button className={classes} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
