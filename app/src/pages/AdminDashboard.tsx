import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  LayoutGrid,
  GraduationCap,
  Building2,
  FolderOpen,
  Flag,
  CheckCircle,
  XCircle,
  Shield,
  AlertTriangle,
  Ban,
  CheckCheck,
} from 'lucide-react';
import {
  getPendingStudents,
  getPendingCompanies,
  getOpenReports,
  mockProjects,
  mockStudentProfiles,
  mockCompanyProfiles,
  mockReports,
  approveCompany,
  rejectCompany,
  approveProject,
  rejectProject,
  updateReport,
} from '@/data/mockStore';
import type { StudentProfile, CompanyProfile, Project, Report } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingStudents] = useState<StudentProfile[]>(getPendingStudents());
  const [pendingCompanies, setPendingCompanies] = useState<CompanyProfile[]>(getPendingCompanies());
  const [allProjects] = useState<Project[]>(mockProjects);
  const [reports, setReports] = useState<Report[]>(getOpenReports());
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-[#0A2B20] mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please login as an admin to access this panel.</p>
          <Button onClick={() => navigate('/login')} className="bg-[#0A2B20]">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const totalStudents = mockStudentProfiles.length;
  const totalCompanies = mockCompanyProfiles.length;
  const totalProjects = mockProjects.length;
  const openReports = mockReports.filter((r) => r.status === 'open').length;

  const handleApproveCompany = (companyId: string) => {
    approveCompany(companyId);
    setPendingCompanies(getPendingCompanies());
  };

  const handleRejectCompany = (companyId: string) => {
    rejectCompany(companyId);
    setPendingCompanies(getPendingCompanies());
  };

  const handleApproveProject = (projectId: string) => {
    approveProject(projectId);
  };

  const handleRejectProject = (projectId: string) => {
    rejectProject(projectId);
  };

  const handleResolveReport = (reportId: string) => {
    updateReport(reportId, 'resolved');
    setReports(getOpenReports());
  };

  const handleDismissReport = (reportId: string) => {
    updateReport(reportId, 'dismissed');
    setReports(getOpenReports());
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#0A2B20] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#DCE885]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0A2B20]">Admin Panel</p>
              <p className="text-xs text-gray-500">Moderation & Management</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-red-600">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 p-1 mb-6 w-full sm:w-auto flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
              <Badge className="bg-gray-100 text-gray-600 text-xs ml-1">{totalStudents}</Badge>
            </TabsTrigger>
            <TabsTrigger value="companies" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Companies</span>
              <Badge className="bg-gray-100 text-gray-600 text-xs ml-1">{totalCompanies}</Badge>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
              <Badge className="bg-gray-100 text-gray-600 text-xs ml-1">{totalProjects}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
              {openReports > 0 && (
                <Badge className="bg-red-100 text-red-600 text-xs ml-1">{openReports}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[#0A2B20] border-0 rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-white/70">Pending students</p>
                    <div className="w-8 h-8 rounded-lg bg-[#DCE885]/20 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-[#DCE885]" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{pendingStudents.length}</p>
                  <p className="text-xs text-white/50 mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Pending companies</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{pendingCompanies.length}</p>
                  <p className="text-xs text-gray-400 mt-1">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Total projects</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{totalProjects}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {mockProjects.filter((p) => p.status === 'approved').length} approved
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Open reports</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Flag className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{openReports}</p>
                  <p className="text-xs text-gray-400 mt-1">Need attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Student Registrations */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-[#0A2B20]">Recent student registrations</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('students')}
                      className="text-xs text-[#4a7c59] hover:text-[#0A2B20]"
                    >
                      View all →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockStudentProfiles.slice(0, 3).map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0A2B20]/10 flex items-center justify-center text-[#0A2B20] font-medium text-sm shrink-0">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A2B20] truncate">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {student.university} • {student.degree} {student.course}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-[#0A2B20]">Recent reports</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('reports')}
                      className="text-xs text-[#4a7c59] hover:text-[#0A2B20]"
                    >
                      View all →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockReports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          report.severity === 'high'
                            ? 'bg-red-100 text-red-600'
                            : report.severity === 'medium'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#0A2B20]">
                            {report.reason.substring(0, 30)}...
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${getSeverityColor(report.severity)}`}
                          >
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Target: {report.targetName} • By: {report.reporterName}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0A2B20]">All Students</h2>
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9"
              />
            </div>
            <div className="grid gap-3">
              {mockStudentProfiles
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.university.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((student) => (
                  <Card key={student.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#0A2B20]/10 flex items-center justify-center text-[#0A2B20] font-bold shrink-0">
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#0A2B20]">{student.name}</h3>
                            <Badge className="bg-gray-100 text-gray-600 text-xs">{student.usn}</Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {student.degree} {student.course} • {student.university} •{' '}
                            {student.academicYear}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{student.mobile}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              student.profileCompleted >= 80
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {student.profileCompleted}% complete
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* COMPANIES TAB */}
          <TabsContent value="companies" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Company Management</h2>

            {/* Pending Approvals */}
            {pendingCompanies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Pending Approval</h3>
                <div className="grid gap-3">
                  {pendingCompanies.map((company) => (
                    <Card key={company.id} className="border-0 shadow-sm rounded-2xl border-l-4 border-l-amber-400">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-[#0A2B20]">{company.name}</h3>
                              <p className="text-xs text-gray-500">
                                {company.industry} • {company.size}
                              </p>
                              <p className="text-xs text-gray-400">{company.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveCompany(company.id)}
                              className="bg-green-600 hover:bg-green-700 h-8 text-xs gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectCompany(company.id)}
                              className="h-8 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Companies */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">All Companies</h3>
              <div className="grid gap-3">
                {mockCompanyProfiles.map((company) => (
                  <Card key={company.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-[#0A2B20]">{company.name}</h3>
                              <Badge
                                className={
                                  company.isApproved
                                    ? 'bg-green-100 text-green-700 text-xs'
                                    : 'bg-amber-100 text-amber-700 text-xs'
                                }
                              >
                                {company.isApproved ? 'Approved' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              {company.industry} • {company.size}
                            </p>
                            <p className="text-xs text-gray-400">{company.website}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Project Verification</h2>
            <div className="grid gap-3">
              {allProjects.map((project) => (
                <Card key={project.id} className="border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[#0A2B20]">{project.title}</h3>
                          <Badge
                            className={
                              project.status === 'approved'
                                ? 'bg-green-100 text-green-700 text-xs'
                                : project.status === 'pending'
                                ? 'bg-amber-100 text-amber-700 text-xs'
                                : 'bg-red-100 text-red-700 text-xs'
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{project.summary}</p>
                        <p className="text-xs text-gray-400">
                          By: {project.studentName} • {project.category} • {project.views} views
                        </p>
                      </div>
                      {project.status === 'pending' && (
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleApproveProject(project.id)}
                            className="bg-green-600 hover:bg-green-700 h-8 text-xs gap-1"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectProject(project.id)}
                            className="h-8 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Ban className="w-3 h-3" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* REPORTS TAB */}
          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Reports & Moderation</h2>

            {reports.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500">All reports resolved! 🎉</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className={`border-0 shadow-sm rounded-2xl border-l-4 ${
                      report.severity === 'high'
                        ? 'border-l-red-500'
                        : report.severity === 'medium'
                        ? 'border-l-amber-500'
                        : 'border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-[#0A2B20]">{report.reason}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${getSeverityColor(report.severity)}`}
                            >
                              {report.severity}
                            </Badge>
                            <Badge
                              className={
                                report.status === 'open'
                                  ? 'bg-red-100 text-red-700 text-xs'
                                  : report.status === 'resolved'
                                  ? 'bg-green-100 text-green-700 text-xs'
                                  : 'bg-gray-100 text-gray-700 text-xs'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Target: <span className="font-medium">{report.targetName}</span> (
                            {report.targetType}) • Reported by: {report.reporterName} (
                            {report.reporterRole})
                          </p>
                        </div>
                        {report.status === 'open' && (
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleResolveReport(report.id)}
                              className="bg-green-600 hover:bg-green-700 h-8 text-xs gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissReport(report.id)}
                              className="h-8 text-xs gap-1 border-gray-200"
                            >
                              <XCircle className="w-3 h-3" />
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
