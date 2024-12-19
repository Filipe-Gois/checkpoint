"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectProps<T> {
  filterContent?: T[];
  defaultValueLabel?: string;
  setSelectedValue: (value: T) => void
  className?: string
}

export const SelectFilter = <T,>({
  filterContent = [],
  defaultValueLabel,
  setSelectedValue,
  className

}: SelectProps<T>) => {

  return (
    <Select onValueChange={(value) => setSelectedValue(value as T)}>
      <SelectTrigger className={`w-full md:w-[180px] ${className}`}>
        <SelectValue placeholder="Filtro" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filtrar por...</SelectLabel>
          <SelectItem className={`${!defaultValueLabel ? "hidden" : ""}`} value="null">{defaultValueLabel}</SelectItem>
          {filterContent.map((content, index) => (
            <SelectItem
              key={index}
              value={String(content)}
            >
              {String(content)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};