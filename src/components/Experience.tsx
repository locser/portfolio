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
    <section id="experience" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-neutral-200 mb-12 text-center">Professional Experience</h2>
        
        <div className="space-y-8">
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
                    <span className="text-neutral-400 text-lg font-bold">{exp.period}</span>
                  </div>
                  <div className="absolute top-2 -left-1.5 md:hidden h-3 w-3 rounded-full bg-neutral-700" />
                </div>
                
                {/* Content */}
                <div className="flex-grow">
                  <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all">
                    <h3 className="text-xl font-semibold text-neutral-200">{exp.title}</h3>
                    <p className="text-neutral-400 mb-4">{exp.company}</p>
                    
                    <ul className="list-disc list-inside space-y-2 text-neutral-300 mb-4">
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-sm bg-neutral-800 text-neutral-300 rounded-full"
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