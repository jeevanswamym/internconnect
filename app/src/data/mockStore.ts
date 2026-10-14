import type {
  User,
  StudentProfile,
  CompanyProfile,
  Project,
  AccessRequest,
  InternshipOffer,
  Report,
  UserRole,
  AccessRequestStatus,
  OfferStatus,
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@demo.com',
    role: 'student',
    password: 'demo123',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'company@demo.com',
    role: 'company',
    password: 'demo123',
    createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: '3',
    email: 'admin@demo.com',
    role: 'admin',
    password: 'demo123',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: '4',
    email: 'student2@demo.com',
    role: 'student',
    password: 'demo123',
    createdAt: '2025-03-20T09:15:00Z',
  },
  {
    id: '5',
    email: 'company2@demo.com',
    role: 'company',
    password: 'demo123',
    createdAt: '2025-04-05T11:45:00Z',
  },
];

// Mock Student Profiles
export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'sp1',
    userId: '1',
    name: 'Arjun Sharma',
    mobile: '+91 9876543210',
    course: 'Computer Science',
    academicYear: '3rd Year',
    usn: '2VX25CB037',
    university: 'VTU',
    degree: 'B.Tech',
    bio: 'Passionate full-stack developer with experience in React, Node.js, and Python. Interested in AI/ML and cloud computing.',
    skills: ['React', 'Node.js', 'Python', 'MongoDB', 'TypeScript', 'AWS'],
    avatar: '',
    teamMembers: [
      { id: 'tm1', name: 'Arjun Sharma', usn: '2VX25CB037', course: 'Computer Science', isLeader: true },
    ],
    profileCompleted: 85,
  },
  {
    id: 'sp2',
    userId: '4',
    name: 'Priya Patel',
    mobile: '+91 8765432109',
    course: 'Information Science',
    academicYear: '4th Year',
    usn: '2VX24IS015',
    university: 'VTU',
    degree: 'B.Tech',
    bio: 'Data science enthusiast with strong foundations in machine learning and statistical analysis.',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'SQL', 'Tableau'],
    avatar: '',
    teamMembers: [
      { id: 'tm2', name: 'Priya Patel', usn: '2VX24IS015', course: 'Information Science', isLeader: true },
      { id: 'tm3', name: 'Rahul Kumar', usn: '2VX24IS016', course: 'Information Science', isLeader: false },
      { id: 'tm4', name: 'Sneha Reddy', usn: '2VX24IS017', course: 'Information Science', isLeader: false },
    ],
    profileCompleted: 72,
  },
];

// Mock Company Profiles
export const mockCompanyProfiles: CompanyProfile[] = [
  {
    id: 'cp1',
    userId: '2',
    name: 'TechVentures Pvt Ltd',
    email: 'hr@techventures.com',
    phone: '+91 80 1234 5678',
    website: 'https://techventures.com',
    industry: 'Software Development',
    size: '50-200 employees',
    description: 'Leading software development company specializing in web and mobile applications.',
    logo: '',
    isApproved: true,
    isActive: true,
    bookmarks: ['proj1'],
  },
  {
    id: 'cp2',
    userId: '5',
    name: 'InnovateTech Solutions',
    email: 'contact@innovatetech.com',
    phone: '+91 80 9876 5432',
    website: 'https://innovatetech.com',
    industry: 'AI & Machine Learning',
    size: '10-50 employees',
    description: 'AI-first startup building cutting-edge machine learning solutions for enterprises.',
    logo: '',
    isApproved: false,
    isActive: false,
    bookmarks: [],
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj1',
    title: 'AI-Powered Health Diagnostic System',
    description: 'A machine learning-based web application that analyzes medical symptoms and provides preliminary diagnostic suggestions. Built with Python Flask backend and React frontend. Uses TensorFlow for the ML model and integrates with a comprehensive medical database.',
    summary: 'ML web app for preliminary medical diagnosis using symptom analysis',
    status: 'approved',
    category: 'Healthcare',
    tags: ['Machine Learning', 'React', 'Python', 'Healthcare', 'TensorFlow'],
    files: [
      { id: 'f1', name: 'Project_Report.pdf', type: 'pdf', url: '#', size: 2500000 },
      { id: 'f2', name: 'Presentation.pptx', type: 'pptx', url: '#', size: 4800000 },
      { id: 'f3', name: 'Demo_Video.mp4', type: 'video', url: '#', size: 15000000 },
    ],
    studentId: '1',
    studentName: 'Arjun Sharma',
    views: 142,
    isPublic: false,
    createdAt: '2025-05-10T08:30:00Z',
    updatedAt: '2025-05-15T14:20:00Z',
  },
  {
    id: 'proj2',
    title: 'Smart Campus Navigation App',
    description: 'An AR-based mobile application for university campus navigation. Students can find their way around campus using augmented reality waypoints, view class schedules integrated with location data, and get real-time updates about campus events.',
    summary: 'AR mobile app for university campus navigation with real-time updates',
    status: 'approved',
    category: 'Education',
    tags: ['Augmented Reality', 'Mobile App', 'React Native', 'IoT'],
    files: [
      { id: 'f4', name: 'Technical_Documentation.pdf', type: 'pdf', url: '#', size: 3200000 },
      { id: 'f5', name: 'App_Screenshots.png', type: 'image', url: '#', size: 1200000 },
    ],
    studentId: '1',
    studentName: 'Arjun Sharma',
    views: 89,
    isPublic: false,
    createdAt: '2025-04-22T11:00:00Z',
    updatedAt: '2025-05-01T09:45:00Z',
  },
  {
    id: 'proj3',
    title: 'Predictive Analytics for Agriculture',
    description: 'A comprehensive data analytics platform that helps farmers make data-driven decisions. Uses weather data, soil quality metrics, and historical crop yield data to provide actionable insights and predictions.',
    summary: 'Data analytics platform for agricultural yield prediction and insights',
    status: 'pending',
    category: 'Agriculture',
    tags: ['Data Science', 'Python', 'Django', 'PostgreSQL', 'Analytics'],
    files: [
      { id: 'f6', name: 'Research_Paper.pdf', type: 'pdf', url: '#', size: 1800000 },
    ],
    studentId: '4',
    studentName: 'Priya Patel',
    views: 0,
    isPublic: false,
    createdAt: '2025-05-25T10:15:00Z',
    updatedAt: '2025-05-25T10:15:00Z',
  },
];

