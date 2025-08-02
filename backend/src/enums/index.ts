import { Database } from 'src/supabase/types/supabase.types';

export enum UserStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

export enum UserRole {
  POLICYHOLDER = 'policyholder',
  INSURANCE_ADMIN = 'insurance_admin',
  SYSTEM_ADMIN = 'system_admin',
}

export enum YearsInBusiness {
  ZERO_TO_ONE = '0-1 years',
  TWO_TO_FIVE = '2-5 years',
  SIX_TO_TEN = '6-10 years',
  ELEVEN_TO_TWENTY = '11-20 years',
  TWENTY_PLUS = '20+ years',
}

export enum NumberOfEmployees {
  ZERO_TO_TEN = '1-10 employees',
  ELEVEN_TO_FIFTY = '11-50 employees',
  FIFTY_TO_TWO_HUNDRED = '51-200 employees',
  TWO_HUNDRED_TO_FIVE_HUNDRED = '201-500 employees',
  OVER_500 = '500+ employees',
}

export enum PolicyCategory {
  HEALTH = 'health',
  TRAVEL = 'travel',
  CROP = 'crop',
}

export type PolicyCategoryQuery = 'all' | keyof typeof PolicyCategory;

export type AdminDetails = Partial<
  Database['public']['Tables']['admin_details']['Row']
> & {
  company?: {
    name?: string;
    address?: string;
    license_number?: string;
    contact_no: string | null;
    website: string | null;
    years_in_business?: Database['public']['Enums']['years_in_business'];
  };
};

export type PolicyholderDetails = Partial<
  Database['public']['Tables']['policyholder_details']['Row']
> | null;

export type UserDetails = Database['public']['Tables']['user_details']['Row'];
