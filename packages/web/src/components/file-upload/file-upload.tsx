import * as React from "react"

import { cn } from "../../lib/utils"

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: File[]
  onValueChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxFiles?: number
  maxSizeBytes?: number
  helperText?: string
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const dedupeFiles = (files: File[]) => {
  const map = new Map<string, File>()
  for (const file of files) {
    map.set(`${file.name}-${file.size}-${file.lastModified}`, file)
  }
  return [...map.values()]
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      value,
      onValueChange,
      accept,
      multiple = true,
      disabled = false,
      maxFiles = 10,
      maxSizeBytes = 10 * 1024 * 1024,
      helperText = "Drop files here or click to browse.",
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const [error, setError] = React.useState<string>("")
    const [internalFiles, setInternalFiles] = React.useState<File[]>([])

    const files = value ?? internalFiles

    const setFiles = React.useCallback(
      (nextFiles: File[]) => {
        if (value === undefined) {
          setInternalFiles(nextFiles)
        }
        onValueChange?.(nextFiles)
      },
      [value, onValueChange]
    )

    const applyFiles = React.useCallback(
      (incoming: File[]) => {
        setError("")
        const tooLarge = incoming.find((file) => file.size > maxSizeBytes)
        if (tooLarge) {
          setError(`"${tooLarge.name}" exceeds ${formatFileSize(maxSizeBytes)}.`)
          return
        }

        const merged = dedupeFiles([...files, ...incoming])
        const limited = merged.slice(0, maxFiles)
        if (merged.length > maxFiles) {
          setError(`Only ${maxFiles} files are allowed.`)
        }
        setFiles(limited)
      },
      [files, maxFiles, maxSizeBytes, setFiles]
    )

    const removeFile = (indexToRemove: number) => {
      const next = files.filter((_, index) => index !== indexToRemove)
      setFiles(next)
    }

    return (
      <div ref={ref} className={cn("w-full space-y-3", className)} {...props}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click()
            }
          }}
          onKeyDown={(event) => {
            if (disabled) return
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setIsDragging(true)
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            if (disabled) return
            const droppedFiles = [...event.dataTransfer.files]
            applyFiles(droppedFiles)
          }}
          className={cn(
            "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-input bg-background",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-accent/40"
          )}
        >
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            aria-label="Upload files input"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files ? [...event.target.files] : []
              applyFiles(selected)
              event.target.value = ""
            }}
          />
          <p className="text-sm font-medium text-card-foreground">Upload files</p>
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Up to {maxFiles} files, {formatFileSize(maxSizeBytes)} each
          </p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.lastModified}-${file.size}`}
                className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
