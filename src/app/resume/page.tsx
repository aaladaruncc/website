'use client';
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import Tooltip from "@/components/shared/Tooltip";

interface Initiative {
  title: string;
  description: string;
}

interface Publication {
  title: string;
  subtitle: string;
  author: string;
}

interface Presentation {
  title: string;
  subtitle: string;
  description: string;
}

interface WorkEntry {
  company: string;
  period: string;
  description: string;
  initiatives: Initiative[];
  publications?: Publication[];
  presentations?: Presentation[];
}

const workEntries: WorkEntry[] = [
  {
    company: "Carolina Investment Group",
    period: "Sep. 2024 - Present",
    description:
      "Quantitative Trader at a student-run hedge fund with over 600k AUM, achieving 32% YTD returns.",
    initiatives: [
      {
        title: "Trading Signal Development",
        description:
          "Using Python to build trading signals and execute trades with strategies such as long/short equity and pairs trading using covariance. Utilizing Z-Score to manage positions."
      },
      {
        title: "Alpha Enhancement",
        description:
          "Expanding strategies by incorporating alternative data sources like Quiver Quant to further enhance alpha."
      },
      {
        title: "Risk Analysis",
        description:
          "Analyzed risk metrics such as Sharpe Ratio, Sortino Ratio, and Value at Risk (VaR) to optimize portfolio performance and reduce exposure to market volatility."
      }
    ]
  },
  {
    company: "Fidelity Investments",
    period: "June 2024 - August 2024",
    description:
      "Software Engineering Intern, AI/ML within the Asset Management Tech team, focused on enhancing compliance standards using Natural Language Processing.",
    initiatives: [
      {
        title: "NLP Model Development",
        description:
          "Trained and fine-tuned SpaCy models for Named Entity Recognition, text classification, and span classification to accurately flag compliance rules."
      },
      {
        title: "Rule Mapping Optimization",
        description:
          "Utilized SpaCy and DistilBERT to recognize and predict rule languages within a 6000-rule universe, improving rule mapping efficiency."
      },
      {
        title: "Search Result Optimization",
        description:
          "Developed a model to optimize search relevancy based on Investment Compliance rule attribute matches."
      },
      {
        title: "MLOps Pipeline Implementation",
        description:
          "Created and implemented an MLOps pipeline to streamline model deployment, training, and access."
      }
    ]
  },
  {
    company: "UNC Charlotte",
    period: "Sep. 2023 - May 2024",
    description:
      "Lead Researcher who contributed to a published research paper and developed a quiz application to enhance student retention.",
    initiatives: [
      {
        title: "Research Publication",
        description:
          "Research paper accepted and published in the Frontiers in Education Conference (FIE) 2024."
      },
      {
        title: "Quiz Application Development",
        description:
          "Built a quiz application integrating WebSockets for real-time connectivity, increasing system responsiveness by 34% and enabling interactive features."
      },
      {
        title: "Deployment Optimization",
        description:
          "Addressed AWS deployment challenges by configuring load balancers and reverse proxies, and streamlined CI/CD processes using GitHub Actions."
      }
    ]
  }
];


export default function ResumePage() {
  return (
    <MainLayout>
      {/* Container & Page Layout */}
      <div className="mx-auto max-w-3xl w-full space-y-12 text-foreground">
        {/* Page Header */}
        <header className="space-y-3 border-b border-foreground/10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Featured Works
          </h1>
          <p className="text-base sm:text-lg text-foreground/70">
            Publications, professional projects, and in the news.
          </p>
        </header>

        {/* Work Entries */}
        <div className="space-y-8">
          {workEntries.map((entry, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-foreground/10 pb-8 last:border-b-0"
            >
              {/* Company & Description */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {entry.company}
                  </h2>
                  <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
                <time className="text-sm sm:text-base text-foreground/50 whitespace-nowrap">
                  {entry.period}
                </time>
              </div>

              {/* Changed grid layout to be full width by default */}
              <div className="space-y-6">
                {/* Initiatives */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base sm:text-lg">
                      Initiatives
                    </h3>
                    <Tooltip content="Key projects and achievements">
                      <Info className="w-4 h-4 text-foreground/50 cursor-help" />
                    </Tooltip>
                  </div>
                  <ul className="space-y-4">
                    {entry.initiatives.map((initiative, i) => (
                      <li key={i} className="leading-relaxed">
                        <span className="block font-semibold text-base text-foreground mb-1">
                          {initiative.title}
                        </span>
                        <span className="text-sm sm:text-base text-foreground/70">
                          {initiative.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Publications or Presentations */}
                {(entry.publications || entry.presentations) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-base sm:text-lg">
                        {entry.publications
                          ? `Publications (${entry.publications.length})`
                          : `Presentations (${entry.presentations!.length})`}
                      </h3>
                      <Tooltip content="Research papers and conference talks">
                        <Info className="w-4 h-4 text-foreground/50 cursor-help" />
                      </Tooltip>
                    </div>
                    <ul className="space-y-3">
                      {entry.publications?.map((pub, i) => (
                        <li key={i} className="leading-relaxed">
                          <span className="block font-semibold text-base text-foreground">
                            {pub.title}
                          </span>
                          <span className="block italic text-sm sm:text-base text-foreground/70">
                            {pub.subtitle}
                          </span>
                          <span className="block text-sm sm:text-base text-foreground/70">
                            {pub.author}
                          </span>
                        </li>
                      ))}
                      {entry.presentations?.map((pres, i) => (
                        <li key={i} className="leading-relaxed">
                          <span className="block font-semibold text-base text-foreground">
                            {pres.title}
                          </span>
                          <span className="block italic text-sm sm:text-base text-foreground/70">
                            {pres.subtitle}
                          </span>
                          <span className="block text-sm sm:text-base text-foreground/70">
                            {pres.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

