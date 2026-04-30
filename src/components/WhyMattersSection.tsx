const WhyMattersSection = () => {
  const features = [
    {
      title: "Creative Innovation",
      description: "At Graphoria, we bring bold, imaginative ideas to life, redefining design standards in every project.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Stunning Visuals",
      description: "We craft visually captivating designs that blend aesthetics with functionality, leaving a lasting impression.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: "Cutting-Edge Solutions",
      description: "Our team leverages modern design tools and techniques to deliver innovative and efficient creative solutions.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="why-matters" className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-20 lg:pt-12 lg:pb-20">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="section-heading">Why Graphoria Matters</h2>
        <div className="green-underline" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="feature-card group">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              <div className="text-primary transition-colors">
                {f.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyMattersSection;
