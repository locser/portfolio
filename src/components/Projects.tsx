"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { projects } from '@/src/config/data';

const Projects = () => {
  // Only display the top 3 projects on the homepage
  const featuredProjects = projects.slice(0, 3);

  return (
    <section id="projects" className="py-24 border-t border-zinc-200 dark:border-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4 text-center md:text-5xl"
        >
          Featured Projects
        </motion.h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-lg mx-auto mb-16 font-light">
          A showcase of recent engineering work, open-source libraries, and digital designs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-900 rounded-3xl p-6 hover:border-zinc-400 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-[#0f0f10] transition-all duration-300 flex flex-col justify-between min-h-[360px] shadow-sm dark:shadow-none"
            >
              <div>
                <div className="relative w-full h-44 overflow-hidden rounded-2xl mb-6 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-250 transition-colors shadow-lg"
                    >
                      View Code &amp; Demo
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-zinc-650 dark:group-hover:text-zinc-300 transition-colors">{project.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 font-light group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded text-[9px] uppercase font-mono tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href="/projects"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black rounded-full text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2 group"
          >
            Xem Tất Cả Dự Án 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;