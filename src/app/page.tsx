'use client'
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full space-y-8 py-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src="/aryan_headshot.jpeg" 
              alt="Aryan Aladar profile photo"
              width={120}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Aryan Aladar</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Student, Founder & Researcher at UNC Chapel Hill
            </p>
          </div>
        </div>

        {/* Bio Sections */}
        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>
            I'm a student at UNC from Cary, North Carolina, with a keen interest in technology and its practical applications. This passion led me to help establish a lab at UNC Charlotte, where I worked on developing Edukona—a software platform that uses artificial intelligence and machine learning to enhance educational experiences.
          </p>
          <p>
            My work doesn't stop at the lab. I'm also involved in developing strategies to extend the benefits of AI and automation to communities that have limited exposure to these technologies, especially within blue-collar sectors.
          </p>
          <p>
            When I'm not working on tech projects or community initiatives, I enjoy activities that keep me physically active and mentally refreshed. Playing spikeball and taking ice baths help me maintain balance between work and personal well-being.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}