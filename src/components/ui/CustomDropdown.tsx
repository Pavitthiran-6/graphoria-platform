import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option", 
  className,
  label
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2 w-full", className)} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full h-12 px-4 rounded-[14px] bg-secondary border border-border flex items-center justify-between text-sm transition-all focus:outline-none focus:border-primary/50",
            isOpen && "border-primary/50 ring-1 ring-primary/20",
            !selectedOption && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown 
            size={18} 
            className={cn(
              "text-muted-foreground transition-transform duration-300",
              isOpen && "rotate-180 text-primary"
            )} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-card border border-border rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.length === 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No options available
                </div>
              )}
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between",
                    option.value === value 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {option.label}
                  {option.value === value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
