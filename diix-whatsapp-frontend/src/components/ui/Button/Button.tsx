import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-accent-primary text-black hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/20",
        primary: "bg-accent-primary text-black hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/20",
        destructive: "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20",
        danger: "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-text-primary",
        secondary: "bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary/20",
        ghost: "hover:bg-white/5 text-text-secondary hover:text-text-primary",
        link: "text-accent-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-accent-primary to-accent-cyan text-black shadow-xl shadow-accent-primary/30 hover:shadow-2xl hover:shadow-accent-primary/40",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loadingText, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? loadingText || children : children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
