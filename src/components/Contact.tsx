"use client";

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdDownload, MdEmail } from 'react-icons/md';

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: <FaLinkedin className="text-2xl" />,
    url: 'https://linkedin.com/in/yourusername',
    color: 'hover:bg-[#0077B5]'
  },
  {
    name: 'GitHub',
    icon: <FaGithub className="text-2xl" />,
    url: 'https://github.com/yourusername',
    color: 'hover:bg-[#333]'
  },
  {
    name: 'Twitter',
    icon: <FaTwitter className="text-2xl" />,
    url: 'https://twitter.com/yourusername',
    color: 'hover:bg-[#1DA1F2]'
  }
];

const Contact = () => {
  return (
    <section id="contact" className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-neutral-200 mb-12 text-center"
        >
          Let&apos;s Connect
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Social Links & CV */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-neutral-200 mb-6">Connect With Me</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl bg-neutral-800/50 text-neutral-200 ${social.color} transition-all hover:scale-105 hover:shadow-lg hover:text-white`}
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-neutral-200 mb-6">Download CV</h3>
              <a
                href="/path-to-your-cv.pdf"
                className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all hover:scale-105 hover:shadow-lg w-fit"
              >
                <MdDownload className="text-2xl group-hover:animate-bounce" />
                <span>Download Resume</span>
              </a>
              <p className="text-neutral-400 mt-4 text-sm">
                Last updated: January 2024
              </p>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-semibold text-neutral-200 mb-6">Send a Message</h3>
            <div className="flex items-center gap-3 text-neutral-400 mb-6">
              <MdEmail className="text-xl" />
              <a href="mailto:your.email@example.com" className="hover:text-blue-400 transition-colors">
                your.email@example.com
              </a>
            </div>
            <p className="text-neutral-400 mb-8">
              Expected response time: 24-48 hours
            </p>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-neutral-200 block">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-blue-500 focus:outline-none text-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-neutral-200 block">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-blue-500 focus:outline-none text-neutral-200"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-neutral-200 block">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 focus:border-blue-500 focus:outline-none text-neutral-200 resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;