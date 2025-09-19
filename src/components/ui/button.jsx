import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// A simple utility function to merge Tailwind classes, similar to what's often in utils.js
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Button Variants with Direct Tailwind CSS Classes ---
// I've replaced variables like 'primary' and 'destructive' with concrete Tailwind classes.
const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center whitespace-nowrap cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Default button style (e.g., primary action)
        default:
          "bg-blue-600 text-white hover:bg-blue-600/90",
        // Destructive button style (e.g., delete, remove)
        destructive:
          "bg-red-600 text-white hover:bg-red-600/90",
        // Outline button with a border
        outline:
          "border border-slate-300 bg-transparent hover:bg-slate-100 hover:text-slate-800",
        // Secondary button, less prominent than the default
        secondary:
          "bg-slate-200 text-slate-800 hover:bg-slate-200/80",
        apply:
          "bg-green-800 text-green-200 hover:bg-green-800/80",
        // Ghost button, used for low-emphasis actions
        ghost: "hover:bg-slate-100 hover:text-slate-800",
        // Link-style button
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        // Size variants for the button
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    // Default variant and size if not specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      circle = false,
      loading = false,
      text = "Loading...",
      children,
      ...props
    },
    ref
  ) => {
    // State to control spinner visibility with delay
    const [showSpinner, setShowSpinner] = React.useState(loading);

    // Set a 2 second timeout to show the spinner if it's loading
    React.useEffect(() => {
      if (loading) {
        const timeout = setTimeout(() => {
          setShowSpinner(true);
        }, 2000);

        return () => clearTimeout(timeout); // Cleanup timeout if component unmounts
      }
      setShowSpinner(false); // Reset if not loading
    }, [loading]);

    // Use Slot if asChild is true, otherwise render a standard button
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={loading || props.disabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {/* ✅ When loading and circle mode is enabled */}
        {loading && circle ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{text}</span>
          </div>
        ) : loading && !circle && showSpinner ? (
          // ✅ If loading but not circle mode → Show spinner only after 2 seconds
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{text}</span>
          </div>
        ) : (
          // ✅ Default: Show button content when not loading
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export {
  Button,
  buttonVariants
};
