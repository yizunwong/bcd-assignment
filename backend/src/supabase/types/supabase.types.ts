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
          company_address: string | null;
          company_name: string | null;
          employee_id: string;
          license_no: string;
          user_id: string;
        };
        Insert: {
          company_address?: string | null;
          company_name?: string | null;
          employee_id: string;
          license_no: string;
          user_id: string;
        };
        Update: {
          company_address?: string | null;
          company_name?: string | null;
          employee_id?: string;
          license_no?: string;
          user_id?: string;
        };
        Relationships: [
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
          claim_type: string;
          claimed_date: string | null;
          description: string | null;
          id: number;
          policy_id: number | null;
          processed_date: string | null;
          status: Database['public']['Enums']['claim_status'];
          submitted_date: string;
          user_id: string | null;
        };
        Insert: {
          amount?: number;
          claim_type: string;
          claimed_date?: string | null;
          description?: string | null;
          id?: number;
          policy_id?: number | null;
          processed_date?: string | null;
          status?: Database['public']['Enums']['claim_status'];
          submitted_date: string;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          claim_type?: string;
          claimed_date?: string | null;
          description?: string | null;
          id?: number;
          policy_id?: number | null;
          processed_date?: string | null;
          status?: Database['public']['Enums']['claim_status'];
          submitted_date?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'claims_claim_type_fkey';
            columns: ['claim_type'];
            isOneToOne: false;
            referencedRelation: 'claim_types';
            referencedColumns: ['name'];
          },
          {
            foreignKeyName: 'claims_policy_id_fkey';
            columns: ['policy_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      coverage: {
        Row: {
          end_date: string;
          id: number;
          next_payment_date: string;
          policy_id: number | null;
          start_date: string;
          status: Database['public']['Enums']['coverage_status'];
          user_id: string | null;
          utilization_rate: number;
        };
        Insert: {
          end_date: string;
          id?: number;
          next_payment_date: string;
          policy_id?: number | null;
          start_date: string;
          status?: Database['public']['Enums']['coverage_status'];
          user_id?: string | null;
          utilization_rate?: number;
        };
        Update: {
          end_date?: string;
          id?: number;
          next_payment_date?: string;
          policy_id?: number | null;
          start_date?: string;
          status?: Database['public']['Enums']['coverage_status'];
          user_id?: string | null;
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
          category: string;
          coverage: number;
          created_by: string;
          description: string | null;
          id: number;
          name: string;
          popular: boolean;
          premium: string;
          provider: string;
          rating: number;
        };
        Insert: {
          category: string;
          coverage: number;
          created_by: string;
          description?: string | null;
          id?: number;
          name: string;
          popular: boolean;
          premium: string;
          provider: string;
          rating: number;
        };
        Update: {
          category?: string;
          coverage?: number;
          created_by?: string;
          description?: string | null;
          id?: number;
          name?: string;
          popular?: boolean;
          premium?: string;
          provider?: string;
          rating?: number;
        };
        Relationships: [];
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
          id: number;
          name: string;
          path: string;
          policy_id: number;
        };
        Insert: {
          id?: number;
          name: string;
          path: string;
          policy_id: number;
        };
        Update: {
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
          address: string | null;
          date_of_birth: string;
          occupation: string | null;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          date_of_birth: string;
          occupation?: string | null;
          user_id: string;
        };
        Update: {
          address?: string | null;
          date_of_birth?: string;
          occupation?: string | null;
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
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          status: Database['public']['Enums']['user_status'];
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          status?: Database['public']['Enums']['user_status'];
          user_id: string;
        };
        Update: {
          bio?: string | null;
          first_name?: string | null;
          last_name?: string | null;
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
      [_ in never]: never;
    };
    Enums: {
      claim_status: 'pending' | 'approved' | 'rejected' | 'claimed';
      coverage_status: 'active' | 'limitExceeded' | 'expired' | 'suspended';
      role: 'admin' | 'user';
      user_status: 'active' | 'deactivated';
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
      claim_status: ['pending', 'approved', 'rejected', 'claimed'],
      coverage_status: ['active', 'limitExceeded', 'expired', 'suspended'],
      role: ['admin', 'user'],
      user_status: ['active', 'deactivated'],
    },
  },
} as const;
