import { Profile, Course, Video } from './lms';

export interface RevenueRecord {
  id: string;
  teacher_id: string;
  course_id: string | null;
  student_id: string | null;
  revenue_type: 'recorded_course' | 'free_course' | 'live_class' | 'paid_work';
  total_amount: number;
  teacher_share: number;
  agency_share: number;
  teacher_percentage: number;
  agency_percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paid_work_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  course?: Course;
  student?: Profile;
}

export interface PaidWork {
  id: string;
  title: string;
  description: string | null;
  category: 'design' | 'development' | 'video' | 'other';
  client_name: string | null;
  total_amount: number;
  assigned_to: string | null;
  assigned_by: string | null;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  assignee?: Profile;
  assigner?: Profile;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  student_id: string;
  teacher_id: string | null;
  course_id: string | null;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  // Relations
  student?: Profile;
  teacher?: Profile;
  course?: Course;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  // Relations
  sender?: Profile;
}

export interface WithdrawalRequest {
  id: string;
  teacher_id: string;
  amount: number;
  payment_method: 'bkash' | 'nagad' | 'bank';
  payment_details: Record<string, any> | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  admin_notes: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherStats {
  totalCourses: number;
  recordedCourses: number;
  liveCourses: number;
  freeCourses: number;
  totalStudents: number;
  recordedEarnings: number;
  liveEarnings: number;
  paidWorkEarnings: number;
  totalEarnings: number;
  pendingWithdrawal: number;
  availableBalance: number;
}

export interface StudentProgress {
  student: Profile;
  course: Course;
  progress_percent: number;
  last_watched_at: string | null;
  is_completed: boolean;
  videos_completed: number;
  total_videos: number;
}

export interface TeacherCourse extends Course {
  teacher_id: string | null;
  course_type: 'recorded' | 'live' | 'free';
  is_approved: boolean;
  videos?: Video[];
  enrolled_students?: number;
  total_revenue?: number;
}
