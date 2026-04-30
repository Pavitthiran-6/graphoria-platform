import HeroSection from "@/components/HeroSection";
import WhyMattersSection from "@/components/WhyMattersSection";
import SelectedWorksSection from "@/components/SelectedWorksSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-overlay filter blur-[150px] z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full mix-blend-overlay filter blur-[150px] z-0" />

      <main className="relative z-10">
        <HeroSection />
        <WhyMattersSection />
        <SelectedWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
