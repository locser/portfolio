"use client";

import { motion } from 'framer-motion';
import { FaDocker, FaGitAlt, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiMongodb, SiNextdotjs, SiPostgresql, SiRedis, SiTailwindcss, SiTypescript, SiVercel } from 'react-icons/si';

interface TechStackItem {
  name: string;
  icon: JSX.Element;
  category: string;
}

const techStack: TechStackItem[] = [
  // Frontend
  { name: 'React', icon: <FaReact className="text-[#61DAFB]" />, category: 'Frontend' },
  { name: 'Next.js', icon: <SiNextdotjs />, category: 'Frontend' },
  { name: 'TypeScript', icon: <SiTypescript className="text-[#3178C6]" />, category: 'Frontend' },
  { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#06B6D4]" />, category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', icon: <FaNodeJs className="text-[#339933]" />, category: 'Backend' },
  { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" />, category: 'Backend' },
  { name: 'PostgreSQL', icon: <SiPostgresql className="text-[#336791]" />, category: 'Backend' },
  { name: 'Redis', icon: <SiRedis className="text-[#DC382D]" />, category: 'Backend' },
  
  // DevOps & Tools
  { name: 'Git', icon: <FaGitAlt className="text-[#F05032]" />, category: 'Tools' },
  { name: 'Docker', icon: <FaDocker className="text-[#2496ED]" />, category: 'Tools' },
  { name: 'Vercel', icon: <SiVercel />, category: 'Tools' },
];

const TechStack = () => {
  const categories = Array.from(new Set(techStack.map(tech => tech.category)));

  return (
    <section id="tech-stack" className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-neutral-200 mb-10 text-center tracking-tight">
          Technical Stack
        </h2>
        
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-6">
              <h3 className="text-xl font-bold text-zinc-800 dark:text-neutral-350 mb-6 border-b border-zinc-200 dark:border-zinc-900 pb-2">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {techStack
                  .filter(tech => tech.category === category)
                  .map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-neutral-800 hover:border-zinc-400 dark:hover:border-neutral-700 transition-all shadow-sm dark:shadow-none"
                    >
                      <div className="text-4xl mb-4 filter dark:brightness-100 brightness-95">{tech.icon}</div>
                      <span className="text-zinc-850 dark:text-neutral-300 font-semibold text-sm">{tech.name}</span>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;