export type LeadStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "rejected";

export type ProfileRole = "admin" | "viewer";

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  base_price: number;
  duration_label: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  public_number: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  service_id: string | null;
  service_name: string;
  message: string | null;
  selected_options: string[];
  estimated_min: number | null;
  estimated_max: number | null;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      services: {
        Row: ServiceRow;
        Insert: Partial<ServiceRow> & { slug: string; name: string; base_price: number };
        Update: Partial<ServiceRow>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: Partial<LeadRow> & {
          public_number: string;
          name: string;
          phone: string;
          service_name: string;
        };
        Update: Partial<LeadRow>;
        Relationships: [
          {
            foreignKeyName: "leads_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
      generate_lead_number: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
