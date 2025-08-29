import Image from "next/image";
import Hero from "./components/Hero";
import Choose from "./components/Choose";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import Footer from "./components/Footer";

export default function Home() {
  return <div>
    <Hero/>
    <Choose/>
    <HowItWorks/>
    <SuccessStories/>
    <Footer/>
  </div>;
}
