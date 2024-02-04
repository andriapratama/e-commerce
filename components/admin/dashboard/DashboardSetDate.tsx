"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { _months } from "@/constant/month";

const DashboardSetDate = () => {
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  const yearParams = searchParams.get("year");
  const monthParams = searchParams.get("month");
  const dateParams = searchParams.get("date");

  const newDate = new Date();

  const [type, setType] = useState<string>(typeParams ? typeParams : "daily");
  const [year, setYear] = useState<string>(
    yearParams ? yearParams : `${ConvertDateId(newDate).yy}`
  );
  const [month, setMonth] = useState<string>(
    monthParams ? monthParams : `${ConvertDateId(newDate).month}`
  );
  const [date, setDate] = useState<string>(
    dateParams
      ? `${ConvertDateId(new Date(dateParams)).fullDateNumber}`
      : `${ConvertDateId(newDate).fullDateNumber}`
  );
  const [dateCalendar, setDateCalendar] = useState<Date>(
    dateParams ? new Date(dateParams) : newDate
  );

  const handleSetType = (value: string) => {
    setType(value);
    if (value === "yearly") {
      router.push(`/admin?type=${value}&year=${newDate.getFullYear()}`);
      setYear(`${newDate.getFullYear()}`);
    } else if (value === "monthly") {
      router.push(
        `/admin?type=${value}&year=${newDate.getFullYear()}&month=${
          ConvertDateId(newDate).month
        }`
      );
      setMonth(`${ConvertDateId(newDate).month}`);
    } else {
      router.push(
        `/admin?type=${value}&date=${ConvertDateId(newDate).fullDateNumber}`
      );
      setDate(`${ConvertDateId(newDate).fullDateNumber}`);
      setDateCalendar(newDate);
    }
  };

  let _years: number[] = [];

  for (let i = 2023 - 1; i < ConvertDateId(newDate).yy; i++) {
    _years = [..._years, i + 1];
  }

  _years.reverse();

  const handleSetYear = (value: string) => {
    setYear(value);
    router.push(`/admin?type=yearly&year=${value}`);
  };

  const handleSetMonthYear = (value: string) => {
    setYear(value);
    router.push(`/admin?type=monthly&year=${value}&month=${monthParams}`);
  };

  const handleSetMonth = (value: string) => {
    setMonth(value);

    router.push(`/admin?type=monthly&year=${yearParams}&month=${value}`);
  };

  const handleSetDate = (value: Date) => {
    setDate(`${ConvertDateId(value).fullDateNumber}`);
    setDateCalendar(value);
    router.push(
      `/admin?type=daily&date=${ConvertDateId(value).fullDateNumber}`
    );
    setIsOpenCalendar(false);
  };

  return (
    <div className="flex w-full mb-5 gap-1">
      <Select value={type} onValueChange={handleSetType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
            <SelectItem value="yearly">Tahunan</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {type === "yearly" ? (
        <Select value={year} onValueChange={handleSetYear}>
          <SelectTrigger className="w-[280px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {_years.map((year) => (
                <SelectItem value={year.toString()} key={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : type === "monthly" ? (
        <div className="flex gap-1">
          <Select value={year} onValueChange={handleSetMonthYear}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {_years.map((year) => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={handleSetMonth}>
            <SelectTrigger className="w-[280px] capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {_months.map((month, index) => (
                  <SelectItem value={month} key={index} className="capitalize">
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <Popover open={isOpenCalendar} onOpenChange={setIsOpenCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left capitalize font-normal",
                !date && "text-muted-foreground"
              )}
              onClick={() => setIsOpenCalendar(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {ConvertDateId(new Date(date)).fullDateName}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateCalendar}
              onSelect={(e) => handleSetDate(e ? e : newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DashboardSetDate;
