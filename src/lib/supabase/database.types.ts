/**
 * Tipos de la base de Kushtal, espejo de supabase/migrations/0001_init.sql
 *
 * Cuando el proyecto de Supabase esté arriba podés regenerarlo con:
 *   npx supabase gen types typescript --project-id TU_REF > src/lib/supabase/database.types.ts
 *
 * Mientras tanto este archivo es la fuente de verdad y da el mismo type-safety.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          default_address: Json | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          default_address?: Json | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          default_address?: Json | null;
        };
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tagline: string | null;
          description: string | null;
          category: string;
          base_price_cents: number;
          badge: string | null;
          capacity_label: string | null;
          leather_label: string | null;
          hero_image: string | null;
          images: string[];
          tones: string[];
          tags: string[];
          texture: string | null;
          featured: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          category: string;
          base_price_cents: number;
          badge?: string | null;
          capacity_label?: string | null;
          leather_label?: string | null;
          hero_image?: string | null;
          images?: string[];
          tones?: string[];
          tags?: string[];
          texture?: string | null;
          featured?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };

      option_groups: {
        Row: {
          id: string;
          product_id: string;
          code: string;
          label: string;
          helper: string | null;
          type: "color" | "select" | "engraving" | "toggle";
          required: boolean;
          max_length: number | null;
          price_delta_cents: number;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          code: string;
          label: string;
          helper?: string | null;
          type: "color" | "select" | "engraving" | "toggle";
          required?: boolean;
          max_length?: number | null;
          price_delta_cents?: number;
          position?: number;
        };
        Update: Partial<Database["public"]["Tables"]["option_groups"]["Insert"]>;
        Relationships: [];
      };

      option_values: {
        Row: {
          id: string;
          group_id: string;
          code: string;
          label: string;
          description: string | null;
          hex: string | null;
          price_delta_cents: number;
          image_url: string | null;
          position: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          group_id: string;
          code: string;
          label: string;
          description?: string | null;
          hex?: string | null;
          price_delta_cents?: number;
          image_url?: string | null;
          position?: number;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["option_values"]["Insert"]>;
        Relationships: [];
      };

      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
        Relationships: [];
      };

      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          config: Json;
          unit_price_cents: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          config?: Json;
          unit_price_cents: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
        Relationships: [];
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          email: string;
          status:
            | "pending"
            | "paid"
            | "in_atelier"
            | "shipped"
            | "delivered"
            | "cancelled";
          subtotal_cents: number;
          shipping_cents: number;
          total_cents: number;
          shipping_method: string;
          shipping_address: Json;
          stripe_session_id: string | null;
          access_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          email: string;
          status?:
            | "pending"
            | "paid"
            | "in_atelier"
            | "shipped"
            | "delivered"
            | "cancelled";
          subtotal_cents: number;
          shipping_cents?: number;
          total_cents: number;
          shipping_method?: string;
          shipping_address: Json;
          stripe_session_id?: string | null;
          access_token?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_slug: string;
          product_image: string | null;
          config: Json;
          details: Json;
          unit_price_cents: number;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_slug: string;
          product_image?: string | null;
          config?: Json;
          details?: Json;
          unit_price_cents: number;
          quantity: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
    };

    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
