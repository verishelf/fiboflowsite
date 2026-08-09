import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-medium uppercase tracking-[0.25em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-off-white bg-transparent text-off-white hover:bg-off-white hover:text-black",
        secondary:
          "border border-white/30 bg-transparent text-off-white/80 hover:border-off-white hover:text-off-white",
        ghost: "border-transparent text-off-white/70 hover:text-off-white",
        destructive: "border border-red-500/50 text-red-400 hover:bg-red-500/10",
      },
      size: {
        default: "h-12 px-8 py-4",
        sm: "h-10 px-6",
        lg: "h-14 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
