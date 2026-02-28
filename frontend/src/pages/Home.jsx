import { Link } from "react-router-dom";
import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import WhyChoose from "../components/home/WhyChoose";
import HowItWorks from "../components/home/HowItWorks";
import BuiltForEveryone from "../components/home/BuiltForEveryone";
import CTABanner from "../components/home/CTABanner";
import Footer from "../components/common/footer/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <WhyChoose />
      <HowItWorks />
      <BuiltForEveryone />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Home;
