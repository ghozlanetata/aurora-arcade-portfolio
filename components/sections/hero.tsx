import type {Profile} from "@/content/portfolio";
import Image from "next/image";

export function Hero({profile}:{profile:Profile}) {
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-content">
    <p className="eyebrow">Networks <span>·</span> Cloud <span>·</span> Infrastructure</p>
    <h1 id="hero-title" aria-label="Software Engineer | Certified Kubernetes Administrator"><span className="hero-title-primary">Software Engineer</span><span className="hero-title-secondary"><span className="hero-title-divider">|</span>{" "}Certified Kubernetes Administrator</span></h1>
    <p className="hero-positioning">Kubernetes <span>·</span> AWS <span>·</span> DevOps <span>·</span> Cloud Platforms</p>
    <p className="hero-name">{profile.name} <span>— {profile.location}</span></p>
    <p className="hero-summary">{profile.summary}</p>
    <div className="hero-actions">
      <span className="cv-tooltip-wrap">
        <button className="button button-primary" type="button" aria-label="CV available on request" aria-describedby="classic-cv-availability">View CV</button>
        <span className="cv-tooltip" id="classic-cv-availability" role="tooltip">CV available on request — contact me to get it</span>
      </span>
      {profile.socialLinks.map(x=><a className="text-link" key={x.label} href={x.href} target="_blank" rel="noreferrer">{x.label}<span className="sr-only"> (opens in a new tab)</span></a>)}
    </div>
    <p className="hero-location"><span className="status-dot" />Working across cloud platforms and national digital services</p>
    </div>
    <div className="hero-portrait-wrap" aria-label="Portrait of Ghozlane Tata">
      <div className="portrait-index">ENGINEER / ALGIERS <span>01—06</span></div>
      <div className="hero-portrait">
        <Image src="/profile.jpg" alt="Ghozlane Tata" fill priority sizes="(max-width: 720px) 68vw, (max-width: 1100px) 34vw, 380px" />
      </div>
      <span className="portrait-caption">GHOZLANE TATA <span>NETWORKS · CLOUD · DELIVERY</span></span>
    </div>
  </section>;
}
