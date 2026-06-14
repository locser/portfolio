import Blog from "../components/Blog";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/hero";
import Projects from "../components/Projects";
import { FloatingNav } from "../components/ui/floating-navbar";

export default function Home() {
  return (
    <main className="relative bg-zinc-50 dark:bg-black-100 text-zinc-900 dark:text-zinc-300 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 transition-colors duration-300" >
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={[
          { name: 'Home', link: '/', icon: undefined },
          { name: 'Projects', link: '/projects', icon: undefined },
          { name: 'Blog', link: '/blog', icon: undefined },
          { name: 'About', link: '/about', icon: undefined },
          { name: 'Contact', link: '#contact', icon: undefined }
        ]} />
        <Hero/>
        {/* <Grid /> */}
        <Projects />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
