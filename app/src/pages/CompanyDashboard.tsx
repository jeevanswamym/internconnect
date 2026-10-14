import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Bookmark,
  Send,
  Eye,
  Building2,
  CheckCircle,
  FileText,
  BookmarkCheck,
} from 'lucide-react';
import {
  getApprovedProjects,
  getCompanyAccessRequests,
  getCompanyOffers,
  addAccessRequest,
  addOffer,
  toggleBookmark,
  mockCompanyProfiles,
} from '@/data/mockStore';
import type { Project, InternshipOffer, AccessRequest, CompanyProfile } from '@/types';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const companyProfile = profile as CompanyProfile | null;
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects] = useState<Project[]>(getApprovedProjects());
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(
    user ? getCompanyAccessRequests(companyProfile?.id || '') : []
  );
  const [offers, setOffers] = useState<InternshipOffer[]>(
    user ? getCompanyOffers(companyProfile?.id || '') : []
  );
  const [bookmarks, setBookmarks] = useState<string[]>(companyProfile?.bookmarks || []);

  // Dialog states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [offerPosition, setOfferPosition] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerStipend, setOfferStipend] = useState('');
  const [offerDuration, setOfferDuration] = useState('');

  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold text-[#0A2B20] mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please login as a company to access this dashboard.</p>
          <Button onClick={() => navigate('/login')} className="bg-[#0A2B20]">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bookmarkedProjects = projects.filter((p) => bookmarks.includes(p.id));

  const hasAccess = (projectId: string) =>
    accessRequests.some((r) => r.projectId === projectId && r.status === 'approved');

  const hasPendingRequest = (projectId: string) =>
    accessRequests.some((r) => r.projectId === projectId && r.status === 'pending');

  const handleRequestAccess = () => {
    if (!selectedProject || !companyProfile) return;

    const request: AccessRequest = {
      id: `ar_${Date.now()}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      companyId: companyProfile.id,
      companyName: companyProfile.name,
      studentId: selectedProject.studentId,
      studentName: selectedProject.studentName,
      status: 'pending',
      message: requestMessage,
      createdAt: new Date().toISOString(),
    };

    addAccessRequest(request);
    setAccessRequests(getCompanyAccessRequests(companyProfile.id));
    setShowRequestDialog(false);
    setRequestMessage('');
    setSelectedProject(null);
  };

  const handleSendOffer = () => {
    if (!selectedProject || !companyProfile) return;

    const offer: InternshipOffer = {
      id: `of_${Date.now()}`,
      studentId: selectedProject.studentId,
      studentName: selectedProject.studentName,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      companyId: companyProfile.id,
      companyName: companyProfile.name,
      position: offerPosition,
      description: offerDescription,
      stipend: offerStipend || undefined,
      duration: offerDuration,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addOffer(offer);
    setOffers(getCompanyOffers(companyProfile.id));
    setShowOfferDialog(false);
    setOfferPosition('');
    setOfferDescription('');
    setOfferStipend('');
    setOfferDuration('');
    setSelectedProject(null);
  };

  const handleToggleBookmark = (projectId: string) => {
    if (!companyProfile) return;
    toggleBookmark(companyProfile.id, projectId);
    const updated = mockCompanyProfiles.find((c: CompanyProfile) => c.id === companyProfile.id);
    setBookmarks(updated?.bookmarks || []);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-[#0A2B20] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#DCE885]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0A2B20]">
                {companyProfile?.name || 'Company'}
              </p>
              <p className="text-xs text-gray-500">{companyProfile?.industry}</p>
            </div>
          </div>
          {!companyProfile?.isApproved && (
            <Badge className="bg-amber-100 text-amber-700">Pending Approval</Badge>
          )}
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500 hover:text-red-600">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-gray-200 p-1 mb-6 w-full sm:w-auto">
            <TabsTrigger value="discover" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
              {bookmarks.length > 0 && (
                <Badge className="bg-[#DCE885] text-[#0A2B20] text-xs ml-1">{bookmarks.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2 data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Offers</span>
            </TabsTrigger>
          </TabsList>

          {/* DISCOVER TAB */}
          <TabsContent value="discover" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search projects by title, summary, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-white border-gray-200"
                />
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No projects found</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map((project) => {
                  const accessGranted = hasAccess(project.id);
                  const pendingReq = hasPendingRequest(project.id);
                  const isBookmarked = bookmarks.includes(project.id);

                  return (
                    <Card key={project.id} className="border-0 shadow-sm rounded-2xl overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-semibold text-[#0A2B20]">
                                {project.title}
                              </h3>
                              <Badge className="bg-green-100 text-green-700 text-xs">approved</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{project.summary}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-gray-200 text-gray-500"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>By {project.studentName}</span>
                              <span>{project.category}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {project.views} views
                              </span>
                            </div>

                            {/* Access status */}
                            {accessGranted ? (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-700 mb-2">
                                  ✅ You have access to this project
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs gap-1"
                                  >
                                    <FileText className="w-3 h-3" />
                                    View Files ({project.files.length})
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowOfferDialog(true);
                                    }}
                                    className="bg-[#0A2B20] hover:bg-[#113822] h-8 text-xs gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    Send Offer
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  disabled={pendingReq || !companyProfile?.isApproved}
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowRequestDialog(true);
                                  }}
                                  className="bg-[#DCE885] text-[#0A2B20] hover:bg-[#d4df7a] h-8 text-xs gap-1 disabled:opacity-50"
                                >
                                  <Send className="w-3 h-3" />
                                  {pendingReq ? 'Request Pending' : 'Request Access'}
                                </Button>
                                {!companyProfile?.isApproved && (
                                  <p className="text-xs text-amber-600 self-center">
                                    Approval required to request access
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleToggleBookmark(project.id)}
                            className={`h-8 w-8 ${
                              isBookmarked ? 'text-[#0A2B20]' : 'text-gray-300 hover:text-[#0A2B20]'
                            }`}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* BOOKMARKS TAB */}
          <TabsContent value="bookmarks" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Saved Projects</h2>
            {bookmarkedProjects.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No saved projects yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookmarkedProjects.map((project) => (
                  <Card key={project.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-[#0A2B20]">{project.title}</h3>
                          <p className="text-sm text-gray-500">{project.summary}</p>
                          <p className="text-xs text-gray-400 mt-1">By {project.studentName}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleBookmark(project.id)}
                          className="text-[#0A2B20] hover:text-red-600"
                        >
                          <BookmarkCheck className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* REQUESTS TAB */}
          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">My Access Requests</h2>
            {accessRequests.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No access requests yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {accessRequests.map((req) => (
                  <Card key={req.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-[#0A2B20]">
                            {req.projectTitle}
                          </h3>
                          <p className="text-xs text-gray-500">To: {req.studentName}</p>
                          {req.message && (
                            <p className="text-xs text-gray-400 mt-1">"{req.message}"</p>
                          )}
                        </div>
                        <Badge
                          className={
                            req.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {req.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* OFFERS TAB */}
          <TabsContent value="offers" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0A2B20]">Sent Offers</h2>
            {offers.length === 0 ? (
              <Card className="border-0 shadow-sm rounded-2xl p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No offers sent yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <Card key={offer.id} className="border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-[#0A2B20]">
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
                          <p className="text-xs text-gray-500">
                            To: {offer.studentName} • Based on: {offer.projectTitle}
                          </p>
                          {offer.stipend && (
                            <p className="text-xs text-gray-400 mt-1">💰 {offer.stipend}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Access Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A2B20]">Request Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-500">
              Requesting access to view <strong>{selectedProject?.title}</strong> by{' '}
              {selectedProject?.studentName}
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Introduce your company and explain why you're interested..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20] resize-none"
            />
            <Button
              onClick={handleRequestAccess}
              className="w-full bg-[#0A2B20] hover:bg-[#113822]"
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0A2B20]">Send Internship Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-500">
              Offering internship to <strong>{selectedProject?.studentName}</strong> for project{' '}
              <strong>{selectedProject?.title}</strong>
            </p>
            <div>
              <label className="text-sm font-medium mb-1 block">Position</label>
              <Input
                value={offerPosition}
                onChange={(e) => setOfferPosition(e.target.value)}
                placeholder="e.g., Frontend Developer Intern"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                placeholder="Describe the internship role and responsibilities..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Stipend (optional)</label>
                <Input
                  value={offerStipend}
                  onChange={(e) => setOfferStipend(e.target.value)}
                  placeholder="e.g., Rs. 25,000/month"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duration</label>
                <Input
                  value={offerDuration}
                  onChange={(e) => setOfferDuration(e.target.value)}
                  placeholder="e.g., 6 months"
                />
              </div>
            </div>
            <Button
              onClick={handleSendOffer}
              className="w-full bg-[#0A2B20] hover:bg-[#113822]"
            >
              Send Offer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
