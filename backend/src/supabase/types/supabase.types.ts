export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
      claim_documents: {
        Row: {
          claim_id: number;
          id: number;
          name: string;
          url: string;
        };
        Insert: {
          claim_id: number;
          id?: number;
          name: string;
          url: string;
        };
        Update: {
          claim_id?: number;
          id?: number;
          name?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'claim_documents_claim_id_fkey';
            columns: ['claim_id'];
            isOneToOne: false;
            referencedRelation: 'policies';
            referencedColumns: ['id'];
          },
        ];
      };
      claims: {
        Row: {
          amount: unknown;
          claim_type: string;
          claimed_date: string | null;
          description: string | null;
          id: number;
          policy_id: number | null;
          processed_date: string | null;
          status: string;
          submitted_date: string;
          user_id: string | null;
        };
        Insert: {
          amount: unknown;
          claim_type: string;
          claimed_date?: string | null;
          description?: string | null;
          id?: number;
          policy_id?: number | null;
          processed_date?: string | null;
          status: string;
          submitted_date: string;
          user_id?: string | null;
        };
        Update: {
          amount?: unknown;
          claim_type?: string;
          claimed_date?: string | null;
          description?: string | null;
          id?: number;
          policy_id?: number | null;
          processed_date?: string | null;
          status?: string;
          submitted_date?: string;
          user_id?: string | null;
        };
        Relationships: [
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
          status: string;
          user_id: string | null;
          utilization_rate: number;
        };
        Insert: {
          end_date: string;
          id?: number;
          next_payment_date: string;
          policy_id?: number | null;
          start_date: string;
          status: string;
          user_id?: string | null;
          utilization_rate: number;
        };
        Update: {
          end_date?: string;
          id?: number;
          next_payment_date?: string;
          policy_id?: number | null;
          start_date?: string;
          status?: string;
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
          description: string | null;
          features: string[];
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
          description?: string | null;
          features: string[];
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
          description?: string | null;
          features?: string[];
          id?: number;
          name?: string;
          popular?: boolean;
          premium?: string;
          provider?: string;
          rating?: number;
        };
        Relationships: [];
      };
      policy_documents: {
        Row: {
          id: number;
          name: string;
          policy_id: number;
          url: string;
        };
        Insert: {
          id?: number;
          name: string;
          policy_id: number;
          url: string;
        };
        Update: {
          id?: number;
          name?: string;
          policy_id?: number;
          url?: string;
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
      reviews: {
        Row: {
          comment: string | null;
          id: number;
          rating: number;
          user_id: string | null;
          user_name: string;
        };
        Insert: {
          comment?: string | null;
          id?: number;
          rating: number;
          user_id?: string | null;
          user_name: string;
        };
        Update: {
          comment?: string | null;
          id?: number;
          rating?: number;
          user_id?: string | null;
          user_name?: string;
        };
        Relationships: [];
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
      user_profiles: {
        Row: {
          claims: number | null;
          company: string | null;
          join_date: string | null;
          kyc_status: string | null;
          location: string | null;
          login_attempts: number | null;
          notes: string | null;
          policies: number | null;
          role: string;
          status: string | null;
          user_id: string;
        };
        Insert: {
          claims?: number | null;
          company?: string | null;
          join_date?: string | null;
          kyc_status?: string | null;
          location?: string | null;
          login_attempts?: number | null;
          notes?: string | null;
          policies?: number | null;
          role: string;
          status?: string | null;
          user_id: string;
        };
        Update: {
          claims?: number | null;
          company?: string | null;
          join_date?: string | null;
          kyc_status?: string | null;
          location?: string | null;
          login_attempts?: number | null;
          notes?: string | null;
          policies?: number | null;
          role?: string;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          username?: string | null;
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
      role: 'admin' | 'user';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      role: ['admin', 'user'],
    },
  },
} as const;
