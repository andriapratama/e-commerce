import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InterPhoneCodes } from "@/utils/ValidatePhoneNumber";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  phoneCode: string;
  setPhoneCode: Dispatch<SetStateAction<string>>;
}

const ProfileSelectInterCodePhone: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  phoneCode,
  setPhoneCode,
}) => {
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[80px] text-center"
        >
          {phoneCode}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <ScrollArea className="h-[300px]">
            <CommandInput placeholder="Search phone code" />
            <CommandEmpty>No phone code found.</CommandEmpty>
            <CommandGroup>
              {InterPhoneCodes.map((interPhoneCode, index) => (
                <CommandItem
                  key={index}
                  value={interPhoneCode.code}
                  onSelect={(currentPhoneCode) => {
                    setPhoneCode(
                      currentPhoneCode === phoneCode ? "" : currentPhoneCode
                    );
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      phoneCode === interPhoneCode.code
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {`${interPhoneCode.country} (${interPhoneCode.code})`}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileSelectInterCodePhone;
