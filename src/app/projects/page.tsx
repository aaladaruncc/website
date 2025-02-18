'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { ProjectCard } from "@/components/shared/ProjectCard";

interface Project {
  title: string;
  date: string;
  category: string;
  description: string;
  tech: string[];
  link: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "Ocal AI: AI Calendar for Students",
    date: "2025", 
    category: "Product Development",
    description: "Ocal AI is a calendar app that uses AI to help students manage their time. It uses Anthropic and Supabase to power the AI and the calendar. Currently in beta. Working on contracting with universities to integrate with their existing student information systems.",
    tech: ["Next.js", "Anthropic", "Supabase", "PostgreSQL", "Vercel"],
    link: "https://ocal.ai",
    image: "/ocal.png"
  },
  {
    title: "Edukona: AI-Powered Education Platform",
    date: "2024",
    category: "Research & Development", 
    description: "Reserach paper published. Edukona: A Quiz System that allows instructors to create quizzes on the fly using AI. Using live transcription and AI, instructors can create quizzes in real time. ",
    tech: ["React", "Django", "PostgreSQL", "AWS Lambda", "CI/CD", "Docker", "AWS"],
    link: "https://edukona.com",
    image: "/edukona.png"
  },
  {
    title: "Workbooks: AI-Powered Flashcard and Annotation tool",
    date: "2024", 
    category: "Weekend Project",
    description: "Workbooks is a flashcard and annotation tool that uses AI to help students learn. It uses OpenAI and Vercel to power the AI and the flashcards. ",
    tech: ["Vite", "OpenAI", "Vercel", "Firebase"],
    link: "#",
    image: "/workbooks.png"
  },
];

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Projects & Publications
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            A collection of my recent work in AI, education technology, and research.
          </p>
        </header>

        <div className="grid gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}