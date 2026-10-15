import type { Metadata } from "next";
import "./aurora-arcade.css";
import AuroraArcadeScreen from "@/components/aurora-arcade/AuroraArcadeScreen";

export const metadata: Metadata = {
  title: "Aurora Arcade · Ghozlane Tata",
  description:
    "Ghozlane Tata — Software Engineer & CKA. A retro arcade cabinet behind frosted glass under the aurora: 8-bit game selection with glassmorphic panels, a career progression chart, and organized category sections.",
  openGraph: {
    title: "Aurora Arcade · Ghozlane Tata",
    description:
      "Career as an arcade behind frosted glass — glassmorphism aurora meets retro 8-bit game selection for Ghozlane Tata, Software Engineer & CKA.",
    type: "website",
  },
};

const auroraArcadeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ghozlane Tata",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer and Certified Kubernetes Administrator. Aurora Arcade portfolio — retro 8-bit game selection behind frosted glass under the aurora borealis, with a career progression chart and organized category sections.",
  email: "mailto:ghozlanetata@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Algiers",
    addressCountry: "Algeria",
  },
  sameAs: [
    "https://www.linkedin.com/in/ghozlane-tata-911811273/",
    "https://github.com/ghozlanetata",
  ],
  worksFor: { "@type": "Organization", name: "Huawei Technologies" },
  alumniOf: { "@type": "EducationalOrganization", name: "USTHB" },
  knowsAbout: [
    "Kubernetes",
    "DevOps",
    "Cloud Infrastructure",
    "Networking",
    "CI/CD",
    "Automation",
    "Glassmorphism Design",
  ],
};

export default function AuroraArcadePage() {
  return (
    <>
      <a className="skip-link" href="#arcade-main">Skip to content</a>
      <main id="arcade-main" tabIndex={-1}>
        <AuroraArcadeScreen transitionMode="profile" />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auroraArcadeJsonLd) }}
      />
    </>
  );
}
