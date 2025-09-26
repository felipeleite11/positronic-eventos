import * as React from "react"

import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea"> & { 
  label?: string
  validationMessage?: string
}

function Textarea({ className, id, label, validationMessage, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1 text-xs text-slate-400">
      {label && <label htmlFor={id} className="ml-1">{label}</label>}

      <textarea
        data-slot="textarea"
        id={props.name}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 text-slate-700 dark:text-white",
          className
        )}
        {...props}
      />

      {validationMessage && (
        <span className="text-xs text-yellow-500 mx-1">
          {validationMessage}
        </span>
      )}
    </div>
  )
}

export { Textarea }
