// Project configuration and data

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

export interface TechStackItem {
  name: string;
  icon: string;
  category: string;
  proficiency?: number; // 1-5 scale
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
  achievements?: string[];
  impact_metrics?: string[];
}

export interface SkillMatrix {
  technical_skills: Array<{
    name: string;
    level: string; // Beginner, Intermediate, Advanced, Expert
    description: string;
  }>;
  soft_skills: Array<{
    name: string;
    description: string;
    examples: string[];
  }>;
}

export interface Leadership {
  collaborations: Array<{
    project: string;
    role: string;
    outcome: string;
    team_size: number;
  }>;
  mentorship: Array<{
    initiative: string;
    impact: string;
    duration: string;
  }>;
}

export interface Contact {
  email: string;
  location: string;
  timezone: string;
  social_media: {
    linkedin: string;
    github: string;
    twitter: string;
  };
  calendly: string;
  discord: string;
  response_time: string;
}

export const projects: Project[] = [
  {
    title: "Modern E-commerce Platform",
    description: "A full-stack e-commerce solution built with Next.js, TypeScript, and Tailwind CSS",
    image: "/projects/ecommerce.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
    link: "https://github.com/yourusername/ecommerce"
  },
  {
    title: "AI Chat Application",
    description: "Real-time chat application with AI integration using WebSocket",
    image: "/projects/chat.jpg",
    tags: ["React", "Node.js", "Socket.io", "OpenAI"],
    link: "https://github.com/yourusername/ai-chat"
  },
  {
    title: "Task Management System",
    description: "Collaborative task management platform with real-time updates",
    image: "/projects/tasks.jpg",
    tags: ["React", "Redux", "Express", "PostgreSQL"],
    link: "https://github.com/yourusername/task-manager"
  },
  {
    title: "Task Management System",
    description: "Collaborative task management platform with real-time updates",
    image: "/projects/tasks.jpg",
    tags: ["React", "Redux", "Express", "PostgreSQL"],
    link: "https://github.com/yourusername/task-manager"
  },
  {
    title: "Task Management System",
    description: "Collaborative task management platform with real-time updates",
    image: "/projects/tasks.jpg",
    tags: ["React", "Redux", "Express", "PostgreSQL"],
    link: "https://github.com/yourusername/task-manager"
  },
    {
    title: "Task Management System",
    description: "Collaborative task management platform with real-time updates",
    image: "/projects/tasks.jpg",
    tags: ["React", "Redux", "Express", "PostgreSQL"],
    link: "https://github.com/yourusername/task-manager"
  }
];

export const techStack: TechStackItem[] = [
  { name: 'React', icon: 'FaReact', category: 'Frontend' },
  { name: 'Next.js', icon: 'SiNextdotjs', category: 'Frontend' },
  { name: 'TypeScript', icon: 'SiTypescript', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss', category: 'Frontend' },
  { name: 'Node.js', icon: 'FaNodeJs', category: 'Backend' },
  { name: 'MongoDB', icon: 'SiMongodb', category: 'Backend' },
  { name: 'PostgreSQL', icon: 'SiPostgresql', category: 'Backend' },
  { name: 'Redis', icon: 'SiRedis', category: 'Backend' },
  { name: 'Git', icon: 'FaGitAlt', category: 'Tools' },
  { name: 'Docker', icon: 'FaDocker', category: 'Tools' },
  { name: 'Vercel', icon: 'SiVercel', category: 'Tools' }
];

export const experiences: Experience[] = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    period: "2022 - Present",
    description: [
      "Led the development of a large-scale e-commerce platform using Next.js and TypeScript",
      "Implemented responsive design patterns and optimized performance metrics",
      "Mentored junior developers and conducted code reviews"
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux"]
  },
  {
    title: "Full Stack Developer",
    company: "Digital Innovations Ltd",
    period: "2020 - 2022",
    description: [
      "Developed and maintained multiple client-facing web applications",
      "Implemented RESTful APIs and integrated third-party services",
      "Optimized database queries and improved application performance"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    title: "Web Developer",
    company: "Creative Agency",
    period: "2018 - 2020",
    description: [
      "Built responsive websites for various clients using modern web technologies",
      "Collaborated with designers to implement pixel-perfect UI components",
      "Managed project timelines and client communications"
    ],
    technologies: ["JavaScript", "HTML5", "CSS3", "WordPress"]
  }
];

export const skillMatrix: SkillMatrix = {
  technical_skills: [
    {
      name: "Frontend Development",
      level: "Expert",
      description: "Specialized in React and Next.js ecosystem"
    },
    {
      name: "Backend Development",
      level: "Advanced",
      description: "Node.js and API development"
    }
  ],
  soft_skills: [
    {
      name: "Team Leadership",
      description: "Leading development teams and projects",
      examples: ["Led a team of 5 developers", "Improved team velocity by 40%"]
    }
  ]
};

export const leadershipInfo: Leadership = {
  collaborations: [
    {
      project: "E-commerce Platform Redesign",
      role: "Tech Lead",
      outcome: "Increased conversion rate by 25%",
      team_size: 5
    }
  ],
  mentorship: [
    {
      initiative: "Junior Developer Mentorship Program",
      impact: "Mentored 3 junior developers to intermediate level",
      duration: "6 months"
    }
  ]
};

export const contactInfo: Contact = {
  email: "your.email@example.com",
  location: "San Francisco, CA",
  timezone: "PST (UTC-8)",
  social_media: {
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourhandle"
  },
  calendly: "https://calendly.com/yourname",
  discord: "username#1234",
  response_time: "Within 24 hours"
};