// Mock Access Requests
export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'ar1',
    projectId: 'proj1',
    projectTitle: 'AI-Powered Health Diagnostic System',
    companyId: 'cp1',
    companyName: 'TechVentures Pvt Ltd',
    studentId: '1',
    studentName: 'Arjun Sharma',
    status: 'approved',
    message: 'We are impressed by your ML diagnostic system and would like to explore it further for potential collaboration.',
    createdAt: '2025-05-12T09:00:00Z',
  },
  {
    id: 'ar2',
    projectId: 'proj2',
    projectTitle: 'Smart Campus Navigation App',
    companyId: 'cp1',
    companyName: 'TechVentures Pvt Ltd',
    studentId: '1',
    studentName: 'Arjun Sharma',
    status: 'pending',
    message: 'Your AR navigation app aligns with our product roadmap. Would love to see the full prototype.',
    createdAt: '2025-05-28T14:30:00Z',
  },
];

// Mock Internship Offers
export const mockInternshipOffers: InternshipOffer[] = [
  {
    id: 'of1',
    studentId: '1',
    studentName: 'Arjun Sharma',
    projectId: 'proj1',
    projectTitle: 'AI-Powered Health Diagnostic System',
    companyId: 'cp1',
    companyName: 'TechVentures Pvt Ltd',
    position: 'ML Engineering Intern',
    description: 'Join our AI team to work on productionizing ML models for healthcare applications. You will be working with our senior engineers to deploy and scale your diagnostic system.',
    stipend: 'Rs. 25,000/month',
    duration: '6 months',
    status: 'pending',
    createdAt: '2025-05-14T16:00:00Z',
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'rep1',
    reporterId: '1',
    reporterName: 'Arjun Sharma',
    reporterRole: 'student',
    targetId: 'cp2',
    targetType: 'company',
    targetName: 'InnovateTech Solutions',
    reason: 'This company appears to be fake. Their website does not load and the email bounces back.',
    severity: 'high',
    status: 'open',
    createdAt: '2025-06-01T10:30:00Z',
  },
  {
    id: 'rep2',
    reporterId: '4',
    reporterName: 'Priya Patel',
    reporterRole: 'student',
    targetId: 'proj1',
    targetType: 'project',
    targetName: 'AI-Powered Health Diagnostic System',
    reason: 'This project contains plagiarized content from a published research paper.',
    severity: 'medium',
    status: 'open',
    createdAt: '2025-06-02T08:45:00Z',
  },
];

// Helper functions to link profiles to users
export function getStudentProfile(userId: string): StudentProfile | undefined {
  return mockStudentProfiles.find((p) => p.userId === userId);
}

export function getCompanyProfile(userId: string): CompanyProfile | undefined {
  return mockCompanyProfiles.find((p) => p.userId === userId);
}

export function getUserProjects(studentId: string): Project[] {
  return mockProjects.filter((p) => p.studentId === studentId);
}

export function getStudentAccessRequests(studentId: string): AccessRequest[] {
  return mockAccessRequests.filter((r) => r.studentId === studentId);
}

