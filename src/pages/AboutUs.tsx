import { useEffect } from "react";
import { Link } from "react-router-dom";
import graphoriaLogo from "@/assets/graphoria-logo.png";
import Footer from "@/components/Footer";
import { BRAND } from "@/config/brand";
// TODO: Add missing image assets
// import portfolio1 from "@/assets/Blue and red bottle/1z.jpg.jpeg";
// import portfolio2 from "@/assets/chocolate/1 jpg.jpg.jpeg";
// import portfolio3 from "@/assets/rio bottle/Rio mockup 5.png";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-overlay filter blur-[150px] z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-overlay filter blur-[150px] z-0" />


      <main className="relative z-10">
        {/* Hero Group Image Section */}
        <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              About {BRAND.short}
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-foreground mb-4 max-w-[320px] md:max-w-none mx-auto leading-[1.2] md:leading-tight">
              The Studio Behind{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
                the Vision
              </span>
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-[320px] md:max-w-2xl mx-auto leading-[1.6] md:leading-relaxed">
              We are a collective of designers, developers, and dreamers pushing the boundaries of digital creativity at {BRAND.full}.
            </p>
          </div>

          {/* About Text Content */}
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden px-0 mt-12 md:mt-16">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-12 border border-border">
              <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                {/* Left side (40%) */}
                <div className="w-full md:w-[40%] space-y-6 text-left">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
                    Our Philosophy
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground leading-[1.2]">
                    Great design is more than <span className="text-primary">aesthetics</span> — it's about <span className="text-foreground">meaningful connection</span>.
                  </h3>
                  <div className="h-1 w-12 bg-primary/30 rounded-full" />
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div className="hidden md:block w-px h-48 bg-border self-center" />

                {/* Right side (60%) */}
                <div className="w-full md:w-[60%] space-y-6 text-left">
                  <p className="text-muted-foreground leading-[1.7] text-base">
                    Our team of <span className="text-foreground font-medium">passionate creatives</span> works tirelessly to transform ideas into powerful visual stories. From innovative branding solutions to stunning digital experiences, we craft every project with precision and creativity.
                  </p>
                  <p className="text-muted-foreground leading-[1.7] text-base">
                    Founded with a vision to redefine visual communication, we've grown into a full-service design studio trusted by businesses worldwide. Our commitment to excellence and <span className="text-primary">innovation</span> sets us apart in everything we create.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="max-w-[520px]">
              <div className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                Crafting digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
                  narratives
                </span> that last.
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-[1.8] text-base">
                <p className="text-foreground font-medium text-lg leading-relaxed border-l-2 border-primary pl-6">
                  {BRAND.short} was born from a simple belief: <span className="text-primary">design should be fearless</span>. We set out to challenge the ordinary.
                </p>
                <p>
                  From bold packaging concepts to immersive brand identities, every project we take on is an opportunity to push <span className="text-primary">creative boundaries</span>. We don't just design — we engineer visual stories.
                </p>
                <p>
                  Our studio thrives on collaboration, innovation, and building <span className="text-primary">meaningful connections</span>. Whether it's a startup or an established brand, we bring the same dedication to every brief.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full" />
              <div className="glass-panel rounded-3xl p-8 md:p-12 relative border-primary/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="flex items-center gap-5 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(151,255,0,0.2)] transition-all duration-300">
                      <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-3xl group-hover:text-primary transition-colors">3+</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Years</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(151,255,0,0.2)] transition-all duration-300">
                      <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-3xl group-hover:text-primary transition-colors">50+</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Projects</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(151,255,0,0.2)] transition-all duration-300">
                      <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-3xl group-hover:text-primary transition-colors">30+</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Clients</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(151,255,0,0.2)] transition-all duration-300">
                      <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-foreground font-bold text-3xl group-hover:text-primary transition-colors">10+</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              What We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
                Do
              </span>
            </h2>
            <div className="green-underline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card group">
              <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                Brand Identity
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We craft unique brand identities that tell your story, from logo design to complete visual systems that resonate with your target audience.
              </p>
            </div>
            <div className="feature-card group">
              <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                Packaging Design
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                From concept to shelf, we design packaging that stands out. Our 3D mockups and print-ready designs ensure your product makes a powerful first impression.
              </p>
            </div>
            <div className="feature-card group">
              <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <svg className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                Digital Experiences
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We build immersive web experiences and digital campaigns that captivate users, combining cutting-edge technology with stunning visual design.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
                Values
              </span>
            </h2>
            <div className="green-underline" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl p-8 border-primary/10 hover:border-primary/30 transition-colors group">
              <h3 className="text-xl font-bold text-primary mb-3">🎨 Creativity First</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every pixel matters. We approach each project with fresh eyes and bold ideas, ensuring our designs are never ordinary.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-8 border-primary/10 hover:border-primary/30 transition-colors group">
              <h3 className="text-xl font-bold text-primary mb-3">🤝 Client Partnership</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We believe in building lasting relationships. Your vision is our mission, and we work closely with you at every stage.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-8 border-primary/10 hover:border-primary/30 transition-colors group">
              <h3 className="text-xl font-bold text-primary mb-3">⚡ Innovation Driven</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We stay ahead of trends and leverage the latest tools and techniques to deliver designs that are future-proof.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-8 border-primary/10 hover:border-primary/30 transition-colors group">
              <h3 className="text-xl font-bold text-primary mb-3">✨ Quality Obsessed</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We never compromise on quality. Every deliverable goes through rigorous review to ensure it meets our high standards.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">
              Why Clients Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow">
                {BRAND.short}
              </span>
            </h2>
            <div className="green-underline" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card group hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Strategic Thinking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We go beyond visuals to craft solutions that solve real business problems.
              </p>
            </div>
            
            <div className="feature-card group hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Design That Converts</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every design decision is made to engage, communicate, and drive results.
              </p>
            </div>

            <div className="feature-card group hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">End-to-End Execution</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                From concept to final delivery, we handle every step with precision.
              </p>
            </div>

            <div className="feature-card group hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Client-Focused Approach</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We collaborate closely to ensure your vision is fully realized.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
