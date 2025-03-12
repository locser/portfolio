import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "Portfolio - Next.js Developer",
  description: "Professional portfolio showcasing Next.js development expertise, projects, and technical insights",
  keywords: ["Next.js", "React", "TypeScript", "Web Development", "Portfolio"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-portfolio.com",
    title: "Portfolio - Next.js Developer",
    description: "Professional portfolio showcasing Next.js development expertise",
    siteName: "Developer Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Next.js Developer",
    description: "Professional portfolio showcasing Next.js development expertise",
    creator: "@yourtwitterhandle"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://your-portfolio.com',
    languages: {
      'en': 'https://your-portfolio.com/en',
      'fr': 'https://your-portfolio.com/fr'
    }
  }
};