import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isValidUSN, addStudentProfile, addCompanyProfile, registerUser } from '@/data/mockStore';
import type { TeamMember, StudentProfile, CompanyProfile } from '@/types';

interface FormError {
  field: string;
  message: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [errors, setErrors] = useState<FormError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student fields
  const [studentName, setStudentName] = useState('');
  const [mobile, setMobile] = useState('');
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [usn, setUsn] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'leader', name: '', usn: '', course: '', isLeader: true },
  ]);

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  const handleTeamSizeChange = (value: string) => {
    const size = parseInt(value);
    setTeamSize(value);
    const newMembers: TeamMember[] = [
      { id: 'leader', name: studentName, usn, course, isLeader: true },
    ];
    for (let i = 1; i < size; i++) {
      newMembers.push({
        id: `member_${i}`,
        name: '',
        usn: '',
        course: '',
        isLeader: false,
      });
    }
    setTeamMembers(newMembers);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const validateStudentForm = (): boolean => {
    const newErrors: FormError[] = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push({ field: 'email', message: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }
    if (!studentName.trim()) newErrors.push({ field: 'studentName', message: 'Name is required' });
    if (!mobile.trim()) newErrors.push({ field: 'mobile', message: 'Mobile number is required' });
    if (!course.trim()) newErrors.push({ field: 'course', message: 'Course is required' });
    if (!academicYear) newErrors.push({ field: 'academicYear', message: 'Academic year is required' });
    if (!usn.trim()) {
      newErrors.push({ field: 'usn', message: 'USN is required' });
    } else if (!isValidUSN(usn)) {
      newErrors.push({ field: 'usn', message: 'USN must be 10 chars (e.g., 2VX25CB037)' });
    }
    if (!university.trim()) newErrors.push({ field: 'university', message: 'University is required' });
    if (!degree.trim()) newErrors.push({ field: 'degree', message: 'Degree is required' });

    // Validate team members
    teamMembers.forEach((member, idx) => {
      if (!member.name.trim()) {
        newErrors.push({ field: `member_${idx}_name`, message: `Member ${idx + 1} name required` });
      }
      if (!member.usn.trim()) {
        newErrors.push({ field: `member_${idx}_usn`, message: `Member ${idx + 1} USN required` });
      } else if (!isValidUSN(member.usn)) {
        newErrors.push({ field: `member_${idx}_usn`, message: `Invalid USN format` });
      }
      if (!member.course.trim()) {
        newErrors.push({ field: `member_${idx}_course`, message: `Member ${idx + 1} course required` });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const validateCompanyForm = (): boolean => {
    const newErrors: FormError[] = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push({ field: 'email', message: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }
    if (!companyName.trim()) newErrors.push({ field: 'companyName', message: 'Company name is required' });
    if (!companyEmail.trim()) newErrors.push({ field: 'companyEmail', message: 'Contact email is required' });
    if (!companyPhone.trim()) newErrors.push({ field: 'companyPhone', message: 'Phone number is required' });
    if (!industry.trim()) newErrors.push({ field: 'industry', message: 'Industry is required' });
    if (!description.trim()) newErrors.push({ field: 'description', message: 'Description is required' });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentForm()) return;

    setIsLoading(true);
    try {
      const user = authRegister ? await authRegister(email, password, 'student') : registerUser(email, password, 'student');

      const profile: StudentProfile = {
        id: `sp_${Date.now()}`,
        userId: user.id,
        name: studentName,
        mobile,
        course,
        academicYear,
        usn: usn.toUpperCase(),
        university,
        degree,
        bio: '',
        skills: [],
        avatar: undefined,
        teamMembers: teamMembers.map((m) => ({
          ...m,
          usn: m.usn.toUpperCase(),
        })),
        profileCompleted: 60,
      };

      addStudentProfile(profile);
      navigate('/student-dashboard');
    } catch {
      setErrors([{ field: 'general', message: 'Registration failed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCompanyForm()) return;

    setIsLoading(true);
    try {
      const user = authRegister
        ? await authRegister(email, password, 'company')
        : registerUser(email, password, 'company');

      const profile: CompanyProfile = {
        id: `cp_${Date.now()}`,
        userId: user.id,
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        website,
        industry,
        size: companySize,
        description,
        logo: undefined,
        isApproved: false,
        isActive: false,
        bookmarks: [],
      };

      addCompanyProfile(profile);
      navigate('/company-dashboard');
    } catch {
      setErrors([{ field: 'general', message: 'Registration failed. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0A2B20] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#DCE885]" />
          </div>
          <span className="text-2xl font-bold text-[#0A2B20]">
            Intern<span className="text-[#4a7c59]">Connect</span>
          </span>
        </div>

        <Card className="border-0 shadow-xl shadow-[#0A2B20]/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-[#0A2B20]">Create your account</CardTitle>
            <p className="text-sm text-gray-500">Join as a student or company</p>
          </CardHeader>
          <CardContent>
            {errors.some((e) => e.field === 'general') && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{getError('general')}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger value="student" className="data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
                  Student
                </TabsTrigger>
                <TabsTrigger value="company" className="data-[state=active]:bg-[#0A2B20] data-[state=active]:text-white">
                  Company
                </TabsTrigger>
              </TabsList>

              {/* Student Registration */}
              <TabsContent value="student">
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  {/* Account Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-email">Email</Label>
                      <Input
                        id="s-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={getError('email') ? 'border-red-400' : ''}
                      />
                      {getError('email') && <p className="text-xs text-red-500">{getError('email')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="s-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={getError('password') ? 'border-red-400 pr-10' : 'pr-10'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {getError('password') && <p className="text-xs text-red-500">{getError('password')}</p>}
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-name">Full Name</Label>
                      <Input
                        id="s-name"
                        placeholder="Your full name"
                        value={studentName}
                        onChange={(e) => {
                          setStudentName(e.target.value);
                          if (teamMembers[0]?.isLeader) {
                            updateTeamMember(0, 'name', e.target.value);
                          }
                        }}
                        className={getError('studentName') ? 'border-red-400' : ''}
                      />
                      {getError('studentName') && <p className="text-xs text-red-500">{getError('studentName')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-mobile">Mobile Number</Label>
                      <Input
                        id="s-mobile"
                        placeholder="+91 9876543210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className={getError('mobile') ? 'border-red-400' : ''}
                      />
                      {getError('mobile') && <p className="text-xs text-red-500">{getError('mobile')}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-degree">Degree</Label>
                      <Input
                        id="s-degree"
                        placeholder="B.Tech"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className={getError('degree') ? 'border-red-400' : ''}
                      />
                      {getError('degree') && <p className="text-xs text-red-500">{getError('degree')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-course">Course</Label>
                      <Input
                        id="s-course"
                        placeholder="Computer Science"
                        value={course}
                        onChange={(e) => {
                          setCourse(e.target.value);
                          if (teamMembers[0]?.isLeader) {
                            updateTeamMember(0, 'course', e.target.value);
                          }
                        }}
                        className={getError('course') ? 'border-red-400' : ''}
                      />
                      {getError('course') && <p className="text-xs text-red-500">{getError('course')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-year">Academic Year</Label>
                      <Select value={academicYear} onValueChange={setAcademicYear}>
                        <SelectTrigger className={getError('academicYear') ? 'border-red-400' : ''}>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th Year">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                      {getError('academicYear') && <p className="text-xs text-red-500">{getError('academicYear')}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="s-usn">USN</Label>
                      <Input
                        id="s-usn"
                        placeholder="2VX25CB037"
                        value={usn}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setUsn(val);
                          if (teamMembers[0]?.isLeader) {
                            updateTeamMember(0, 'usn', val);
                          }
                        }}
                        maxLength={10}
                        className={getError('usn') ? 'border-red-400 font-mono' : 'font-mono'}
                      />
                      {getError('usn') && <p className="text-xs text-red-500">{getError('usn')}</p>}
                      <p className="text-xs text-gray-400">10-character alphanumeric (e.g., 2VX25CB037)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="s-university">University</Label>
                      <Input
                        id="s-university"
                        placeholder="VTU"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className={getError('university') ? 'border-red-400' : ''}
                      />
                      {getError('university') && <p className="text-xs text-red-500">{getError('university')}</p>}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="space-y-2 mb-4">
                      <Label>Number of team members</Label>
                      <Select value={teamSize} onValueChange={handleTeamSizeChange}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} {n === 1 ? 'member' : 'members'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      {teamMembers.map((member, idx) => (
                        <div key={member.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-[#0A2B20]">
                              {member.isLeader ? '👤 Team Leader' : `👥 Member ${idx}`}
                            </h4>
                            {!member.isLeader && (
                              <button
                                type="button"
                                onClick={() => {
                                  setTeamMembers(teamMembers.filter((_, i) => i !== idx));
                                  setTeamSize(String(teamMembers.length - 1));
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <div>
                              <Input
                                placeholder="Name"
                                value={member.name}
                                onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                                className={getError(`member_${idx}_name`) ? 'border-red-400' : ''}
                              />
                              {getError(`member_${idx}_name`) && (
                                <p className="text-xs text-red-500 mt-1">{getError(`member_${idx}_name`)}</p>
                              )}
                            </div>
                            <div>
                              <Input
                                placeholder="USN"
                                value={member.usn}
                                onChange={(e) => updateTeamMember(idx, 'usn', e.target.value.toUpperCase())}
                                maxLength={10}
                                className={`font-mono ${getError(`member_${idx}_usn`) ? 'border-red-400' : ''}`}
                              />
                              {getError(`member_${idx}_usn`) && (
                                <p className="text-xs text-red-500 mt-1">{getError(`member_${idx}_usn`)}</p>
                              )}
                            </div>
                            <div>
                              <Input
                                placeholder="Course"
                                value={member.course}
                                onChange={(e) => updateTeamMember(idx, 'course', e.target.value)}
                                className={getError(`member_${idx}_course`) ? 'border-red-400' : ''}
                              />
                              {getError(`member_${idx}_course`) && (
                                <p className="text-xs text-red-500 mt-1">{getError(`member_${idx}_course`)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#0A2B20] hover:bg-[#113822] text-white font-medium"
                  >
                    {isLoading ? 'Creating account...' : 'Create Student Account'}
                  </Button>
                </form>
              </TabsContent>

              {/* Company Registration */}
              <TabsContent value="company">
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-email">Login Email</Label>
                      <Input
                        id="c-email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={getError('email') ? 'border-red-400' : ''}
                      />
                      {getError('email') && <p className="text-xs text-red-500">{getError('email')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="c-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={getError('password') ? 'border-red-400 pr-10' : 'pr-10'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {getError('password') && <p className="text-xs text-red-500">{getError('password')}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-name">Company Name</Label>
                    <Input
                      id="c-name"
                      placeholder="Your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={getError('companyName') ? 'border-red-400' : ''}
                    />
                    {getError('companyName') && <p className="text-xs text-red-500">{getError('companyName')}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-contact-email">Contact Email</Label>
                      <Input
                        id="c-contact-email"
                        type="email"
                        placeholder="hr@company.com"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className={getError('companyEmail') ? 'border-red-400' : ''}
                      />
                      {getError('companyEmail') && <p className="text-xs text-red-500">{getError('companyEmail')}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-phone">Phone Number</Label>
                      <Input
                        id="c-phone"
                        placeholder="+91 80 1234 5678"
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                        className={getError('companyPhone') ? 'border-red-400' : ''}
                      />
                      {getError('companyPhone') && <p className="text-xs text-red-500">{getError('companyPhone')}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-website">Website</Label>
                      <Input
                        id="c-website"
                        placeholder="https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-industry">Industry</Label>
                      <Input
                        id="c-industry"
                        placeholder="Software Development"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className={getError('industry') ? 'border-red-400' : ''}
                      />
                      {getError('industry') && <p className="text-xs text-red-500">{getError('industry')}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-size">Company Size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="10-50">10-50 employees</SelectItem>
                        <SelectItem value="50-200">50-200 employees</SelectItem>
                        <SelectItem value="200-1000">200-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-description">Company Description</Label>
                    <textarea
                      id="c-description"
                      placeholder="Tell us about your company..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2B20] focus:border-transparent resize-none ${
                        getError('description') ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {getError('description') && <p className="text-xs text-red-500">{getError('description')}</p>}
                  </div>

                  <div className="bg-[#FFF8E1] rounded-lg p-4 flex items-start gap-3">
                    <div className="text-amber-500 text-lg">⚠️</div>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Approval Required</p>
                      <p className="text-xs text-amber-700">
                        Your company registration will be reviewed by our admin team before activation.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#0A2B20] hover:bg-[#113822] text-white font-medium"
                  >
                    {isLoading ? 'Submitting...' : 'Register Company'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-sm text-center text-gray-500 mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#0A2B20] font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
