import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  LayoutGrid,
  FolderOpen,
  Briefcase,
  UserCircle,
  Plus,
  Eye,
  FileText,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  Upload,
} from 'lucide-react';
import {
  getUserProjects,
  getStudentAccessRequests,
  getStudentOffers,
  deleteProject,
  updateOffer,
  updateAccessRequest,
  addProject,
} from '@/data/mockStore';
import { Label } from '@/components/ui/label';
import type { Project, InternshipOffer, AccessRequest } from '@/types';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const studentProfile = profile as import('@/types').StudentProfile | null;
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>(
    user ? getUserProjects(user.id) : []
  );
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(
    user ? getStudentAccessRequests(user.id) : []
  );
  const [offers, setOffers] = useState<InternshipOffer[]>(
    user ? getStudentOffers(user.id) : []
  );

  // Upload project dialog state
  const [showUpload, setShowUpload] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectSummary, setNewProjectSummary] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('');

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-[#0A2B20] mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please login as a student to access this dashboard.</p>
          <Button onClick={() => navigate('/login')} className="bg-[#0A2B20]">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  const approvedProjects = projects.filter((p) => p.status === 'approved').length;
  const pendingOffers = offers.filter((o) => o.status === 'pending').length;
  const profileCompletion = studentProfile?.profileCompleted || 0;

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      setProjects(getUserProjects(user.id));
    }
  };

  const handleRespondToAccess = (requestId: string, status: 'approved' | 'rejected') => {
    updateAccessRequest(requestId, status);
    setAccessRequests(getStudentAccessRequests(user.id));
  };

  const handleRespondToOffer = (offerId: string, status: 'accepted' | 'rejected') => {
    updateOffer(offerId, status);
    setOffers(getStudentOffers(user.id));
  };

  const handleUploadProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle || !newProjectDescription || !newProjectSummary) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDescription,
      summary: newProjectSummary,
      status: 'pending',
      category: newProjectCategory || 'General',
      tags: [],
      files: [],
      studentId: user.id,
      studentName: studentProfile?.name || 'Unknown',
      views: 0,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProject(newProject);
    setProjects(getUserProjects(user.id));
    setShowUpload(false);
    setNewProjectTitle('');
    setNewProjectDescription('');
    setNewProjectSummary('');
    setNewProjectCategory('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#0A2B20] flex items-center justify-center">
              <span className="text-[#DCE885] font-bold text-sm">
                {studentProfile?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#0A2B20]">{studentProfile?.name || 'Student'}</p>
              <p className="text-xs text-gray-500">
                {studentProfile?.degree} {studentProfile?.course} • {studentProfile?.university}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-500 hover:text-red-600"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 p-1 mb-6 w-full sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">My Projects</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Offers</span>
              {offers.length > 0 && (
                <Badge className="bg-[#DCE885] text-[#0A2B20] text-xs ml-1">{offers.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <UserCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-[#0A2B20] border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <p className="text-[#DCE885] text-xs font-medium tracking-widest uppercase mb-2">
                  Welcome back
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {studentProfile?.name || 'Student'}
                </h2>
                <p className="text-white/60 text-sm mb-6">
                  {studentProfile?.degree} {studentProfile?.course} • {studentProfile?.university}
                </p>
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#DCE885] text-[#0A2B20] hover:bg-[#d4df7a] font-medium rounded-full px-6 gap-2">
                      <Plus className="w-4 h-4" />
                      Upload project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-[#0A2B20]">Upload New Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUploadProject} className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Project Title</label>
                        <input
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                          placeholder="e.g., AI Health Diagnostic System"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Short Summary</label>
                        <input
                          value={newProjectSummary}
                          onChange={(e) => setNewProjectSummary(e.target.value)}
                          placeholder="One-line summary visible to companies"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Category</label>
                        <input
                          value={newProjectCategory}
                          onChange={(e) => setNewProjectCategory(e.target.value)}
                          placeholder="e.g., Healthcare, Education, Agriculture"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20]"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <textarea
                          value={newProjectDescription}
                          onChange={(e) => setNewProjectDescription(e.target.value)}
                          placeholder="Detailed project description..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20] resize-none"
                          required
                        />
                      </div>
                      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Drag & drop files here, or click to browse
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports PDF, PPTX, images, and videos
                        </p>
                      </div>
                      <Button type="submit" className="w-full bg-[#0A2B20] hover:bg-[#113822]">
                        Upload Project
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Projects</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{projects.length}</p>
                  <p className="text-xs text-gray-400 mt-1">{approvedProjects} approved</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Total views</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{totalViews}</p>
                  <p className="text-xs text-gray-400 mt-1">Across all projects</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">Offers received</p>
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#0A2B20]">{offers.length}</p>
                  <p className="text-xs text-gray-400 mt-1">{pendingOffers} new</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Completion */}
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[#0A2B20]">Complete your profile</h3>
                  <span className="text-sm font-bold text-[#0A2B20]">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2 mb-3" />
                <p className="text-xs text-gray-400">
                  A complete profile gets 3× more company views
                </p>
              </CardContent>
            </Card>

            {/* Recent Access Requests */}
            {accessRequests.length > 0 && (
              <Card className="border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#0A2B20]">Access Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accessRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#0A2B20]">{req.companyName}</p>
                        <p className="text-xs text-gray-500">
                          Wants to view "{req.projectTitle}"
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {req.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleRespondToAccess(req.id, 'approved')}
                              className="bg-[#0A2B20] hover:bg-[#113822] h-8 text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRespondToAccess(req.id, 'rejected')}
                              className="h-8 text-xs border-gray-200"
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge
                            className={
                              req.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {req.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* MY PROJECTS TAB */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0A2B20]">My Projects</h2>
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-[#0A2B20] hover:bg-[#113822] gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No projects yet</p>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="bg-[#DCE885] text-[#0A2B20] hover:bg-[#d4df7a]"
                >
                  Upload your first project
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-[#0A2B20] truncate">
                              {project.title}
                            </h3>
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
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{project.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {project.views} views
                            </span>
                            <span>{project.category}</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          {project.files.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {project.files.map((f) => (
                                <Badge
                                  key={f.id}
                                  variant="outline"
                                  className="text-xs border-gray-200 text-gray-500"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  {f.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-[#0A2B20]">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteProject(project.id)}
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* OFFERS TAB */}
          <TabsContent value="offers" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Internship Offers</h2>

            {offers.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No offers yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Upload great projects to attract company attention
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-[#0A2B20]">
                              {offer.position}
                            </h3>
                            <Badge
                              className={
                                offer.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : offer.status === 'accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }
                            >
                              {offer.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#4a7c59] font-medium mb-1">
                            {offer.companyName}
                          </p>
                          <p className="text-sm text-gray-500 mb-2">{offer.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            {offer.stipend && <span>💰 {offer.stipend}</span>}
                            <span>📅 {offer.duration}</span>
                            <span>
                              Based on:{' '}
                              <span className="text-[#0A2B20]">{offer.projectTitle}</span>
                            </span>
                          </div>
                          {offer.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRespondToOffer(offer.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRespondToOffer(offer.id, 'rejected')}
                                className="h-8 text-xs border-gray-200"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-[#0A2B20]">Student Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Full Name</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">{studentProfile?.name || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">USN</Label>
                    <p className="text-sm font-medium font-mono text-[#0A2B20]">
                      {studentProfile?.usn || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Degree</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">
                      {studentProfile?.degree || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Course</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">
                      {studentProfile?.course || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">University</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">
                      {studentProfile?.university || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Academic Year</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">
                      {studentProfile?.academicYear || '—'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Mobile</Label>
                    <p className="text-sm font-medium text-[#0A2B20]">
                      {studentProfile?.mobile || '—'}
                    </p>
                  </div>
                </div>

                {studentProfile?.bio && (
                  <div className="pt-4 border-t border-gray-100">
                    <Label className="text-xs text-gray-500">Bio</Label>
                    <p className="text-sm text-[#0A2B20] mt-1">{studentProfile.bio}</p>
                  </div>
                )}

                {studentProfile?.skills && studentProfile.skills.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <Label className="text-xs text-gray-500 mb-2 block">Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-[#0A2B20]/5 text-[#0A2B20] border-0"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {studentProfile?.teamMembers && studentProfile.teamMembers.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <Label className="text-xs text-gray-500 mb-2 block">Team Members</Label>
                    <div className="space-y-2">
                      {studentProfile.teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#0A2B20] flex items-center justify-center text-white text-xs font-medium">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0A2B20]">
                              {member.name}
                              {member.isLeader && (
                                <span className="ml-2 text-xs text-[#4a7c59]">(Leader)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.usn} • {member.course}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
