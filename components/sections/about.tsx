import type { Profile } from "@/content/portfolio";

const disciplines = ["Cloud infrastructure", "Network architecture", "Digital platforms", "Technical delivery"];

export function About({ profile }: { profile: Profile }) {
  return <section className="content-section about-section" id="about" aria-labelledby="about-title">
    <div className="chapter-kicker"><span>01</span><span>Engineering / The through line</span></div>
    <div className="about-composition">
      <div className="about-lead">
        <p className="eyebrow">WHO I AM</p>
        <h2 id="about-title">Systems that connect<br />people, platforms<br /><em>&amp; infrastructure.</em></h2>
      </div>
      <div className="about-story">
        {profile.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="discipline-index" aria-label="Engineering disciplines">
          {disciplines.map((discipline, index) => <span key={discipline}><b>0{index + 1}</b>{discipline}</span>)}
        </div>
      </div>
    </div>
    <div className="career-thread" aria-label="Career progression">
      <span>Networks &amp; Telecommunications</span><i aria-hidden="true">→</i><span>Huawei Technologies</span><i aria-hidden="true">→</i><span>Cloud &amp; Data Centers</span><i aria-hidden="true">→</i><span>National Digital Services</span>
    </div>
  </section>;
}
