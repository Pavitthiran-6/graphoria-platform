import { useState } from "react";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  summary: string;
}

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Research",
    summary: "We analyze your brand, audience, and goals to uncover insights that guide the entire strategy.",
    description: "We dive deep into understanding your brand, audience, and goals. Through stakeholder interviews, market analysis, and competitive research, we uncover insights that shape our strategic direction."
  },
  {
    number: "02",
    title: "Strategy & Concept",
    summary: "We define a clear creative direction and explore concepts to align with your brand vision.",
    description: "Based on our research, we develop a clear creative strategy and explore multiple concept directions. We refine these ideas through collaborative workshops to find the perfect visual identity that aligns with your vision."
  },
  {
    number: "03",
    title: "Design & Development",
    summary: "We craft visually impactful designs with precision and consistency across all touchpoints.",
    description: "Our team brings the chosen concept to life with meticulous attention to detail. From brand guidelines to digital experiences, we craft every element to ensure consistency and impact across all touchpoints."
  },
  {
    number: "04",
    title: "Refinement & Delivery",
    summary: "We refine based on feedback and deliver polished assets ready for real-world impact.",
    description: "We iterate based on your feedback, polishing every detail until perfection. After final approval, we deliver comprehensive brand assets and provide guidance for implementation across all channels."
  }
];

const OurApproach = () => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (number: string) => {
    setExpandedSteps(prev => ({ ...prev, [number]: !prev[number] }));
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="pt-28 md:pt-32 pb-12 md:pb-16 px-5 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="flex flex-col items-center animate-fade-in">
              <span className="text-2xl md:text-2xl font-bold text-foreground/90 leading-none mb-1 md:mb-2 uppercase tracking-[2px] md:tracking-[0.2em]">
                Our
              </span>
              <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green-glow leading-[1.05] md:leading-[1.1]">
                Approach
              </span>
              <div className="w-10 h-[3px] bg-primary rounded-full mt-2.5 md:mt-4" />
            </h1>
            <p className="mt-5 md:mt-6 text-sm md:text-lg text-muted-foreground max-w-[300px] md:max-w-[720px] mx-auto leading-[1.6] md:leading-[1.75] tracking-[0.2px]">
              Our strategic design process transforms ideas into powerful brand experiences.
              We combine creativity with strategy to deliver solutions that resonate, engage, and inspire.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-0">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className="group relative flex gap-6 md:gap-12 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Timeline Visual (Mobile & Desktop) */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-card border border-border flex items-center justify-center text-sm md:text-2xl font-bold text-primary shrink-0 group-hover:border-primary/50 transition-colors">
                    {step.number}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-px h-full min-h-[40px] bg-primary/20 my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-10 md:pb-16 text-left">
                  <h3 className="text-lg md:text-3xl font-bold text-foreground mb-3 md:mb-6 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <div className="bg-card/40 md:bg-card rounded-2xl border border-border p-4 md:p-10 hover:border-primary/50 transition-all duration-500">
                    {/* Desktop Content */}
                    <p className="hidden md:block text-muted-foreground leading-[1.8] text-base">
                      {step.description}
                    </p>

                    {/* Mobile Content (Summarized + Expandable) */}
                    <div className="md:hidden">
                      <p className="text-muted-foreground leading-[1.6] text-sm">
                        {expandedSteps[step.number] ? step.description : step.summary}
                      </p>
                      <button
                        onClick={() => toggleStep(step.number)}
                        className="mt-3 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
                      >
                        {expandedSteps[step.number] ? (
                          <>Show Less <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Read More <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 md:px-12 pt-12 pb-24 bg-card/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How We Deliver Results
            </h2>
            <div className="w-20 h-1 bg-primary/40 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                title: "Strategic Thinking",
                description: "Every design decision is backed by research and strategy",
                icon: (
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "Collaborative Process",
                description: "We work closely with you at every step of the journey",
                icon: (
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              },
              {
                title: "Results-Driven",
                description: "Designs that deliver measurable business impact",
                icon: (
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className="text-center p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40">
                  {item.icon}
                </div>
                <h4 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurApproach;
