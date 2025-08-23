import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full neo-border bg-background px-4 py-3 text-base font-medium text-foreground",
          "neo-shadow transition-all duration-200",
          "placeholder:text-muted-foreground placeholder:font-normal",
          "focus-visible:outline-none focus-visible:transform focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px]",
          "focus-visible:neo-shadow-lg focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "hover:transform hover:translate-x-[-1px] hover:translate-y-[-1px]",
          "hover:shadow-[5px_5px_0px_#000000]",
          "neo-hover",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }