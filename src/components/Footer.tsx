
"use client";

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

import { contactInfo } from '../config/data';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Projects', href: '/projects' },
        { name: 'Experience', href: '/about#experience' },
        { name: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Resume', href: '/resume.pdf' },
        { name: 'Tech Stack', href: '/about#tech-stack' },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-neutral-800 pt-12 pb-8" id="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerLinks.map((section, idx) => (
            <div key={section.title}>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-zinc-900 dark:text-neutral-200 font-semibold mb-4"
              >
                {section.title}
              </motion.h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (idx + linkIdx) * 0.1 }}
                  >
                    <a
                      href={link.href}
                      className="text-zinc-500 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors text-sm font-light"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-900 dark:text-neutral-200 font-semibold mb-4"
            >
              Stay Connected
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col space-y-4"
            >
              <p className="text-zinc-650 dark:text-neutral-400 text-sm font-light">Follow us on social media</p>
              <div className="flex space-x-4">
                <a
                  href={contactInfo.social_media.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-zinc-200 dark:border-transparent"
                >
                  <FaGithub className="w-6 h-6 text-zinc-700 dark:text-neutral-200" />
                </a>
                <a
                  href={contactInfo.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-zinc-200 dark:border-transparent"
                >
                  <FaLinkedin className="w-6 h-6 text-zinc-700 dark:text-neutral-200" />
                </a>
                <a
                  href={contactInfo.social_media.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-zinc-200 dark:border-transparent"
                >
                  <FaTwitter className="w-6 h-6 text-zinc-700 dark:text-neutral-200" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-zinc-200 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-zinc-500 dark:text-neutral-500 text-xs font-light">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-zinc-500 dark:text-neutral-500 text-xs font-light">
            Made with ❤️ by a passionate developer
          </p>
        </motion.div>
      </div>
    </footer>
  );

};

export default Footer;
