import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEventHandler } from "react";

type SearchbarProps = {
  placeholder: string;
  styles?: string;
  value: string
  onchange: ChangeEventHandler<HTMLInputElement>
}

export function Searchbar({ placeholder, styles, value, onchange }: SearchbarProps) {
  return (
    <div className={`w-full md:w-[70%] flex items-center ${styles}`}>
      <Input
        value={value}
        onChange={onchange}
        type="email"
        placeholder={placeholder}
        className="w-full py-2 font-poppins font-medium placeholder:text-foreground placeholder:text-blueScale-600 border-none bg-[#FFFFFF] rounded-lg"
      ></Input>
      <Search color="#3774A9" size={24} className="-ml-10" />
    </div>
  );
}
