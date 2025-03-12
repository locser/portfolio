import { FaGithub, FaLinkedin, FaLocationArrow, FaTwitter } from "react-icons/fa";
import { MdOutlineSlideshow } from "react-icons/md";

import { contactInfo } from '../config/data';

import ShrimperButton from './ShrimperButton';
import { Spotlight } from './ui/Spotlight';
import { TextGenerateEffect } from './ui/TextGenerateEffect';


const Hero = () => {
 return (
  <div className="relative min-h-screen">
   <div className="pb-20 pt-36">
    <div className="absolute inset-0 overflow-hidden">
     <Spotlight className="-top-40 -left-40 md:-left-32 md:-top20 h-screen" fill="white" />
     <Spotlight className="-bot-20 -right-full h-[80vh] w-[50vw]" fill="red" />
     <Spotlight className="-top-28 -left-80 h-[80vh] w-[50vw]" fill="blue" />
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center px-4">
     <h2 className="text-blue-100 text-sm tracking-widest uppercase mb-6">Full Stack Developer & Tech Enthusiast</h2>

     <TextGenerateEffect 
       className="text-center text-neutral-200 text-4xl sm:text-5xl md:text-6xl font-bold mb-8" 
       words="Building Modern Web Experiences with Next.js" 
     />

     <p className="text-center max-w-2xl mb-12">
      <span className="text-neutral-300 text-lg sm:text-xl">
        Passionate about creating scalable, user-centric web applications with modern technologies.
        Specializing in Next.js, React, and full-stack development.
      </span>
     </p>

     <div className="flex gap-6 mb-12">
      <a href={contactInfo.social_media.github} target="_blank" rel="noopener noreferrer">
       <FaGithub className="text-2xl text-neutral-300 hover:text-white transition-colors" />
      </a>
      <a href={contactInfo.social_media.linkedin} target="_blank" rel="noopener noreferrer">
       <FaLinkedin className="text-2xl text-neutral-300 hover:text-white transition-colors" />
      </a>
      <a href={contactInfo.social_media.twitter} target="_blank" rel="noopener noreferrer">
       <FaTwitter className="text-2xl text-neutral-300 hover:text-white transition-colors" />
      </a>
     </div>

     <div className="flex flex-row justify-center items-center gap-6 w-full max-w-xl mx-auto">
      <a href="#projects" className="flex-1">
       <ShrimperButton 
         title="View Projects" 
         icon={<MdOutlineSlideshow />} 
         position="right" 
         otherClasses="w-full" 
       />
      </a>
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex-1">
       <ShrimperButton
        title="Download CV"
        icon={<FaLocationArrow />}
        position="right"
        otherClasses="w-full"
       />
      </a>
      <a href="#contact" className="flex-1"> 
        {/* {`mailto:${contactInfo.email}`} */}
       <ShrimperButton
        title="Let's Connect"
        icon={<FaLocationArrow />}
        position="right"
        otherClasses="w-full"
       />
      </a>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Hero;
