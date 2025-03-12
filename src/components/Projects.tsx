"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { projects } from '@/src/config/data';

const Projects = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const allTags = ['All', ...new Set(projects.flatMap(project => project.tags))];

  const filteredProjects = selectedTag === 'All'
    ? projects
    : projects.filter(project => project.tags.includes(selectedTag));

  return (
    <section id="projects" className="to-neutral-900 overflow-hidden py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-neutral-200 mb-12 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allTags.map(tag => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTag(tag)}
              className={`py-2 px-6 min-w-[120px] rounded-full transition-all ${selectedTag === tag
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/25'
                : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-700/25'}`}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 space-x-6 scrollbar-hide">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[300px] md:w-[400px] snap-center"
              >
                <div className="group relative h-full bg-neutral-900/50 rounded-xl border-2 border-neutral-800/50 hover:border-blue-500/50 transition-all overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors border border-white/25 hover:border-white/50"
                      >
                        View Project
                      </a>
                    </motion.div>
                  </div>
                  <div className="p-6 relative z-10">
                    <h3 className="text-xl font-semibold text-neutral-200 mb-2">{project.title}</h3>
                    <p className="text-neutral-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm bg-neutral-800/80 text-neutral-300 rounded-full border border-neutral-700/50 hover:border-blue-500/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center text-neutral-400 py-12 border-2 border-dashed border-neutral-800 rounded-xl">
            No projects found for the selected filter.
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;