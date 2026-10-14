export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'company' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'student' | 'company' | 'admin';
          created_at?: string;
        };
      };
      student_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          mobile: string;
          course: string;
          academic_year: string;
          usn: string;
          university: string;
          degree: string;
          bio: string;
          skills: string[];
          avatar: string | null;
          team_members: TeamMember[];
          profile_completed: number;
          created_at: string;
        };
      };
      company_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string;
          website: string;
          industry: string;
          size: string;
          description: string;
          logo: string | null;
          is_approved: boolean;
          is_active: boolean;
          bookmarks: string[];
          created_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          summary: string;
          status: 'pending' | 'approved' | 'rejected';
          category: string;
          tags: string[];
          files: ProjectFile[];
          student_id: string;
          student_name: string;
          views: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      access_requests: {
        Row: {
          id: string;
          project_id: string;
          project_title: string;
          company_id: string;
          company_name: string;
          student_id: string;
          status: 'pending' | 'approved' | 'rejected';
          message: string;
          created_at: string;
        };
      };
      internship_offers: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          project_id: string;
          project_title: string;
          company_id: string;
          company_name: string;
          position: string;
          description: string;
          stipend: string | null;
          duration: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reporter_name: string;
          reporter_role: 'student' | 'company' | 'admin';
          target_id: string;
          target_type: 'project' | 'company' | 'student';
          target_name: string;
          reason: string;
          severity: 'low' | 'medium' | 'high';
          status: 'open' | 'resolved' | 'dismissed';
          created_at: string;
        };
      };
    };
  };
}

interface TeamMember {
  id: string;
  name: string;
  usn: string;
  course: string;
  is_leader: boolean;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}
