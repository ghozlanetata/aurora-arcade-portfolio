import type { Profile } from "@/content/portfolio";

export function Contact({ profile }: { profile: Profile }) {
  return <section className="content-section contact-section" id="contact" aria-labelledby="contact-title">
    <div className="chapter-kicker"><span>07</span><span>Contact / Algiers, Algeria</span></div>
    <div className="contact-composition">
      <div><p className="eyebrow">THE NEXT SYSTEM STARTS WITH A CONVERSATION</p><h2 id="contact-title">Let’s build<br /><em>what’s next.</em></h2></div>
      <div className="contact-copy">
        <p>For conversations about cloud infrastructure, digital platforms, systems integration, and technical delivery.</p>
        <a className="contact-email" href={profile.email}>ghozlanetata@gmail.com <span aria-hidden="true">↗</span></a>
        <div className="contact-socials">{profile.socialLinks.map((link) => <a className="text-link" key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a>)}</div>
      </div>
    </div>
  </section>;
}
