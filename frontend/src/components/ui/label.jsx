import * as React from "react";
export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label className={`block ${className || ""}`} ref={ref} {...props} />
));
Label.displayName = "Label";
