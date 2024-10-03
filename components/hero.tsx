import { MdOutlineSlideshow } from "react-icons/md";
import ShrimperButton from './ShrimperButton';
import { Spotlight } from './ui/Spotlight';
import { TextGenerateEffect } from './ui/TextGenerateEffect';
import { FaLocationArrow } from "react-icons/fa";

const Hero = () => {
 return (
  <div className='pb-20 pt-36'>
   <div>
    <Spotlight className="-top-40 -left-40 md:-left-32 md:-top20 h-screen" fill="white" />
    <Spotlight className="-bot-20 -right-full h-[80vh] w-[50vw]" fill="red" />
    <Spotlight className="-top-28 -left-80 h-[80vh] w-[50vw]" fill="blue" />

   </div>
   {/* dark:bg-grid-white/[0.5] bg-grid-black/[0.2] */}
   <div className="h-screen w-full dark:bg-black-100 bg-white  flex items-center justify-center absolute top-0 left-0 ">
    {/* Radial gradient for the container to give a faded look */}
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
     {/* Backgrounds */}
    </p>
   </div>

   <div className='flex justify-center relative my-20 z-10'>
    <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[80vw] flex flex-col items-center justify-center'>
     <h2 className='uppercase text-center text-blue-100 text-xs sm:text-xs max-w-80 tracking-widest '>Dynamic web magic with Next.js</h2>

     <TextGenerateEffect className="text-center text-neutral-500 text-4xl sm:text-5xl md:text-6xl font-bold my-10" words="Transforming the web with Next.js magic" />

     <p className="text-center">
      <span className="text-neutral-500 text-lg sm:text-xl md:text-2xl font-bold">Hi, I am Copier, a web developer with a passion for creating dynamic and interactive web experiences. With a strong foundation in Next.js, I specialize in building fast, scalable, and user-friendly websites and applications.</span>
     </p>

     <a href="#button-shrimper">
      <ShrimperButton title={'Show my ...'} icon={<MdOutlineSlideshow />} position={'right'} otherClasses='' >

      </ShrimperButton>
     </a>

    </div>
   </div>

   <div className="flex flex-row items-center">
    <h1 className="heading md:max-w lg:max-w">
     Làm việc tại Copier Việt Nam - Công ty chuyên nghiệp về phát triển website và ứng dụng web
    </h1>
    <p className="text-white-200 md:mt-10 my-5 text-center">
     Công ty tôi yêu abc
    </p>
    <a href="mailto:locser.02@gmail.com">
     <ShrimperButton
      title="Let's get in touch"
      icon={<FaLocationArrow />}
      position="right"
     />
    </a>
   </div>
  </div>


 )
}

export default Hero
