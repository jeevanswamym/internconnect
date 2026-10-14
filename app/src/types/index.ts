export type UserRole = 'student' | 'company' | 'admin';

export interface TeamMember {
  id: string;
  name: string;
  usn: string;
  course: string;
  isLeader: boolean;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  course: string;
  academicYear: string;
  usn: string;
  university: string;
  degree: string;
  bio: string;
  skills: string[];
  avatar?: string;
  teamMembers: TeamMember[];
  profileCompleted: number;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  size: string;
  description: string;
  logo?: string;
  isApproved: boolean;
  isActive: boolean;
  bookmarks: string[];
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: string;
  profile?: StudentProfile | CompanyProfile;
}

export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface Project {
  id: string;
  title: string;
  description: string;
  summary: string;
  status: ProjectStatus;
  category: string;
  tags: string[];
  files: ProjectFile[];
  studentId: string;
  studentName: string;
  teamId?: string;
  views: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export type AccessRequestStatus = 'pending' | 'approved' | 'rejected';

export interface AccessRequest {
  id: string;
  projectId: string;
  projectTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  status: AccessRequestStatus;
  message: string;
  createdAt: string;
}

export type OfferStatus = 'pending' | 'accepted' | 'rejected';

export interface InternshipOffer {
  id: string;
  studentId: string;
  studentName: string;
  projectId: string;
  projectTitle: string;
  companyId: string;
  companyName: string;
  position: string;
  description: string;
  stipend?: string;
  duration: string;
  status: OfferStatus;
  createdAt: string;
}

export type ReportSeverity = 'low' | 'medium' | 'high';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  targetId: string;
  targetType: 'project' | 'company' | 'student';
  targetName: string;
  reason: string;
  severity: ReportSeverity;
  status: ReportStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalViews: number;
  totalOffers: number;
  pendingStudents: number;
  pendingCompanies: number;
  totalReports: number;
  recentRegistrations: StudentProfile[];
  recentReports: Report[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
