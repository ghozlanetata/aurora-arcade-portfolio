import type {Profile} from "@/content/portfolio";

export function SiteFooter({profile}:{profile:Profile}) {
  return <footer className="site-footer"><div className="footer-inner">
    <p>{profile.name} &middot; {profile.title}</p>
    <p>&copy; 2026 {profile.name}</p>
  </div></footer>;
}
