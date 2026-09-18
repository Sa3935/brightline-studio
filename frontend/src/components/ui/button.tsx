import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      primary: "button-primary",
      secondary: "button-secondary",
      ghost: "button-ghost",
      outline: "button-secondary",
      destructive: "button-destructive",
      link: "button-link",
    },
    size: {
      default: "",
      compact: "button-compact",
      sm: "button-compact",
      lg: "button-large",
      icon: "button-icon",
      "icon-sm": "button-icon button-icon-sm",
      "icon-lg": "button-icon button-icon-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
