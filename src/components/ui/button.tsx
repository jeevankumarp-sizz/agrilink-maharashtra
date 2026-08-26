import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm",
        secondary: "bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-800",
        ghost: "hover:bg-emerald-50 text-emerald-800",
        demo: "bg-amber-500 text-white hover:bg-amber-600 shadow-md",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5 py-2 text-sm",
        sm: "h-9 px-3 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
);
Button.displayName = "Button";
