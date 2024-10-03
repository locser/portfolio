
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
 return (
  <footer className="w-full pt-20 pb-10" id="contact">

   <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
    <p className="md:text-base text-sm md:font-normal font-light">
     Copyright © 2024. Thanks to Adrian Hajdin
    </p>

    <div className="flex items-center md:gap-3 gap-6">
     {/* 3 icon Facebook, Github, LinkedIn*/}
     <FaFacebook className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300" href='facebook.com'
     />
     {/* git hub */}
     <FaGithub className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300" href='github.com' />

     <FaLinkedin className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300" href='linkedin.com' />

    </div>
   </div>
  </footer >
 );
};

export default Footer;
