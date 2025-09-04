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
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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

// --- Button Component ---
// This part remains largely the same, as it correctly applies the variants.
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot if asChild is true, otherwise render a standard button
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button"

export {
  Button,
  buttonVariants
}