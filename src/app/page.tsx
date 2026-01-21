'use client'
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
const builtLinks = [
  {
    label: "Ocal AI",
    description: "AI calendar for students.",
    href: "https://ocal.ai",
    past: true,
  },
  {
    label: "Edukona",
    description: "Research-backed quiz generation platform.",
    href: "https://edukona.com",
    past: true,
  },
  {
    label: "Workbooks",
    description: "Flashcards and annotation tool.",
    href: "#",
    past: true,
  },
];

const experiences = [
  {
    company: "Carolina Investment Group",
    role: "Quantitative Trader",
    period: "Sep 2024 - Present",
    summary:
      "Student-run hedge fund trader focused on systematic strategies and alternative data.",
    highlights: [
      "Built long/short and pairs strategies using covariance and z-score signals.",
      "Expanded alpha using Quiver Quant and custom factor research.",
      "Optimized portfolio risk with Sharpe, Sortino, and VaR analysis.",
    ],
  },
  {
    company: "Fidelity Investments",
    role: "Software Engineering Intern, AI/ML",
    period: "Jun 2024 - Aug 2024",
    summary:
      "Improved compliance workflows using NLP for asset management and rule mapping.",
    highlights: [
      "Fine-tuned SpaCy and DistilBERT for NER and span classification.",
      "Mapped rule language across 6,000 compliance rules.",
      "Built an MLOps pipeline for model deployment and retraining.",
    ],
  },
  {
    company: "UNC Charlotte",
    role: "Lead Researcher",
    period: "Sep 2023 - May 2024",
    summary:
      "Published research and shipped a quiz platform with real-time collaboration.",
    highlights: [
      "Published at Frontiers in Education (FIE) 2024.",
      "Built WebSocket-driven quiz sessions and boosted responsiveness by 34%.",
      "Streamlined AWS deployment and CI/CD for lab tooling.",
    ],
  },
];

const focusAreas = [
  {
    title: "Human-centered AI",
    description:
      "Building AI tools that feel personal, focused, and genuinely helpful to students.",
  },
  {
    title: "Research to product",
    description:
      "Translating lab ideas into prototypes that can ship in the real world.",
  },
  {
    title: "Community impact",
    description:
      "Bringing automation and AI knowledge to communities that are often left out.",
  },
];

export default function Home() {
  return (
    <MainLayout>
      <section className="grid gap-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-xl" />
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20">
                <Image
                  src="/aryan_headshot.jpeg"
                  alt="Aryan Aladar profile photo"
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-muted">
                Student • Founder • Researcher
              </p>
              <h1 className="font-display text-4xl sm:text-6xl">
                Aryan Aladar
              </h1>
              <p className="text-lg sm:text-xl text-muted max-w-xl">
                I build AI-powered learning tools and research-backed products
                that make education feel effortless.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full border border-border px-5 py-2 text-sm text-foreground hover:border-accent hover:text-foreground transition"
              href="mailto:aryan.aladar@gmail.com"
            >
              Email
            </a>
            <a
              className="rounded-full border border-border px-5 py-2 text-sm text-muted hover:border-accent-2 hover:text-foreground transition"
              href="https://linkedin.com/in/aladar"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="rounded-full border border-border px-5 py-2 text-sm text-muted hover:border-accent hover:text-foreground transition"
              href="https://github.com/aaladaruncc"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-3"
        >
          {focusAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-3xl border border-border bg-white/5 p-6 backdrop-blur-sm"
            >
              <h2 className="font-display text-lg">{area.title}</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-white/5 px-6 py-8 backdrop-blur-sm"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            Here is what I am building
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              className="font-display text-2xl sm:text-3xl hover:text-accent transition"
              href="https://useswarm.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              useswarm.co
            </a>
            <span className="text-sm text-muted">
              Platform for focused, high-signal collaboration.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-muted">
              Here is what I built
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">
              Recent launches and experiments
            </h2>
          </div>
          <div className="grid gap-4">
            {builtLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/5 px-5 py-4 backdrop-blur-sm transition hover:border-accent"
              >
                <div>
                  <p className="font-display text-lg transition group-hover:text-accent">
                    {link.label}
                    {link.past ? " *" : ""}
                  </p>
                  <p className="text-sm text-muted">{link.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted">
                  View
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted">
            * Past projects (some may be taken down).
          </p>
        </motion.div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            Experience
          </p>
          <h2 className="font-display text-3xl sm:text-4xl">
            Where I have built and shipped
          </h2>
        </div>
        <div className="grid gap-6">
          {experiences.map((experience, index) => (
            <motion.article
              key={experience.company}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="rounded-3xl border border-border bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl">
                    {experience.company}
                  </h3>
                  <p className="text-sm text-muted">{experience.role}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted">
                  {experience.period}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {experience.summary}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                {experience.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
