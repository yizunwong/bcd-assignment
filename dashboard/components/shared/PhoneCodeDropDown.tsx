"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState, useMemo } from "react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Input } from "@/components/ui/input"; // your styled input
import { ChevronDown } from "lucide-react";

type PhoneCodeDropdownProps = {
  value: string;
  onChange: (val: string) => void;
};

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const allCountries = getCountries().map((code) => ({
  code,
  dialCode: `+${getCountryCallingCode(code)}`,
  flag: getFlagEmoji(code),
}));

export default function PhoneCodeDropdown({
  value,
  onChange,
}: PhoneCodeDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return allCountries.filter(
      (c) =>
        c.code.toLowerCase().includes(query.toLowerCase()) ||
        c.dialCode.includes(query)
    );
  }, [query]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="w-28 form-input flex justify-between items-center px-3 py-2 border rounded-md bg-white dark:bg-slate-900"
          type="button"
        >
          {value || "Code"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-64 bg-white dark:bg-slate-800 border p-2 rounded-md shadow-md z-50"
          side="bottom"
          align="start"
        >
          <Input
            placeholder="Search code or country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2 w-full"
          />
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.dialCode);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-2 py-1 rounded hover:bg-emerald-100 dark:hover:bg-slate-700"
              >
                {c.flag} ({c.dialCode})
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-slate-500 px-2">No match</div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
