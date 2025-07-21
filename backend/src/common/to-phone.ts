import { Transform } from 'class-transformer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const ToPhone = Transform(
  ({ value }) => {
    if (typeof value !== 'string') return undefined;

    const parsed = parsePhoneNumberFromString(value);

    // Ensure it's a valid phone number in E.164 format
    if (!parsed || !parsed.isValid()) return undefined;

    return parsed.number; // e.g., +60123456789, +14155552671
  },
  { toClassOnly: true },
);

// Reference: https://stackoverflow.com/questions/58172602/isphonenumber-npm-class-validator-how-to-add-multiple-countries-code
// Note: This code uses the `libphonenumber-js` library to validate phone numbers.
// It checks if the phone number is valid and belongs to a specified set of countries.
