'use client'
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto w-full space-y-8 pt-2">
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-full overflow-hidden"
          >
            <Image
              src="/aryan_headshot.jpeg" 
              alt="Aryan Aladar profile photo"
              width={120}
              height={120}
              className="object-cover w-full h-full"
            />
          </motion.div>
          <div className="space-y-2">
            <div className="h-[40px]">
              <TypeAnimation
                sequence={[
                  'Hi, I am Aryan Aladar',
                  1000,
                ]}
                wrapper="h1"
                className="font-display text-4xl font-medium tracking-tight"
                cursor={false}
                speed={50}
              />
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-lg text-muted"
            >
              Student, Founder & Researcher at UNC Chapel Hill
            </motion.p>
          </div>
        </div>

        {/* Bio Sections */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="space-y-4 text-muted leading-relaxed"
        >
          <p>
            I'm a student at UNC from Cary, North Carolina, with a keen interest in technology and its practical applications. This passion led me to help establish a lab at UNC Charlotte, where I worked on developing Edukona—a software platform that uses artificial intelligence and machine learning to enhance educational experiences.
          </p>
          <p>
            My work doesn't stop at the lab. I'm also involved in developing strategies to extend the benefits of AI and automation to communities that have limited exposure to these technologies, especially within blue-collar sectors.
          </p>
          <p>
            When I'm not working on tech projects or community initiatives, I enjoy activities that keep me physically active and mentally refreshed. Playing spikeball and taking ice baths help me maintain balance between work and personal well-being.
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}