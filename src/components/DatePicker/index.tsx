"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, isBefore, startOfToday } from "date-fns"
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { SelectSingleEventHandler } from "react-day-picker"

type DatePickerProps = {
    date?: Date
    setDate?: SelectSingleEventHandler
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    const today = startOfToday()
    return (
        <Popover>
            <PopoverTrigger className="bg-[#ececec] !w-full !h-10" asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : <span>Prazo</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    locale={ptBR}
                    mode="single"
                    disabled={(date) => isBefore(date, today)}
                    classNames={{
                        nav_button: "text-blueScale-600 hover:bg-blueScale-100 p-2 rounded-md",
                        day_selected: "bg-blueScale-600 text-white font-bold",
                    }}
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
