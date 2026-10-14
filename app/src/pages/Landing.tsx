import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Search, Shield, Zap, Users, Briefcase } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A2B20]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#DCE885]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#DCE885]/3 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DCE885] animate-pulse" />
              <span className="text-xs font-medium text-white/70 tracking-widest uppercase">
                Student × Industry Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Your projects deserve{' '}
              <span className="text-[#DCE885]">real</span>
              <br />
              <span className="text-[#DCE885]">opportunities</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-xl">
              InternConnect lets students showcase their best work and lets companies discover the talent they have been looking for — no cold emails, no middlemen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-[#DCE885] text-[#0A2B20] hover:bg-[#d4df7a] font-semibold text-base px-8 py-6 rounded-full gap-2 shadow-lg shadow-[#DCE885]/20"
              >
                Upload a project
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-full"
              >
                Find intern talent
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Students', value: '2,500+' },
              { label: 'Companies', value: '180+' },
              { label: 'Projects', value: '3,200+' },
              { label: 'Offers Made', value: '850+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6"
              >
                <p className="text-2xl sm:text-3xl font-bold text-[#DCE885]">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f3526]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to <span className="text-[#DCE885]">connect</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A complete platform bridging the gap between academic projects and industry opportunities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Upload className="w-6 h-6" />,
                title: 'Upload Projects',
                desc: 'Showcase your projects with files, descriptions, and demos. Control who can see your work.',
              },
              {
                icon: <Search className="w-6 h-6" />,
                title: 'Discover Talent',
                desc: 'Companies can browse student projects, request access, and find the perfect intern candidates.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Privacy First',
                desc: 'Projects are hidden from other students. Only approved companies get full access.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Direct Offers',
                desc: 'Companies send internship offers directly based on projects they love.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Team Projects',
                desc: 'Register as a team with your classmates. Collaborate and showcase together.',
              },
              {
                icon: <Briefcase className="w-6 h-6" />,
                title: 'Verified Companies',
                desc: 'All companies are vetted by our admin team. No fake recruiters, only real opportunities.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#DCE885]/10 flex items-center justify-center text-[#DCE885] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A2B20]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How it <span className="text-[#DCE885]">works</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Three simple steps from project upload to internship offer.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Project',
                desc: 'Students create an account, complete their profile, and upload projects with detailed descriptions and files.',
              },
              {
                step: '02',
                title: 'Companies Discover You',
                desc: 'Verified companies browse project summaries and request access to view full project details.',
              },
              {
                step: '03',
                title: 'Receive Offers',
                desc: 'Once access is granted, companies can send internship offers directly to students based on their work.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-[#DCE885]/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#0A2B20]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#DCE885] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#0A2B20]" />
              </div>
              <span className="text-lg font-bold text-white">
                Intern<span className="text-[#DCE885]">Connect</span>
              </span>
            </div>
            <p className="text-white/40 text-sm">
              © 2025 InternConnect. Bridging students and industry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
