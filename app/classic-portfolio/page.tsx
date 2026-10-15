import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { AcademicProjects } from "@/components/sections/academic-projects";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { CareerSections } from "@/components/sections/career-sections";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { SignatureMarquee } from "@/components/sections/signature-marquee";
import { portfolio, workplaces } from "@/content/portfolio";

export default function Home() {
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader profile={portfolio.profile} />
    <main id="main-content" className="page-shell">
      <Hero profile={portfolio.profile} />
      <About profile={portfolio.profile} />
      <Skills groups={portfolio.skills} />
      <Projects items={portfolio.projects} />
      <CareerSections workplaces={workplaces} experience={portfolio.experience} />
      <Certifications items={portfolio.certifications} education={portfolio.education} />
      <AcademicProjects items={portfolio.academicProjects} />
      <Contact profile={portfolio.profile} />
    </main>
    <SignatureMarquee profile={portfolio.profile} />
    <SiteFooter profile={portfolio.profile} />
  </>;
}
