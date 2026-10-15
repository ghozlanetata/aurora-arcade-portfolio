import type { Profile } from "@/content/portfolio";

function Message({ profile, duplicate = false }: { profile: Profile; duplicate?: boolean }) {
  const linkedin = profile.socialLinks.find((link) => link.label === "LinkedIn");

  return <div className="signature-marquee-copy" aria-hidden={duplicate || undefined}>
    <span className="signature-marquee-lead">BREAKING NEWS <span aria-hidden="true">✦</span></span>
    <span>You made it all the way here!</span>
    <span className="signature-marquee-link">
      {linkedin
        ? <a href={linkedin.href} target="_blank" rel="noreferrer" tabIndex={duplicate ? -1 : undefined}>Let’s connect on LinkedIn</a>
        : "Let’s connect on LinkedIn"}
      <span aria-hidden="true"> →</span>
    </span>
    <span>Thanks for visiting my portfolio.</span>
    <span>No cookies charged here… just a piece of chocolate</span>
    <span className="signature-marquee-bye">BYEEE</span>
  </div>;
}

export function SignatureMarquee({ profile }: { profile: Profile }) {
  return <section className="signature-marquee" aria-label="A note for reaching the end of the portfolio">
    <div className="signature-marquee-viewport">
      <div className="signature-marquee-track">
        <Message profile={profile} />
        <Message profile={profile} duplicate />
      </div>
    </div>
  </section>;
}
