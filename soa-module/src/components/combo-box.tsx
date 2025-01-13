import * as React from "react"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomComboBoxProps {
  data: { value: string; label: string }[]
  placeholder?: string
  onSelect: (value: string) => void
  isLoading?: boolean
}

export const Combobox = React.forwardRef<HTMLInputElement, CustomComboBoxProps>(
  ({ data, placeholder = "Select...", onSelect, isLoading = false, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue
      setValue(newValue)
      onSelect(newValue)
      setOpen(false)
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : value ? (
              data.find((item) => item.value === value)?.label
            ) : (
              placeholder
            )}
            {!isLoading && (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        {!isLoading && (
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                ref={ref}
                {...props} 
              />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    )
  }
)

Combobox.displayName = "Combobox" // Required for debugging with React DevTools
