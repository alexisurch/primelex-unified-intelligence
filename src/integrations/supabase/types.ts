export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id: string | null
          actor_name: string | null
          actor_role: string | null
          changed_fields: string[] | null
          created_at: string
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          field_name: string | null
          id: string
          ip_address: unknown
          module: string
          new_value: string | null
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          organization_id: string | null
          previous_value: string | null
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string | null
          changed_fields?: string[] | null
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          field_name?: string | null
          id?: string
          ip_address?: unknown
          module?: string
          new_value?: string | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          organization_id?: string | null
          previous_value?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string | null
          changed_fields?: string[] | null
          created_at?: string
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          field_name?: string | null
          id?: string
          ip_address?: unknown
          module?: string
          new_value?: string | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          organization_id?: string | null
          previous_value?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          organization_id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          organization_id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          organization_id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          archived: boolean
          client_number: string | null
          contact_name: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          industry: string | null
          name: string
          organization_id: string
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          archived?: boolean
          client_number?: string | null
          contact_name?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name: string
          organization_id: string
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          archived?: boolean
          client_number?: string | null
          contact_name?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string | null
          author_name: string
          author_role: string | null
          body: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          entity_id: string
          entity_type: string
          id: string
          mentions: string[]
          organization_id: string
          parent_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          author_role?: string | null
          body: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          mentions?: string[]
          organization_id: string
          parent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          author_role?: string | null
          body?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          mentions?: string[]
          organization_id?: string
          parent_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_documents: {
        Row: {
          created_at: string | null
          document_type: string
          driver_id: string
          expiry_date: string | null
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          organization_id: string
          status: Database["public"]["Enums"]["document_status"] | null
          updated_at: string | null
          uploaded_by: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          driver_id: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          organization_id: string
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          driver_id?: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          description: string | null
          driver_id: string
          event_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          organization_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          driver_id: string
          event_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          organization_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          driver_id?: string
          event_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_history_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_history_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          archived: boolean
          created_at: string | null
          created_by: string | null
          driver_number: string
          email: string | null
          emergency_contact: string | null
          fleet_manager_id: string | null
          id: string
          license_class: Database["public"]["Enums"]["license_class"] | null
          license_expiry: string | null
          license_number: string
          medical_expiry: string | null
          name: string
          organization_id: string
          phone: string | null
          risk_level: Database["public"]["Enums"]["driver_risk"] | null
          safety_score: number | null
          status: Database["public"]["Enums"]["driver_status"]
          trainings: number | null
          truck_id: string | null
          updated_at: string | null
          violations: number | null
        }
        Insert: {
          address?: string | null
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          driver_number: string
          email?: string | null
          emergency_contact?: string | null
          fleet_manager_id?: string | null
          id?: string
          license_class?: Database["public"]["Enums"]["license_class"] | null
          license_expiry?: string | null
          license_number: string
          medical_expiry?: string | null
          name: string
          organization_id: string
          phone?: string | null
          risk_level?: Database["public"]["Enums"]["driver_risk"] | null
          safety_score?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          trainings?: number | null
          truck_id?: string | null
          updated_at?: string | null
          violations?: number | null
        }
        Update: {
          address?: string | null
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          driver_number?: string
          email?: string | null
          emergency_contact?: string | null
          fleet_manager_id?: string | null
          id?: string
          license_class?: Database["public"]["Enums"]["license_class"] | null
          license_expiry?: string | null
          license_number?: string
          medical_expiry?: string | null
          name?: string
          organization_id?: string
          phone?: string | null
          risk_level?: Database["public"]["Enums"]["driver_risk"] | null
          safety_score?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          trainings?: number | null
          truck_id?: string | null
          updated_at?: string | null
          violations?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          bucket_id: string
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          expires_on: string | null
          file_name: string
          id: string
          mime_type: string | null
          organization_id: string
          size_bytes: number | null
          storage_path: string
          updated_at: string
          updated_by: string | null
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          bucket_id: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_on?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          organization_id: string
          size_bytes?: number | null
          storage_path: string
          updated_at?: string
          updated_by?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          bucket_id?: string
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          expires_on?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          organization_id?: string
          size_bytes?: number | null
          storage_path?: string
          updated_at?: string
          updated_by?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_manager_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          fleet_manager_id: string
          id: string
          organization_id: string
          status: Database["public"]["Enums"]["assignment_status"]
          truck_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          fleet_manager_id: string
          id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
          truck_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          fleet_manager_id?: string
          id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          truck_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_manager_assignments_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_manager_assignments_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_manager_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_manager_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_manager_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_manager_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_managers: {
        Row: {
          archived: boolean
          created_at: string | null
          created_by: string | null
          date_joined: string | null
          department: string | null
          email: string | null
          employee_id: string
          id: string
          name: string
          organization_id: string
          phone: string | null
          photo: string | null
          role: string
          status: Database["public"]["Enums"]["fleet_manager_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          date_joined?: string | null
          department?: string | null
          email?: string | null
          employee_id: string
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          photo?: string | null
          role?: string
          status?: Database["public"]["Enums"]["fleet_manager_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          date_joined?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          photo?: string | null
          role?: string
          status?: Database["public"]["Enums"]["fleet_manager_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_managers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          client_id: string | null
          corrective_actions: string | null
          created_at: string | null
          description: string | null
          documents: string[] | null
          driver_id: string | null
          est_delay_min: number | null
          est_financial_impact: number | null
          id: string
          incident_date: string | null
          incident_number: string
          investigator: string | null
          location: string | null
          organization_id: string
          photos: string[] | null
          reported_by: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: Database["public"]["Enums"]["incident_status"]
          trip_id: string | null
          truck_id: string | null
          type: Database["public"]["Enums"]["incident_type"]
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          corrective_actions?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          driver_id?: string | null
          est_delay_min?: number | null
          est_financial_impact?: number | null
          id?: string
          incident_date?: string | null
          incident_number: string
          investigator?: string | null
          location?: string | null
          organization_id: string
          photos?: string[] | null
          reported_by?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          trip_id?: string | null
          truck_id?: string | null
          type: Database["public"]["Enums"]["incident_type"]
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          corrective_actions?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          driver_id?: string | null
          est_delay_min?: number | null
          est_financial_impact?: number | null
          id?: string
          incident_date?: string | null
          incident_number?: string
          investigator?: string | null
          location?: string | null
          organization_id?: string
          photos?: string[] | null
          reported_by?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          trip_id?: string | null
          truck_id?: string | null
          type?: Database["public"]["Enums"]["incident_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_incidents_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_incidents_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_incidents_trip"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          email: string
          expires_at: string
          id: string
          organization_id: string
          role_id: string | null
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email: string
          expires_at?: string
          id?: string
          organization_id: string
          role_id?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          organization_id?: string
          role_id?: string | null
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          assigned_to: string | null
          body: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
          module: string | null
          organization_id: string
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          recipient_id: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          action_url?: string | null
          assigned_to?: string | null
          body?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          module?: string | null
          organization_id: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          action_url?: string | null
          assigned_to?: string | null
          body?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          module?: string | null
          organization_id?: string
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_billing: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          billing_email: string | null
          billing_name: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          organization_id: string
          payment_method_brand: string | null
          payment_method_last4: string | null
          postal_code: string | null
          state: string | null
          tax_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          billing_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          organization_id: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          billing_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_billing_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_branding: {
        Row: {
          created_at: string
          favicon_url: string | null
          id: string
          logo_path: string | null
          logo_url: string | null
          organization_id: string
          primary_color: string
          secondary_color: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_path?: string | null
          logo_url?: string | null
          organization_id: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_path?: string | null
          logo_url?: string | null
          organization_id?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_branding_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_integrations: {
        Row: {
          category: string | null
          config: Json
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          last_synced_at: string | null
          organization_id: string
          provider_key: string
          provider_name: string
          status: Database["public"]["Enums"]["integration_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          config?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          last_synced_at?: string | null
          organization_id: string
          provider_key: string
          provider_name: string
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          config?: Json
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          last_synced_at?: string | null
          organization_id?: string
          provider_key?: string
          provider_name?: string
          status?: Database["public"]["Enums"]["integration_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_integrations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          invited_by: string | null
          is_owner: boolean
          joined_at: string | null
          organization_id: string
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          invited_by?: string | null
          is_owner?: boolean
          joined_at?: string | null
          organization_id: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          invited_by?: string | null
          is_owner?: boolean
          joined_at?: string | null
          organization_id?: string
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_preferences: {
        Row: {
          created_at: string
          density: string
          digest_frequency: string
          email_notifications: boolean
          id: string
          inapp_notifications: boolean
          organization_id: string
          theme: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          density?: string
          digest_frequency?: string
          email_notifications?: boolean
          id?: string
          inapp_notifications?: boolean
          organization_id: string
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          density?: string
          digest_frequency?: string
          email_notifications?: boolean
          id?: string
          inapp_notifications?: boolean
          organization_id?: string
          theme?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_preferences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          created_at: string
          currency: string
          date_format: string
          distance_unit: string
          fleet_tracking_mode: Database["public"]["Enums"]["tracking_mode"]
          fuel_variance_critical_pct: number
          fuel_variance_review_pct: number
          id: string
          learning_baseline_enabled: boolean
          organization_id: string
          timezone: string
          updated_at: string
          updated_by: string | null
          volume_unit: string
        }
        Insert: {
          created_at?: string
          currency?: string
          date_format?: string
          distance_unit?: string
          fleet_tracking_mode?: Database["public"]["Enums"]["tracking_mode"]
          fuel_variance_critical_pct?: number
          fuel_variance_review_pct?: number
          id?: string
          learning_baseline_enabled?: boolean
          organization_id: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
          volume_unit?: string
        }
        Update: {
          created_at?: string
          currency?: string
          date_format?: string
          distance_unit?: string
          fleet_tracking_mode?: Database["public"]["Enums"]["tracking_mode"]
          fuel_variance_critical_pct?: number
          fuel_variance_review_pct?: number
          id?: string
          learning_baseline_enabled?: boolean
          organization_id?: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
          volume_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          industry: string | null
          is_demo: boolean
          name: string
          short_name: string | null
          slug: string
          status: Database["public"]["Enums"]["org_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          is_demo?: boolean
          name: string
          short_name?: string | null
          slug: string
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          is_demo?: boolean
          name?: string
          short_name?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          module: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
          module: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          module?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          last_organization_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          last_organization_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          last_organization_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_last_organization_id_fkey"
            columns: ["last_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_system: boolean
          key: string
          name: string
          organization_id: string | null
          rank: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          key: string
          name: string
          organization_id?: string | null
          rank?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean
          key?: string
          name?: string
          organization_id?: string | null
          rank?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          archived: boolean
          created_at: string | null
          created_by: string | null
          destination: string
          distance_km: number | null
          estimated_duration_min: number | null
          fuel_estimate_l: number | null
          id: string
          name: string
          organization_id: string
          origin: string
          road_type: string | null
          route_number: string | null
          status: string | null
          terrain: string | null
          toll_cost: number | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          destination: string
          distance_km?: number | null
          estimated_duration_min?: number | null
          fuel_estimate_l?: number | null
          id?: string
          name: string
          organization_id: string
          origin: string
          road_type?: string | null
          route_number?: string | null
          status?: string | null
          terrain?: string | null
          toll_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string | null
          created_by?: string | null
          destination?: string
          distance_km?: number | null
          estimated_duration_min?: number | null
          fuel_estimate_l?: number | null
          id?: string
          name?: string
          organization_id?: string
          origin?: string
          road_type?: string | null
          route_number?: string | null
          status?: string | null
          terrain?: string | null
          toll_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_cents: number
          cancelled_at: string | null
          created_at: string
          created_by: string | null
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          deleted_at: string | null
          id: string
          interval: string
          organization_id: string
          plan_code: string
          plan_name: string
          seats: number
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_cents?: number
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          interval?: string
          organization_id: string
          plan_code?: string
          plan_name?: string
          seats?: number
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_cents?: number
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          deleted_at?: string | null
          id?: string
          interval?: string
          organization_id?: string
          plan_code?: string
          plan_name?: string
          seats?: number
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_costs: {
        Row: {
          amount: number
          cost_type: string
          created_at: string | null
          description: string | null
          id: string
          incurred_date: string | null
          organization_id: string
          recorded_by: string | null
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number
          cost_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          incurred_date?: string | null
          organization_id: string
          recorded_by?: string | null
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          cost_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          incurred_date?: string | null
          organization_id?: string
          recorded_by?: string | null
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_costs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_costs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_delays: {
        Row: {
          created_at: string | null
          delay_minutes: number
          id: string
          impact: string | null
          organization_id: string
          reason: string
          reported_by: string | null
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delay_minutes?: number
          id?: string
          impact?: string | null
          organization_id: string
          reason: string
          reported_by?: string | null
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delay_minutes?: number
          id?: string
          impact?: string | null
          organization_id?: string
          reason?: string
          reported_by?: string | null
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_delays_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_delays_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_documents: {
        Row: {
          created_at: string | null
          document_type: Database["public"]["Enums"]["trip_document_type"]
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          organization_id: string
          trip_id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["trip_document_type"]
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          organization_id: string
          trip_id: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["trip_document_type"]
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          organization_id?: string
          trip_id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_documents_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_timeline: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_type: Database["public"]["Enums"]["timeline_event_type"]
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          organization_id: string
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_type: Database["public"]["Enums"]["timeline_event_type"]
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          organization_id: string
          trip_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_type?: Database["public"]["Enums"]["timeline_event_type"]
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          organization_id?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_timeline_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_timeline_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          actual_arrival: string | null
          cargo_description: string | null
          cargo_weight_kg: number | null
          client_id: string | null
          created_at: string | null
          created_by: string | null
          delivery_notes: string | null
          delivery_time: string | null
          departure_time: string | null
          destination: string
          distance_km: number | null
          driver_id: string | null
          estimated_margin: number | null
          eta: string | null
          fleet_manager_id: string | null
          fuel_assigned_l: number | null
          fuel_cost: number | null
          id: string
          organization_id: string
          origin: string
          other_expenses: number | null
          priority: Database["public"]["Enums"]["trip_priority"] | null
          progress: number | null
          proof_of_delivery: string | null
          receiver_name: string | null
          revenue: number | null
          route_id: string | null
          status: Database["public"]["Enums"]["trip_status"]
          stops: number | null
          tracking_mode:
            | Database["public"]["Enums"]["tracking_mode_enum"]
            | null
          trip_number: string | null
          truck_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_arrival?: string | null
          cargo_description?: string | null
          cargo_weight_kg?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_notes?: string | null
          delivery_time?: string | null
          departure_time?: string | null
          destination: string
          distance_km?: number | null
          driver_id?: string | null
          estimated_margin?: number | null
          eta?: string | null
          fleet_manager_id?: string | null
          fuel_assigned_l?: number | null
          fuel_cost?: number | null
          id?: string
          organization_id: string
          origin: string
          other_expenses?: number | null
          priority?: Database["public"]["Enums"]["trip_priority"] | null
          progress?: number | null
          proof_of_delivery?: string | null
          receiver_name?: string | null
          revenue?: number | null
          route_id?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          stops?: number | null
          tracking_mode?:
            | Database["public"]["Enums"]["tracking_mode_enum"]
            | null
          trip_number?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_arrival?: string | null
          cargo_description?: string | null
          cargo_weight_kg?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_notes?: string | null
          delivery_time?: string | null
          departure_time?: string | null
          destination?: string
          distance_km?: number | null
          driver_id?: string | null
          estimated_margin?: number | null
          eta?: string | null
          fleet_manager_id?: string | null
          fuel_assigned_l?: number | null
          fuel_cost?: number | null
          id?: string
          organization_id?: string
          origin?: string
          other_expenses?: number | null
          priority?: Database["public"]["Enums"]["trip_priority"] | null
          progress?: number | null
          proof_of_delivery?: string | null
          receiver_name?: string | null
          revenue?: number | null
          route_id?: string | null
          status?: Database["public"]["Enums"]["trip_status"]
          stops?: number | null
          tracking_mode?:
            | Database["public"]["Enums"]["tracking_mode_enum"]
            | null
          trip_number?: string | null
          truck_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          driver_id: string
          fleet_manager_id: string | null
          id: string
          organization_id: string
          status: Database["public"]["Enums"]["assignment_status"]
          truck_id: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          driver_id: string
          fleet_manager_id?: string | null
          id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["assignment_status"]
          truck_id: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          driver_id?: string
          fleet_manager_id?: string | null
          id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          truck_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_fleet_manager_id_fkey"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_assignments_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_documents: {
        Row: {
          created_at: string | null
          document_type: string
          expiry_date: string | null
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          organization_id: string
          status: Database["public"]["Enums"]["document_status"] | null
          truck_id: string
          updated_at: string | null
          uploaded_by: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          organization_id: string
          status?: Database["public"]["Enums"]["document_status"] | null
          truck_id: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          expiry_date?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["document_status"] | null
          truck_id?: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_documents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_documents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_documents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_fuel: {
        Row: {
          assignment_type: string | null
          created_at: string | null
          driver_id: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          location: string | null
          note: string | null
          organization_id: string
          quantity: number
          recorded_by: string | null
          status: Database["public"]["Enums"]["fuel_status"] | null
          total_amount: number | null
          transaction_date: string | null
          transaction_type: string | null
          trip_id: string | null
          truck_id: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string | null
          created_at?: string | null
          driver_id?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          location?: string | null
          note?: string | null
          organization_id: string
          quantity: number
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["fuel_status"] | null
          total_amount?: number | null
          transaction_date?: string | null
          transaction_type?: string | null
          trip_id?: string | null
          truck_id: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string | null
          created_at?: string | null
          driver_id?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          location?: string | null
          note?: string | null
          organization_id?: string
          quantity?: number
          recorded_by?: string | null
          status?: Database["public"]["Enums"]["fuel_status"] | null
          total_amount?: number | null
          transaction_date?: string | null
          transaction_type?: string | null
          trip_id?: string | null
          truck_id?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_truck_fuel_trip"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          organization_id: string
          truck_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          organization_id: string
          truck_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string
          truck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "truck_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_history_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_history_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_history_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_maintenance: {
        Row: {
          cost: number | null
          created_at: string | null
          created_by: string | null
          due_date: string | null
          id: string
          next_service_date: string | null
          organization_id: string
          performed_by: string | null
          priority: string | null
          service: string
          service_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          truck_id: string
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string | null
          work_done: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          next_service_date?: string | null
          organization_id: string
          performed_by?: string | null
          priority?: string | null
          service: string
          service_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          truck_id: string
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          work_done?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          id?: string
          next_service_date?: string | null
          organization_id?: string
          performed_by?: string | null
          priority?: string | null
          service?: string
          service_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          truck_id?: string
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          work_done?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_maintenance_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_utilisation: {
        Row: {
          created_at: string | null
          distance_km: number | null
          fuel_assigned_l: number | null
          fuel_cost: number | null
          id: string
          idle_hours: number | null
          organization_id: string
          snapshot_date: string
          status: Database["public"]["Enums"]["truck_status"] | null
          trips_count: number | null
          truck_id: string
          utilization_pct: number | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          fuel_assigned_l?: number | null
          fuel_cost?: number | null
          id?: string
          idle_hours?: number | null
          organization_id: string
          snapshot_date?: string
          status?: Database["public"]["Enums"]["truck_status"] | null
          trips_count?: number | null
          truck_id: string
          utilization_pct?: number | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          fuel_assigned_l?: number | null
          fuel_cost?: number | null
          id?: string
          idle_hours?: number | null
          organization_id?: string
          snapshot_date?: string
          status?: Database["public"]["Enums"]["truck_status"] | null
          trips_count?: number | null
          truck_id?: string
          utilization_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_utilisation_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_utilisation_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_utilisation_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_utilisation_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          archived: boolean
          capacity_kg: number | null
          created_at: string | null
          created_by: string | null
          driver_id: string | null
          engine_health: number | null
          fleet_manager_id: string | null
          fuel_level: number | null
          gps_status: Database["public"]["Enums"]["truck_gps_status"] | null
          id: string
          last_service_date: string | null
          location: string | null
          manufacturer: string | null
          model: string
          odometer_km: number | null
          organization_id: string
          plate: string
          route_id: string | null
          status: Database["public"]["Enums"]["truck_status"]
          tracking_number: string | null
          tracking_source: string | null
          truck_number: string
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null
          vin: string | null
          year: number | null
        }
        Insert: {
          archived?: boolean
          capacity_kg?: number | null
          created_at?: string | null
          created_by?: string | null
          driver_id?: string | null
          engine_health?: number | null
          fleet_manager_id?: string | null
          fuel_level?: number | null
          gps_status?: Database["public"]["Enums"]["truck_gps_status"] | null
          id?: string
          last_service_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model: string
          odometer_km?: number | null
          organization_id: string
          plate: string
          route_id?: string | null
          status?: Database["public"]["Enums"]["truck_status"]
          tracking_number?: string | null
          tracking_source?: string | null
          truck_number: string
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          archived?: boolean
          capacity_kg?: number | null
          created_at?: string | null
          created_by?: string | null
          driver_id?: string | null
          engine_health?: number | null
          fleet_manager_id?: string | null
          fuel_level?: number | null
          gps_status?: Database["public"]["Enums"]["truck_gps_status"] | null
          id?: string
          last_service_date?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string
          odometer_km?: number | null
          organization_id?: string
          plate?: string
          route_id?: string | null
          status?: Database["public"]["Enums"]["truck_status"]
          tracking_number?: string | null
          tracking_source?: string | null
          truck_number?: string
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trucks_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_route"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_route"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          organization_id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          organization_id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          is_primary: boolean
          name: string
          organization_id: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_primary?: boolean
          name: string
          organization_id: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          is_primary?: boolean
          name?: string
          organization_id?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      client_statistics: {
        Row: {
          active_trips: number | null
          address: string | null
          archived: boolean | null
          client_number: string | null
          completed_trips: number | null
          contact_name: string | null
          created_at: string | null
          created_by: string | null
          delayed_trips: number | null
          email: string | null
          id: string | null
          industry: string | null
          name: string | null
          organization_id: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          total_distance: number | null
          total_incidents: number | null
          total_revenue: number | null
          total_trips: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_performance: {
        Row: {
          active_trips: number | null
          address: string | null
          archived: boolean | null
          completed_trips: number | null
          created_at: string | null
          created_by: string | null
          critical_incidents: number | null
          driver_number: string | null
          email: string | null
          emergency_contact: string | null
          fleet_manager_id: string | null
          id: string | null
          license_class: Database["public"]["Enums"]["license_class"] | null
          license_expiry: string | null
          license_number: string | null
          medical_expiry: string | null
          name: string | null
          organization_id: string | null
          phone: string | null
          risk_level: Database["public"]["Enums"]["driver_risk"] | null
          safety_score: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          total_distance: number | null
          total_fuel_cost: number | null
          total_fuel_l: number | null
          total_incidents: number | null
          trainings: number | null
          truck_id: string | null
          truck_number: string | null
          truck_plate: string | null
          updated_at: string | null
          violations: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_drivers_truck"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_manager_performance: {
        Row: {
          active_trips: number | null
          archived: boolean | null
          assigned_drivers: number | null
          assigned_trucks: number | null
          completed_trips: number | null
          created_at: string | null
          created_by: string | null
          date_joined: string | null
          delayed_trips: number | null
          department: string | null
          email: string | null
          employee_id: string | null
          id: string | null
          name: string | null
          open_incidents: number | null
          organization_id: string | null
          overdue_maintenance: number | null
          phone: string | null
          photo: string | null
          role: string | null
          status: Database["public"]["Enums"]["fleet_manager_status"] | null
          total_distance: number | null
          total_fuel_cost: number | null
          total_fuel_l: number | null
          upcoming_maintenance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_managers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      route_statistics: {
        Row: {
          active_trips: number | null
          archived: boolean | null
          avg_duration_min: number | null
          avg_fuel_per_trip: number | null
          clients_served: number | null
          completed_trips: number | null
          created_at: string | null
          created_by: string | null
          delay_count: number | null
          destination: string | null
          distance_km: number | null
          estimated_duration_min: number | null
          fuel_estimate_l: number | null
          id: string | null
          name: string | null
          organization_id: string | null
          origin: string | null
          road_type: string | null
          route_number: string | null
          status: string | null
          terrain: string | null
          toll_cost: number | null
          total_distance: number | null
          total_fuel_cost: number | null
          total_fuel_l: number | null
          total_incidents: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_fuel_summary: {
        Row: {
          avg_unit_price: number | null
          daily_fuel_cost: number | null
          daily_fuel_l: number | null
          total_fuel_cost: number | null
          total_fuel_l: number | null
          total_transactions: number | null
          truck_id: string | null
          weekly_fuel_cost: number | null
          weekly_fuel_l: number | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_fuel_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_health_summary: {
        Row: {
          avg_downtime_hours: number | null
          avg_repair_cost: number | null
          engine_health: number | null
          health_label: string | null
          id: string | null
          incident_count: number | null
          maintenance_count: number | null
          mtbr_days: number | null
          organization_id: string | null
          total_maintenance_cost: number | null
          truck_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trucks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_incident_summary: {
        Row: {
          critical_incidents: number | null
          investigating: number | null
          open_incidents: number | null
          resolved: number | null
          total_delay_minutes: number | null
          total_financial_impact: number | null
          total_incidents: number | null
          truck_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_maintenance_summary: {
        Row: {
          avg_cost: number | null
          completed: number | null
          in_workshop: number | null
          last_service: string | null
          overdue: number | null
          scheduled: number | null
          total_cost: number | null
          total_records: number | null
          truck_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_health_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "truck_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truck_maintenance_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_profile: {
        Row: {
          archived: boolean | null
          capacity_kg: number | null
          created_at: string | null
          created_by: string | null
          driver_id: string | null
          driver_license: string | null
          driver_license_expiry: string | null
          driver_name: string | null
          driver_number: string | null
          driver_phone: string | null
          driver_safety_score: number | null
          engine_health: number | null
          fleet_manager_employee_id: string | null
          fleet_manager_id: string | null
          fleet_manager_name: string | null
          fuel_level: number | null
          gps_status: Database["public"]["Enums"]["truck_gps_status"] | null
          id: string | null
          last_service_date: string | null
          location: string | null
          maintenance_records: number | null
          maintenance_spend: number | null
          manufacturer: string | null
          model: string | null
          odometer_km: number | null
          organization_id: string | null
          plate: string | null
          route_id: string | null
          route_name: string | null
          route_number: string | null
          status: Database["public"]["Enums"]["truck_status"] | null
          total_distance: number | null
          total_fuel_cost: number | null
          total_fuel_l: number | null
          total_incidents: number | null
          total_trips: number | null
          tracking_number: string | null
          tracking_source: string | null
          truck_number: string | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null
          vin: string | null
          year: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trucks_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "driver_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_manager_performance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_fleet_manager"
            columns: ["fleet_manager_id"]
            isOneToOne: false
            referencedRelation: "fleet_managers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_route"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "route_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_trucks_route"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trucks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_org_ids: { Args: never; Returns: string[] }
      fleet_kpis: { Args: { p_org_id: string }; Returns: Json }
      has_permission: {
        Args: { _organization_id: string; _permission: string }
        Returns: boolean
      }
      has_role_key: {
        Args: { _organization_id: string; _role_key: string }
        Returns: boolean
      }
      is_org_member: { Args: { _organization_id: string }; Returns: boolean }
      storage_path_org: { Args: { _name: string }; Returns: string }
    }
    Enums: {
      assignment_status: "Active" | "Completed" | "Cancelled"
      audit_action:
        | "created"
        | "updated"
        | "deleted"
        | "restored"
        | "status_changed"
        | "login"
        | "logout"
        | "exported"
        | "approved"
        | "rejected"
      client_status: "Active" | "Prospect" | "Inactive"
      document_status: "Valid" | "Expiring Soon" | "Expired" | "Pending"
      driver_risk: "Low" | "Medium" | "High"
      driver_status: "Active" | "On Leave" | "Suspended"
      fleet_manager_status: "Active" | "On Leave" | "Inactive"
      fuel_status: "Pending" | "Approved" | "Rejected"
      fuel_type: "Diesel" | "Petrol" | "CNG"
      incident_severity: "Low" | "Moderate" | "High" | "Critical"
      incident_status: "Open" | "Investigating" | "Resolved"
      incident_type:
        | "Accident"
        | "Cargo Damage"
        | "Vehicle Breakdown"
        | "Theft"
        | "Driver Misconduct"
        | "Delivery Issue"
        | "Other"
      integration_status: "connected" | "disconnected" | "error" | "pending"
      invitation_status: "pending" | "accepted" | "revoked" | "expired"
      license_class: "Class C" | "Class D" | "Class E"
      maintenance_status: "Scheduled" | "In Workshop" | "Completed" | "Overdue"
      maintenance_type: "Routine" | "Safety" | "Diagnostic" | "Repair"
      member_status: "active" | "invited" | "suspended" | "removed"
      notification_priority: "low" | "normal" | "high" | "critical"
      notification_status: "unread" | "read" | "archived"
      notification_type:
        | "fuel_alert"
        | "maintenance_alert"
        | "incident_alert"
        | "expiry_alert"
        | "trip_alert"
        | "dispatch_alert"
        | "assignment"
        | "mention"
        | "system"
        | "billing"
      org_status: "active" | "suspended" | "trial" | "cancelled"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "cancelled"
        | "expired"
      timeline_event_type:
        | "Status Change"
        | "ETA Update"
        | "Assignment Change"
        | "Departure"
        | "Arrival"
        | "Delay"
        | "Note"
        | "Document Upload"
      tracking_mode: "manual" | "automated"
      tracking_mode_enum: "GPS" | "Manual"
      trip_document_type:
        | "Waybill"
        | "Invoice"
        | "Delivery Note"
        | "Proof of Delivery"
        | "Other"
      trip_priority: "Low" | "Medium" | "High" | "Critical"
      trip_status:
        | "Scheduled"
        | "In Transit"
        | "Delivered"
        | "Delayed"
        | "Cancelled"
      truck_gps_status: "Online" | "Offline"
      truck_status: "On The Road" | "Idle" | "Maintenance" | "Offline"
      vehicle_type:
        | "Box Truck"
        | "Rigid Truck"
        | "Articulated Tractor"
        | "Tipper"
        | "Flatbed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assignment_status: ["Active", "Completed", "Cancelled"],
      audit_action: [
        "created",
        "updated",
        "deleted",
        "restored",
        "status_changed",
        "login",
        "logout",
        "exported",
        "approved",
        "rejected",
      ],
      client_status: ["Active", "Prospect", "Inactive"],
      document_status: ["Valid", "Expiring Soon", "Expired", "Pending"],
      driver_risk: ["Low", "Medium", "High"],
      driver_status: ["Active", "On Leave", "Suspended"],
      fleet_manager_status: ["Active", "On Leave", "Inactive"],
      fuel_status: ["Pending", "Approved", "Rejected"],
      fuel_type: ["Diesel", "Petrol", "CNG"],
      incident_severity: ["Low", "Moderate", "High", "Critical"],
      incident_status: ["Open", "Investigating", "Resolved"],
      incident_type: [
        "Accident",
        "Cargo Damage",
        "Vehicle Breakdown",
        "Theft",
        "Driver Misconduct",
        "Delivery Issue",
        "Other",
      ],
      integration_status: ["connected", "disconnected", "error", "pending"],
      invitation_status: ["pending", "accepted", "revoked", "expired"],
      license_class: ["Class C", "Class D", "Class E"],
      maintenance_status: ["Scheduled", "In Workshop", "Completed", "Overdue"],
      maintenance_type: ["Routine", "Safety", "Diagnostic", "Repair"],
      member_status: ["active", "invited", "suspended", "removed"],
      notification_priority: ["low", "normal", "high", "critical"],
      notification_status: ["unread", "read", "archived"],
      notification_type: [
        "fuel_alert",
        "maintenance_alert",
        "incident_alert",
        "expiry_alert",
        "trip_alert",
        "dispatch_alert",
        "assignment",
        "mention",
        "system",
        "billing",
      ],
      org_status: ["active", "suspended", "trial", "cancelled"],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "cancelled",
        "expired",
      ],
      timeline_event_type: [
        "Status Change",
        "ETA Update",
        "Assignment Change",
        "Departure",
        "Arrival",
        "Delay",
        "Note",
        "Document Upload",
      ],
      tracking_mode: ["manual", "automated"],
      tracking_mode_enum: ["GPS", "Manual"],
      trip_document_type: [
        "Waybill",
        "Invoice",
        "Delivery Note",
        "Proof of Delivery",
        "Other",
      ],
      trip_priority: ["Low", "Medium", "High", "Critical"],
      trip_status: [
        "Scheduled",
        "In Transit",
        "Delivered",
        "Delayed",
        "Cancelled",
      ],
      truck_gps_status: ["Online", "Offline"],
      truck_status: ["On The Road", "Idle", "Maintenance", "Offline"],
      vehicle_type: [
        "Box Truck",
        "Rigid Truck",
        "Articulated Tractor",
        "Tipper",
        "Flatbed",
      ],
    },
  },
} as const
