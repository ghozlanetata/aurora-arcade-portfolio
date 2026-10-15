import type {Metadata, Viewport} from "next";
import "./globals.css";
import { CrossPageTransitionProvider } from "@/components/transition/CrossPageTransition";

// System font fallbacks — Google Fonts is blocked in this environment.
// The CSS variables are consumed by every portfolio variant's stylesheet.
const fontVarsStyle=`:root{--font-geist-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;--font-geist-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace}`;

const siteUrl="https://ghozlanetata.vercel.app";

export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:{
    default:"Ghozlane Tata | Software Engineer & CKA",
    template:"%s · Ghozlane Tata",
  },
  description:"Ghozlane Tata is a Software Engineer and Certified Kubernetes Administrator working across Kubernetes, AWS, DevOps, networks, and cloud platforms.",
  keywords:["Ghozlane Tata","Software Engineer","CKA","Certified Kubernetes Administrator","Kubernetes","AWS","DevOps","Cloud Infrastructure","Huawei","Algiers","Algeria","Networks","CI/CD","GitOps"],
  authors:[{name:"Ghozlane Tata"}],
  creator:"Ghozlane Tata",
  openGraph:{
    type:"website",
    url:siteUrl,
    title:"Ghozlane Tata | Software Engineer & CKA",
    description:"Software Engineer and Certified Kubernetes Administrator — Kubernetes, AWS, DevOps, networks, and cloud platforms.",
    siteName:"Ghozlane Tata",
    images:[{url:"/profile.jpg",width:400,height:500,alt:"Ghozlane Tata"}],
  },
  twitter:{
    card:"summary_large_image",
    title:"Ghozlane Tata | Software Engineer & CKA",
    description:"Software Engineer and Certified Kubernetes Administrator — Kubernetes, AWS, DevOps, networks, and cloud platforms.",
    images:["/profile.jpg"],
  },
  robots:{index:true,follow:true},
};

export const viewport:Viewport={
  width:"device-width",
  initialScale:1,
  maximumScale:5,
  themeColor:[
    {media:"(prefers-color-scheme: dark)",color:"#111014"},
    {media:"(prefers-color-scheme: light)",color:"#f5f1ec"},
  ],
};

// Blocking script: reads saved theme from localStorage before first paint to prevent FOUC.
const themeScript=`(function(){try{var t=localStorage.getItem("portfolio-theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})()`;

const personJsonLd={
  "@context":"https://schema.org",
  "@type":"Person",
  name:"Ghozlane Tata",
  jobTitle:"Software Engineer",
  description:"Software Engineer and Certified Kubernetes Administrator working across Kubernetes, AWS, DevOps, networks, and cloud platforms.",
  email:"mailto:ghozlanetata@gmail.com",
  url:siteUrl,
  image:siteUrl+"/profile.jpg",
  address:{"@type":"PostalAddress",addressLocality:"Algiers",addressCountry:"Algeria"},
  sameAs:[
    "https://www.linkedin.com/in/ghozlane-tata-911811273/",
    "https://github.com/ghozlanetata",
  ],
  worksFor:{"@type":"Organization",name:"Huawei Technologies"},
  alumniOf:{"@type":"EducationalOrganization",name:"USTHB"},
  knowsAbout:["Kubernetes","AWS","DevOps","Cloud Infrastructure","Networking","CI/CD","GitOps"],
};

export default function RootLayout({children}:LayoutProps<"/">) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning>
    <head>
      <style dangerouslySetInnerHTML={{__html:fontVarsStyle}} />
      <script dangerouslySetInnerHTML={{__html:themeScript}} />
    </head>
    <body>
      <CrossPageTransitionProvider>
        {children}
      </CrossPageTransitionProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(personJsonLd)}} />
    </body>
  </html>;
}
