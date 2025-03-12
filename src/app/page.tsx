import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/hero";
import Projects from "../components/Projects";
import TechStack from "../components/TechStack";
import { FloatingNav } from "../components/ui/floating-navbar";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5" >
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={[
          { name: 'Home', link: '/', icon: undefined },
          { name: 'Projects', link: '#projects', icon: undefined },
          { name: 'Blog', link: '#blog', icon: undefined },
          { name: 'Contact', link: '#contact', icon: undefined }
        ]} />
        <Hero/>
        {/* <Grid /> */}
        <Projects />
        <Experience />
        <TechStack />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