export function getStudentOffers(studentId: string): InternshipOffer[] {
  return mockInternshipOffers.filter((o) => o.studentId === studentId);
}

export function getCompanyAccessRequests(companyId: string): AccessRequest[] {
  return mockAccessRequests.filter((r) => r.companyId === companyId);
}

export function getCompanyOffers(companyId: string): InternshipOffer[] {
  return mockInternshipOffers.filter((o) => o.companyId === companyId);
}

export function getPendingStudents(): StudentProfile[] {
  return mockStudentProfiles.filter((s) => s.profileCompleted < 100);
}

export function getPendingCompanies(): CompanyProfile[] {
  return mockCompanyProfiles.filter((c) => !c.isApproved);
}

export function getApprovedCompanies(): CompanyProfile[] {
  return mockCompanyProfiles.filter((c) => c.isApproved);
}

export function getApprovedProjects(): Project[] {
  return mockProjects.filter((p) => p.status === 'approved');
}

export function getOpenReports(): Report[] {
  return mockReports.filter((r) => r.status === 'open');
}

// USN Validation
export function isValidUSN(usn: string): boolean {
  const usnRegex = /^[0-9][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}$/;
  return usnRegex.test(usn) && usn.length === 10;
}

// Auth helpers
let currentUser: User | null = null;

export function loginUser(email: string, password: string): User | null {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUser = { ...user };
    return currentUser;
  }
  return null;
}

export function logoutUser(): void {
  currentUser = null;
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function registerUser(email: string, password: string, role: UserRole): User {
  const newUser: User = {
    id: `user_${Date.now()}`,
    email,
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
}

export function addStudentProfile(profile: StudentProfile): void {
  mockStudentProfiles.push(profile);
}

export function addCompanyProfile(profile: CompanyProfile): void {
  mockCompanyProfiles.push(profile);
}

export function addProject(project: Project): void {
  mockProjects.push(project);
}

export function updateProject(projectId: string, updates: Partial<Project>): void {
  const idx = mockProjects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    mockProjects[idx] = { ...mockProjects[idx], ...updates, updatedAt: new Date().toISOString() };
  }
}

export function deleteProject(projectId: string): void {
  const idx = mockProjects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    mockProjects.splice(idx, 1);
  }
}

export function addAccessRequest(request: AccessRequest): void {
  mockAccessRequests.push(request);
}

export function updateAccessRequest(requestId: string, status: AccessRequestStatus): void {
  const idx = mockAccessRequests.findIndex((r) => r.id === requestId);
  if (idx !== -1) {
    mockAccessRequests[idx] = { ...mockAccessRequests[idx], status };
  }
}

export function addOffer(offer: InternshipOffer): void {
  mockInternshipOffers.push(offer);
}

export function updateOffer(offerId: string, status: OfferStatus): void {
  const idx = mockInternshipOffers.findIndex((o) => o.id === offerId);
  if (idx !== -1) {
    mockInternshipOffers[idx] = { ...mockInternshipOffers[idx], status };
  }
}

export function addReport(report: Report): void {
  mockReports.push(report);
}

export function updateReport(reportId: string, status: Report['status']): void {
  const idx = mockReports.findIndex((r) => r.id === reportId);
  if (idx !== -1) {
    mockReports[idx] = { ...mockReports[idx], status };
  }
}

export function approveCompany(companyId: string): void {
  const idx = mockCompanyProfiles.findIndex((c) => c.id === companyId);
  if (idx !== -1) {
    mockCompanyProfiles[idx] = { ...mockCompanyProfiles[idx], isApproved: true, isActive: true };
  }
}

export function rejectCompany(companyId: string): void {
  const idx = mockCompanyProfiles.findIndex((c) => c.id === companyId);
  if (idx !== -1) {
    mockCompanyProfiles[idx] = { ...mockCompanyProfiles[idx], isApproved: false, isActive: false };
  }
}

export function approveProject(projectId: string): void {
  const idx = mockProjects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    mockProjects[idx] = { ...mockProjects[idx], status: 'approved' as const };
  }
}

export function rejectProject(projectId: string): void {
  const idx = mockProjects.findIndex((p) => p.id === projectId);
  if (idx !== -1) {
    mockProjects[idx] = { ...mockProjects[idx], status: 'rejected' as const };
  }
}

export function toggleBookmark(companyId: string, projectId: string): void {
  const idx = mockCompanyProfiles.findIndex((c) => c.id === companyId);
  if (idx !== -1) {
    const bookmarks = mockCompanyProfiles[idx].bookmarks;
    if (bookmarks.includes(projectId)) {
      mockCompanyProfiles[idx].bookmarks = bookmarks.filter((id) => id !== projectId);
    } else {
      mockCompanyProfiles[idx].bookmarks = [...bookmarks, projectId];
    }
  }
}
