"use client";

import { useState } from "react";
import type { ExperienceItem, WorkplaceItem } from "@/content/portfolio";
import { Experience } from "@/components/sections/experience";
import { Workplaces } from "@/components/sections/workplaces";

export function CareerSections({ workplaces, experience }: { workplaces: WorkplaceItem[]; experience: ExperienceItem[] }) {
  const [activeCompany, setActiveCompany] = useState(workplaces[0]?.company ?? "");

  return <>
    <Workplaces items={workplaces} activeCompany={activeCompany} onSelect={setActiveCompany} />
    <Experience items={experience} activeCompany={activeCompany} />
  </>;
}
