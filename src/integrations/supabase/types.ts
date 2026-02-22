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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_id: string
          course_id: string
          course_name: string
          id: string
          issued_at: string | null
          student_name: string
          user_id: string
        }
        Insert: {
          certificate_id: string
          course_id: string
          course_name: string
          id?: string
          issued_at?: string | null
          student_name: string
          user_id: string
        }
        Update: {
          certificate_id?: string
          course_id?: string
          course_name?: string
          id?: string
          issued_at?: string | null
          student_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          room_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          room_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room_members: {
        Row: {
          id: string
          joined_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          course_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          room_type: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          room_type?: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          room_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_rooms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_completions: {
        Row: {
          certificate_id: string
          completed_at: string | null
          course_id: string
          id: string
          user_id: string
        }
        Insert: {
          certificate_id: string
          completed_at?: string | null
          course_id: string
          id?: string
          user_id: string
        }
        Update: {
          certificate_id?: string
          completed_at?: string | null
          course_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_type: string | null
          created_at: string | null
          description: string | null
          description_en: string | null
          id: string
          is_approved: boolean | null
          is_published: boolean | null
          price: number | null
          show_on_homepage: boolean | null
          teacher_id: string | null
          thumbnail_url: string | null
          title: string
          title_en: string | null
          trainer_designation: string | null
          trainer_image: string | null
          trainer_name: string | null
          updated_at: string | null
        }
        Insert: {
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          is_approved?: boolean | null
          is_published?: boolean | null
          price?: number | null
          show_on_homepage?: boolean | null
          teacher_id?: string | null
          thumbnail_url?: string | null
          title: string
          title_en?: string | null
          trainer_designation?: string | null
          trainer_image?: string | null
          trainer_name?: string | null
          updated_at?: string | null
        }
        Update: {
          course_type?: string | null
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          is_approved?: boolean | null
          is_published?: boolean | null
          price?: number | null
          show_on_homepage?: boolean | null
          teacher_id?: string | null
          thumbnail_url?: string | null
          title?: string
          title_en?: string | null
          trainer_designation?: string | null
          trainer_image?: string | null
          trainer_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disposable_email_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string
          direction: string
          from_email: string
          id: string
          is_read: boolean | null
          resend_email_id: string | null
          sender_identity: string | null
          subject: string
          thread_id: string
          to_email: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          direction: string
          from_email: string
          id?: string
          is_read?: boolean | null
          resend_email_id?: string | null
          sender_identity?: string | null
          subject: string
          thread_id: string
          to_email: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          direction?: string
          from_email?: string
          id?: string
          is_read?: boolean | null
          resend_email_id?: string | null
          sender_identity?: string | null
          subject?: string
          thread_id?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "email_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_threads: {
        Row: {
          created_at: string
          external_email: string
          external_name: string | null
          id: string
          last_message_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          external_email: string
          external_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          external_email?: string
          external_name?: string | null
          id?: string
          last_message_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollment_requests: {
        Row: {
          course_id: string
          created_at: string
          id: string
          message: string | null
          payment_method: string | null
          phone_number: string | null
          status: string
          student_email: string
          student_name: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          message?: string | null
          payment_method?: string | null
          phone_number?: string | null
          status?: string
          student_email: string
          student_name: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          message?: string | null
          payment_method?: string | null
          phone_number?: string | null
          status?: string
          student_email?: string
          student_name?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_requests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_content: {
        Row: {
          content_bn: string | null
          content_en: string | null
          content_key: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          content_bn?: string | null
          content_en?: string | null
          content_key: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          content_bn?: string | null
          content_en?: string | null
          content_key?: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_links: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean | null
          link_type: string
          order_index: number | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          link_type: string
          order_index?: number | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          link_type?: string
          order_index?: number | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      notice_reads: {
        Row: {
          id: string
          notice_id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notice_id: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notice_id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notice_reads_notice_id_fkey"
            columns: ["notice_id"]
            isOneToOne: false
            referencedRelation: "notices"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          is_global: boolean | null
          teacher_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          teacher_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_global?: boolean | null
          teacher_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notices_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content_bn: string | null
          content_en: string | null
          content_key: string
          created_at: string
          id: string
          page_name: string
          updated_at: string
        }
        Insert: {
          content_bn?: string | null
          content_en?: string | null
          content_key: string
          created_at?: string
          id?: string
          page_name: string
          updated_at?: string
        }
        Update: {
          content_bn?: string | null
          content_en?: string | null
          content_key?: string
          created_at?: string
          id?: string
          page_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      paid_works: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          category: string
          client_name: string | null
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          category: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          category?: string
          client_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paid_works_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paid_works_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pass_code_courses: {
        Row: {
          assigned_at: string | null
          course_id: string
          id: string
          pass_code_id: string
        }
        Insert: {
          assigned_at?: string | null
          course_id: string
          id?: string
          pass_code_id: string
        }
        Update: {
          assigned_at?: string | null
          course_id?: string
          id?: string
          pass_code_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pass_code_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pass_code_courses_pass_code_id_fkey"
            columns: ["pass_code_id"]
            isOneToOne: false
            referencedRelation: "pass_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      pass_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pass_codes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          is_teacher: boolean | null
          linked_team_member_id: string | null
          pass_code: string | null
          phone_number: string | null
          skills: string[] | null
          teacher_approved: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          is_teacher?: boolean | null
          linked_team_member_id?: string | null
          pass_code?: string | null
          phone_number?: string | null
          skills?: string[] | null
          teacher_approved?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_teacher?: boolean | null
          linked_team_member_id?: string | null
          pass_code?: string | null
          phone_number?: string | null
          skills?: string[] | null
          teacher_approved?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_linked_team_member_id_fkey"
            columns: ["linked_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_records: {
        Row: {
          agency_percentage: number
          agency_share: number
          course_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          paid_work_id: string | null
          revenue_type: string
          status: string | null
          student_id: string | null
          teacher_id: string
          teacher_percentage: number
          teacher_share: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          agency_percentage?: number
          agency_share?: number
          course_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_work_id?: string | null
          revenue_type: string
          status?: string | null
          student_id?: string | null
          teacher_id: string
          teacher_percentage?: number
          teacher_share?: number
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          agency_percentage?: number
          agency_share?: number
          course_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          paid_work_id?: string | null
          revenue_type?: string
          status?: string | null
          student_id?: string | null
          teacher_id?: string
          teacher_percentage?: number
          teacher_share?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_records_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_records_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sender_identities: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          email_prefix: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          email_prefix: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          email_prefix?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          features: string[] | null
          icon: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          show_on_homepage: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          show_on_homepage?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[] | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          show_on_homepage?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          priority: string | null
          status: string | null
          student_id: string
          subject: string
          teacher_id: string | null
          ticket_number: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          student_id: string
          subject: string
          teacher_id?: string | null
          ticket_number: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          student_id?: string
          subject?: string
          teacher_id?: string | null
          ticket_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_custom_links: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          label: string
          order_index: number
          team_member_id: string
          url: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          label: string
          order_index?: number
          team_member_id: string
          url: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          label?: string
          order_index?: number
          team_member_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_custom_links_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          fiverr_url: string | null
          id: string
          image_url: string | null
          instagram_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          portfolio_url: string | null
          role: string
          show_on_homepage: boolean | null
          threads_url: string | null
          twitter_url: string | null
          updated_at: string
          upwork_url: string | null
          whatsapp_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          fiverr_url?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          portfolio_url?: string | null
          role: string
          show_on_homepage?: boolean | null
          threads_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          upwork_url?: string | null
          whatsapp_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          fiverr_url?: string | null
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          portfolio_url?: string | null
          role?: string
          show_on_homepage?: boolean | null
          threads_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          upwork_url?: string | null
          whatsapp_url?: string | null
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_materials: {
        Row: {
          created_at: string
          id: string
          material_type: string
          material_url: string | null
          note_content: string | null
          order_index: number
          title: string
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          material_type?: string
          material_url?: string | null
          note_content?: string | null
          order_index?: number
          title: string
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          material_type?: string
          material_url?: string | null
          note_content?: string | null
          order_index?: number
          title?: string
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_materials_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress: {
        Row: {
          id: string
          is_completed: boolean | null
          last_watched_at: string | null
          progress_percent: number | null
          user_id: string
          video_id: string
        }
        Insert: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          progress_percent?: number | null
          user_id: string
          video_id: string
        }
        Update: {
          id?: string
          is_completed?: boolean | null
          last_watched_at?: string | null
          progress_percent?: number | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          course_id: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
          video_type: string | null
          video_url: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
          video_type?: string | null
          video_url: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          video_type?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          id: string
          payment_details: Json | null
          payment_method: string
          processed_at: string | null
          status: string | null
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method: string
          processed_at?: string | null
          status?: string | null
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          status?: string | null
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          order_index: number | null
          project_url: string | null
          show_on_homepage: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          project_url?: string | null
          show_on_homepage?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          project_url?: string | null
          show_on_homepage?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_revenue_split: {
        Args: { _revenue_type: string; _total_amount: number }
        Returns: {
          agency_pct: number
          agency_share: number
          teacher_pct: number
          teacher_share: number
        }[]
      }
      generate_certificate_id: { Args: never; Returns: string }
      generate_pass_code: { Args: never; Returns: string }
      generate_ticket_number: { Args: never; Returns: string }
      get_user_pass_code: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_teacher: { Args: { _user_id: string }; Returns: boolean }
      make_admin: { Args: { _email: string }; Returns: boolean }
      user_has_course_access: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student" | "teacher"
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
      app_role: ["admin", "student", "teacher"],
    },
  },
} as const
