export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string;
          id: string;
          ip: string | null;
          timestamp: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          id?: string;
          ip?: string | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          id?: string;
          ip?: string | null;
          timestamp?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      admin_details: {
        Row: {
          company_id: number;
          user_id: string;
          verified_at: string | null;
        };
        Insert: {
          company_id: number;
          user_id: string;
          verified_at?: string | null;
        };
        Update: {
          company_id?: number;
          user_id?: string;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_details_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'admin_details_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_details';
            referencedColumns: ['user_id'];
          },
        ];
      };
      claim_documents: {
        Row: {
          claim_id: number;
          id: number;
          name: string;
          path: string;
        };
        Insert: {
          claim_id: number;
          id?: number;
          name: string;
          path: string;
        };
        Update: {
          claim_id?: number;
          id?: number;
          name?: string;
          path?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'claim_documents_claim_id_fkey';
            columns: ['claim_id'];
            isOneToOne: false;
            referencedRelation: 'claims';
            referencedColumns: ['id'];
          },
        ];
      };
      claim_types: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      claims: {
        Row: {
          amount: number;
          claimed_date: string | null;
          coverage_id: number;
          description: string | null;
          id: number;
          priority: Database['public']['Enums']['claim_priority'];
          processed_date: string | null;
          status: Database['public']['Enums']['claim_status'];
          submitted_by: string;
          submitted_date: string;
          type: string;
        };
        Insert: {
          amount?: number;
          claimed_date?: string | null;
          coverage_id: number;
          description?: string | null;
          id?: number;
          priority?: Database['public']['Enums']['claim_priority'];
          processed_date?: string | null;
          status?: Database['public']['Enums']['claim_status'];
          submitted_by: string;
          submitted_date: string;
          type: string;
        };
        Update: {
          amount?: number;
          claimed_date?: string | null;
          coverage_id?: number;
          description?: string | null;
          id?: number;
          priority?: Database['public']['Enums']['claim_priority'];
          processed_date?: string | null;
          status?: Database['public']['Enums']['claim_status'];
          submitted_by?: string;
          submitted_date?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'claims_coverage_id_fkey';
            columns: ['coverage_id'];
            isOneToOne: false;
            referencedRelation: 'coverage';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'claims_submitted_by_fkey1';
            columns: ['submitted_by'];
            isOneToOne: false;
            referencedRelation: 'user_details';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'claims_submitted_by_fkey2';
            columns: ['submitted_by'];
            isOneToOne: false;
            referencedRelation: 'policyholder_details';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'claims_type_fkey';
            columns: ['type'];
            isOneToOne: false;
            referencedRelation: 'claim_types';
            referencedColumns: ['name'];
          },
        ];
      };
      companies: {
        Row: {
          address: string;
          contact_no: string | null;
          created_at: string;
          employees_number: Database['public']['Enums']['number_of_employees'];
          id: number;
          license_number: string;
          name: string;
          website: string | null;
          years_in_business: Database['public']['Enums']['years_in_business'];
        };
        Insert: {
          address: string;
          contact_no?: string | null;
          created_at?: string;
          employees_number?: Database['public']['Enums']['number_of_employees'];
          id?: number;
          license_number: string;
          name: string;
          website?: string | null;
          years_in_business: Database['public']['Enums']['years_in_business'];
        };
        Update: {
          address?: string;
          contact_no?: string | null;
          created_at?: string;
          employees_number?: Database['public']['Enums']['number_of_employees'];
          id?: number;
          license_number?: string;
          name?: string;
          website?: string | null;
          years_in_business?: Database['public']['Enums']['years_in_business'];
        };
        Relationships: [];
      };
      company_documents: {
        Row: {
          company_id: number;
          id: number;
          name: string;
          path: string;
        };
        Insert: {
          company_id: number;
          id?: number;
          name: string;
          path: string;
        };
        Update: {
          company_id?: number;
          id?: number;
          name?: string;
          path?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'company_documents_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
      coverage: {
        Row: {
          agreement_cid: string;
          end_date: string;
          id: number;
          next_payment_date: string;
          policy_id: number;
          start_date: string;
          status: Database['public']['Enums']['coverage_status'];
          user_id: string;
          utilization_rate: number;
        };
        Insert: {
          agreement_cid: string;
          end_date: string;
          id?: number;
          next_payment_date: string;
          policy_id: number;
          start_date: string;
          status?: Database['public']['Enums']['coverage_status'];
          user_id: string;
          utilization_rate?: number;
        };
        Update: {
          agreement_cid?: string;
          end_date?: string;
          id?: number;
          next_payment_date?: string;
          policy_id?: number;
          start_date?: string;
          status?: Database['public']['Enums']['coverage_status'];
          user_id?: string;
          utilization_rate?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'coverage_policy_id_fkey';
            columns: ['policy_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      permissions: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      policies: {
        Row: {
          category: Database['public']['Enums']['policy_category'];
          coverage: number;
          created_by: string;
          description: string | null;
          duration_days: number;
          id: number;
          name: string;
          popular: boolean;
          premium: number;
          rating: number;
          status: Database['public']['Enums']['policy_status'];
        };
        Insert: {
          category?: Database['public']['Enums']['policy_category'];
          coverage: number;
          created_by: string;
          description?: string | null;
          duration_days?: number;
          id?: number;
          name: string;
          popular: boolean;
          premium: number;
          rating: number;
          status?: Database['public']['Enums']['policy_status'];
        };
        Update: {
          category?: Database['public']['Enums']['policy_category'];
          coverage?: number;
          created_by?: string;
          description?: string | null;
          duration_days?: number;
          id?: number;
          name?: string;
          popular?: boolean;
          premium?: number;
          rating?: number;
          status?: Database['public']['Enums']['policy_status'];
        };
        Relationships: [
          {
            foreignKeyName: 'policies_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'admin_details';
            referencedColumns: ['user_id'];
          },
        ];
      };
      policy_claim_type: {
        Row: {
          claim_type_id: number;
          created_at: string;
          id: number;
          policy_id: number;
        };
        Insert: {
          claim_type_id: number;
          created_at?: string;
          id?: number;
          policy_id: number;
        };
        Update: {
          claim_type_id?: number;
          created_at?: string;
          id?: number;
          policy_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'policy_claim_type_claim_type_id_fkey';
            columns: ['claim_type_id'];
            isOneToOne: false;
            referencedRelation: 'claim_types';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'policy_claim_type_policy_id_fkey';
            columns: ['policy_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      policy_documents: {
        Row: {
          cid: string;
          id: number;
          name: string;
          path: string;
          policy_id: number;
        };
        Insert: {
          cid: string;
          id?: number;
          name: string;
          path: string;
          policy_id: number;
        };
        Update: {
          cid?: string;
          id?: number;
          name?: string;
          path?: string;
          policy_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_policy_id_fkey';
            columns: ['policy_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      policyholder_details: {
        Row: {
          address: string;
          date_of_birth: string;
          occupation: string;
          user_id: string;
        };
        Insert: {
          address: string;
          date_of_birth: string;
          occupation: string;
          user_id: string;
        };
        Update: {
          address?: string;
          date_of_birth?: string;
          occupation?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'policyholder_details_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_details';
            referencedColumns: ['user_id'];
          },
        ];
      };
      reviews: {
        Row: {
          comment: string | null;
          id: number;
          policy_id: number | null;
          rating: number;
          user_id: string | null;
          user_name: string;
        };
        Insert: {
          comment?: string | null;
          id?: number;
          policy_id?: number | null;
          rating: number;
          user_id?: string | null;
          user_name: string;
        };
        Update: {
          comment?: string | null;
          id?: number;
          policy_id?: number | null;
          rating?: number;
          user_id?: string | null;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_policy_id_fkey';
            columns: ['policy_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      role_permissions: {
        Row: {
          enabled: boolean | null;
          permission_id: string;
          role_id: string;
        };
        Insert: {
          enabled?: boolean | null;
          permission_id: string;
          role_id: string;
        };
        Update: {
          enabled?: boolean | null;
          permission_id?: string;
          role_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permissions_permission_id_fkey';
            columns: ['permission_id'];
            isOneToOne: false;
            referencedRelation: 'permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'role_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
        ];
      };
      roles: {
        Row: {
          color: string | null;
          description: string | null;
          id: string;
          name: string;
          settings: Json | null;
        };
        Insert: {
          color?: string | null;
          description?: string | null;
          id: string;
          name: string;
          settings?: Json | null;
        };
        Update: {
          color?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          settings?: Json | null;
        };
        Relationships: [];
      };
      user_details: {
        Row: {
          bio: string | null;
          first_name: string;
          last_name: string;
          phone: string | null;
          status: Database['public']['Enums']['user_status'];
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          first_name: string;
          last_name: string;
          phone?: string | null;
          status?: Database['public']['Enums']['user_status'];
          user_id: string;
        };
        Update: {
          bio?: string | null;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          status?: Database['public']['Enums']['user_status'];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_policy_revenue: {
        Args: Record<PropertyKey, never>;
        Returns: {
          policy_id: number;
          total_revenue: number;
        }[];
      };
      count_active_users_by_company: {
        Args: Record<PropertyKey, never>;
        Returns: {
          company_id: number;
          active_users: number;
        }[];
      };
      count_policy_sales: {
        Args: Record<PropertyKey, never>;
        Returns: {
          policy_id: number;
          sales: number;
        }[];
      };
    };
    Enums: {
      claim_priority: 'high' | 'medium' | 'low';
      claim_status: 'pending' | 'approved' | 'rejected' | 'claimed';
      coverage_status: 'active' | 'limitExceeded' | 'expired' | 'suspended';
      number_of_employees:
        | '1-10 employees'
        | '11-50 employees'
        | '51-200 employees'
        | '201-500 employees'
        | '500+ employees';
      policy_category: 'health' | 'crop' | 'travel';
      policy_status: 'active' | 'deactivated';
      role: 'admin' | 'user';
      user_status: 'active' | 'deactivated';
      years_in_business:
        | '0-1 years'
        | '2-5 years'
        | '6-10 years'
        | '11-20 years'
        | '20+ years';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      claim_priority: ['high', 'medium', 'low'],
      claim_status: ['pending', 'approved', 'rejected', 'claimed'],
      coverage_status: ['active', 'limitExceeded', 'expired', 'suspended'],
      number_of_employees: [
        '1-10 employees',
        '11-50 employees',
        '51-200 employees',
        '201-500 employees',
        '500+ employees',
      ],
      policy_category: ['health', 'crop', 'travel'],
      policy_status: ['active', 'deactivated'],
      role: ['admin', 'user'],
      user_status: ['active', 'deactivated'],
      years_in_business: [
        '0-1 years',
        '2-5 years',
        '6-10 years',
        '11-20 years',
        '20+ years',
      ],
    },
  },
} as const;
