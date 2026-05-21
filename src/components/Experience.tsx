"use client";

import { motion } from 'framer-motion';

import { experiences } from '../config/data';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

// const experiences: Experience[] = [
//   {
//     title: "Senior Frontend Developer",
//     company: "Tech Solutions Inc.",
//     period: "2022 - Present",
//     description: [
//       "Led the development of a large-scale e-commerce platform using Next.js and TypeScript",
//       "Implemented responsive design patterns and optimized performance metrics",
//       "Mentored junior developers and conducted code reviews"
//     ],
//     technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux"]
//   },
//   {
//     title: "Full Stack Developer",
//     company: "Digital Innovations Ltd",
//     period: "2020 - 2022",
//     description: [
//       "Developed and maintained multiple client-facing web applications",
//       "Implemented RESTful APIs and integrated third-party services",
//       "Optimized database queries and improved application performance"
//     ],
//     technologies: ["React", "Node.js", "PostgreSQL", "Docker"]
//   },
//   {
//     title: "Web Developer",
//     company: "Creative Agency",
//     period: "2018 - 2020",
//     description: [
//       "Built responsive websites for various clients using modern web technologies",
//       "Collaborated with designers to implement pixel-perfect UI components",
//       "Managed project timelines and client communications"
//     ],
//     technologies: ["JavaScript", "HTML5", "CSS3", "WordPress"]
//   }
// ];

const Experience = () => {
  return (
    <section id="experience" className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-neutral-200 mb-10 text-center tracking-tight">
          Professional Experience
        </h2>
        
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${exp.period}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                {/* Timeline dot */}
                <div className="absolute left-0 md:relative md:w-48 flex-shrink-0">
                  <div className="h-full md:h-auto md:text-right">
                    <span className="text-zinc-500 dark:text-neutral-400 text-lg font-bold">{exp.period}</span>
                  </div>
                  <div className="absolute top-2 -left-1.5 md:hidden h-3 w-3 rounded-full bg-zinc-300 dark:bg-neutral-700" />
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-neutral-800 hover:border-zinc-400 dark:hover:border-neutral-750 transition-all rounded-2xl p-6 shadow-sm dark:shadow-none">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-neutral-200">{exp.title}</h3>
                    <p className="text-zinc-600 dark:text-neutral-400 text-sm font-semibold mb-4">{exp.company}</p>
                    
                    <ul className="list-disc list-inside space-y-2 text-zinc-650 dark:text-neutral-350 mb-4 font-light leading-relaxed">
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-semibold bg-zinc-100 dark:bg-neutral-800 text-zinc-600 dark:text-neutral-300 rounded-full border border-zinc-200 dark:border-transparent"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;