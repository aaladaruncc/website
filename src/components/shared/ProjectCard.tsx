'use client'
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-white/5 p-6 backdrop-blur-sm transition">
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10" />
      <Link
        href={project.link}
        target="_blank"
        className="absolute top-6 right-6 z-10 p-2 rounded-full border border-border bg-background/70 backdrop-blur-sm
          opacity-0 group-hover:opacity-100 transition-opacity hover:border-accent"
      >
        <ArrowUpRight className="w-4 h-4 text-accent" />
      </Link>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[280px] h-[200px] relative rounded-2xl overflow-hidden bg-black/20">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <h3 className="font-display text-xl">{project.title}</h3>
            <div className="flex gap-2 items-center text-sm text-muted mt-1">
              <span>{project.date}</span>
              <span>•</span>
              <span>{project.category}</span>
            </div>
          </div>
          <p className="text-muted">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tech.map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-xs border border-border text-muted bg-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
