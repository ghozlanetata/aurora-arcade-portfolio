import type { Profile } from "@/content/portfolio";
import { ChapterNav } from "@/components/layout/chapter-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CreativeViewButton } from "@/components/sections/creative-view-button";

export function SiteHeader({ profile }: { profile: Profile }) {
  return <header className="site-header">
    <div className="header-inner">
      <CreativeViewButton />
      <div className="header-controls">
        <ChapterNav />
        <ThemeToggle />
      </div>
    </div>
  </header>;
}
