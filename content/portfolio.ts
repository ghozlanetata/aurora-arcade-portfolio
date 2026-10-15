export type SocialLink = { label: string; href: string };
export type Profile = { name: string; title: string; location: string; summary: string; about: string[]; email: string; socialLinks: SocialLink[] };
export type ExperienceItem = { company: string; role: string; organization: string; period: string; location?: string; summary: string; groups: { heading: string; bullets: string[] }[] };
export type ProjectDiagramLane = { title: string; steps: string[]; details?: string[] };
export type ProjectItem = { name: string; category: string; subtitle: string; status?: string; overview: string; focus: string[]; diagramLabel: string; diagramLanes: ProjectDiagramLane[]; compactDiagram?: boolean; highlights: string[]; technologies: string[]; repositoryUrl?: string };
export type SkillGroup = { category: string; skills: string[] };
export type CertificationItem = { name: string; issuer: string; date: string; credentialUrl?: string };
export type EducationItem = { qualification: string; institution: string; period: string; detail?: string; featured?: boolean };
export type AcademicProjectItem = {
  title: string;
  context: string;
  period: string;
  summary: string;
  highlights: string[];
  technologies: string[];
};
export type WorkplaceItem = {
  company: string;
  selectorLabel: string;
  organization: string;
  role: string;
  dates: string;
  description: string;
  areas: string[];
  image: string;
  imagePosition: string;
};

export const workplaces: WorkplaceItem[] = [
  {
    company: "HUAWEI",
    selectorLabel: "Huawei",
    organization: "Huawei Technologies",
    role: "Software Engineer / Technical Delivery",
    dates: "Apr 2024 — Present",
    description: "Software engineering and technical delivery at Huawei Technologies, supporting Algeria National Digital Services Platform for the High Commission for Digitalization.",
    areas: ["Cloud platforms", "Kubernetes", "Networking", "Systems integration", "Technical delivery"],
    image: "/workplace-huawei.jpg",
    imagePosition: "50% 48%",
  },
  {
    company: "COCA-COLA",
    selectorLabel: "Coca-Cola",
    organization: "Coca-Cola",
    role: "Desk Side Support Engineer",
    dates: "Dec 2023 — Apr 2024",
    description: "Onsite enterprise IT support for user systems, devices, and network connectivity.",
    areas: ["Desk side support", "Windows systems", "Network troubleshooting", "Incident escalation"],
    image: "/workplace-cocacola.jpg",
    imagePosition: "50% 50%",
  },
  {
    company: "ERICSSON",
    selectorLabel: "Ericsson",
    organization: "Ericsson",
    role: "Engineering / Graduation Internship",
    dates: "Feb 2023 — Jun 2023",
    description: "Graduation internship focused on mobile-network KPI analysis and machine-learning-based fault detection.",
    areas: ["2G / 3G / 4G data", "KPI analysis", "Fault and anomaly detection", "Machine learning", "Monitoring & visualization"],
    image: "/workplace-ericsson.jpg",
    imagePosition: "50% 25%",
  },
  {
    company: "ALGERIA TELECOM",
    selectorLabel: "Algeria Telecom",
    organization: "Algeria Telecom",
    role: "Network / Systems Internship",
    dates: "Jun 2022 — Aug 2022",
    description: "Network and systems internship at Algeria Telecom.",
    areas: ["Network Infrastructure & Connectivity", "Systems Administration & IT Infrastructure", "Network Configuration & Troubleshooting", "Telecommunications Technologies"],
    image: "/workplace-algeria-telecom.jpg",
    imagePosition: "50% 50%",
  },
];

export const portfolio: {
  profile: Profile;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  academicProjects: AcademicProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  education: EducationItem[];
} = {
  profile: {
    name: "Ghozlane Tata",
    title: "Software Engineer | Certified Kubernetes Administrator",
    location: "Algiers, Algeria",
    summary: "I work across cloud infrastructure, networks, data centers, Kubernetes, and digital platforms. At Huawei, I contribute to the architecture and technical delivery of Algeria's National Digital Services Platform.",
    about: [
      "My background is in Networks and Telecommunications Engineering, which gave me a strong foundation in how systems communicate and work together. Since then, my work has expanded into software platforms, infrastructure, and technical delivery.",
      "At Huawei Technologies, I contribute to Algeria\u2019s National Digital Services Platform for the High Commission for Digitalization. My role brings together solution design, systems integration, Kubernetes-based deployments, and technical coordination from implementation through production rollout.",
      "I work across software teams, APIs, infrastructure, and public-sector stakeholders to turn technical solutions into reliable services that can be used at scale.",
    ],
    email: "mailto:ghozlanetata@gmail.com",
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ghozlane-tata-911811273/" },
      { label: "GitHub", href: "https://github.com/ghozlanetata" },
    ],
  },
  experience: [{
    company: "HUAWEI",
    role: "Software Engineer \u00b7 Cloud & DevOps",
    organization: "Huawei Technologies",
    period: "2024\u2013Present",
    location: "Algiers, Algeria",
    summary: "High Commission for Digitalization (HCN) — National Digital Services Platform supporting public-service digitalization across government institutions.",
    groups: [
      { heading: "Solution Architecture & Engineering", bullets: [
        "Led solution design and systems integration for Algeria\u2019s National Digital Services Platform, translating business requirements into technical solutions.",
        "Developed high-level and low-level design documentation (HLD/LLD), technical integration specifications, and deployment plans.",
        "Worked across Kubernetes-based deployments, REST APIs, React, Node.js, SQL databases, and enterprise system integrations.",
        "Led the deployment and integration of cloud-based solutions within the National Data Center, coordinating software, infrastructure, and integration teams alongside customer stakeholders.",
      ] },
      { heading: "Technical Delivery & Leadership", bullets: [
        "Managed technical go-live readiness, including deployment planning, system configuration, environment preparation, and production prerequisites.",
        "Coordinated production rollouts and service launches, participating in user acceptance testing (UAT), dry runs, and live production troubleshooting.",
        "Contributed to incident resolution, root-cause analysis, and post-deployment stabilization to support reliable service delivery.",
      ] },
    ],
  }, {
    company: "COCA-COLA",
    role: "Desk Side Support Engineer",
    organization: "Coca-Cola",
    period: "December 2023 \u2013 April 2024",
    location: "Algiers, Algeria",
    summary: "Provided onsite IT support in an enterprise environment, troubleshooting hardware, software, and network-related issues while supporting users and maintaining business continuity.",
    groups: [{ heading: "Responsibilities", bullets: [
      "Provided onsite IT support for users in an enterprise environment.",
      "Diagnosed and resolved hardware, software, and network-related issues.",
      "Supported Windows systems, user accounts, and basic network connectivity.",
      "Escalated incidents and collaborated with infrastructure teams when needed.",
      "Ensured business continuity through timely troubleshooting and support.",
    ] }],
  }, {
    company: "ERICSSON",
    role: "Engineering / Graduation Internship",
    organization: "Ericsson",
    period: "Feb 2023 — Jun 2023",
    summary: "Worked with 2G, 3G, and 4G network data to analyze KPIs and explore machine-learning-based fault and anomaly detection, including model evaluation and monitoring and visualization of network performance.",
    groups: [
      { heading: "Telecommunications Network Analysis", bullets: [
        "Analyzed 2G, 3G, and 4G mobile network performance data to identify KPI variations, detect abnormal behavior, and investigate potential network faults.",
        "Worked with network performance indicators, including signal quality, handover success, retainability, and throughput, to understand their relationship with network degradation and service quality.",
        "Examined network monitoring and visualization techniques to improve the interpretation of performance metrics and support fault investigation.",
      ] },
      { heading: "Fault Detection & Machine Learning", bullets: [
        "Explored machine-learning approaches for network fault detection and classification, evaluating model performance using telecom-specific KPIs and network data.",
        "Contributed to the development and evaluation of a data-driven Network Fault Intelligence approach aimed at identifying potential faults and their underlying causes.",
        "Applied knowledge of mobile network technologies and data analysis to explore opportunities for more proactive fault detection and improved network reliability.",
      ] },
    ],
  }, {
    company: "ALGERIA TELECOM",
    role: "Network / Systems Internship",
    organization: "Algeria Telecom",
    period: "Jun 2022 — Aug 2022",
    summary: "A network and systems internship at Algeria Telecom.",
    groups: [{ heading: "Documented areas", bullets: ["Network Infrastructure & Connectivity", "Systems Administration & IT Infrastructure", "Network Configuration & Troubleshooting", "Telecommunications Technologies"] }],
  }],
  projects: [
    {
      name: "CloudScale Logistics",
      category: "GitOps / Kubernetes",
      subtitle: "Manifest guardrails for a FastAPI logistics service",
      status: "Completed project",
      overview: "An end-to-end DevOps project for a FastAPI shipment API, integrating automated Kubernetes manifest validation, CI security checks, and Kustomize-based configuration management. Demonstrates GitOps-oriented delivery practices, workload security hardening, and reliability controls for Kubernetes deployments.",
      focus: ["GitOps-oriented delivery", "Manifest validation", "Kubernetes security"],
      diagramLabel: "MANIFEST GUARDRAILS AND DELIVERY FLOW",
      diagramLanes: [
        { title: "CI guardrails", steps: ["Developer change", "GitHub Actions", "Validation gates"], details: ["Python manifest validator", "Kube-score", "Trivy", "Gitleaks"] },
        { title: "Kubernetes configuration and workloads", steps: ["Validated manifests", "Kustomize base + overlay", "Kubernetes"], details: ["FastAPI · PostgreSQL", "Probes · HPA · NetworkPolicies", "Non-root · read-only root filesystem"] },
      ],
      highlights: ["Python manifest validation and guardrails", "FastAPI shipment API with an optional PostgreSQL readiness check", "Dockerized application", "GitHub Actions CI checks", "Kube-score, Trivy, and Gitleaks security validation", "Kustomize base and overlays", "Kubernetes probes, HPA, and NetworkPolicies", "Non-root containers with a read-only root filesystem"],
      technologies: ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "Kustomize", "GitHub Actions", "Kube-score", "Trivy", "Gitleaks"],
      repositoryUrl: "https://github.com/ghozlanetata/cloudscale-logistics-gitopsguardrail",
    },
    {
      name: "CI/CD & Python Automation",
      category: "CI/CD / Python",
      subtitle: "Three small practical automation projects",
      overview: "A three-part DevOps automation portfolio demonstrating GitHub Actions workflows, Docker-based builds, security scanning with Trivy, container image publishing to GHCR, and Kubernetes manifest validation with Kube-score. Includes a Flask application pipeline with a simulated deployment stage and automated checks for container security and Kubernetes configuration quality.",
      focus: ["GitHub Actions", "Python", "Container workflows"],
      diagramLabel: "THREE SEPARATE WORKFLOWS",
      diagramLanes: [
        { title: "Project 1 · Flask container", steps: ["Push", "GitHub Actions", "Basic validation", "Docker build", "Simulated deployment"] },
        { title: "Project 2 · Flask API image", steps: ["Push", "Trivy filesystem scan (non-blocking)", "Docker build", "GHCR push"] },
        { title: "Project 3 · Manifest scoring", steps: ["Kubernetes manifest change", "GitHub Actions", "Kube-score analysis"] },
      ],
      highlights: ["Three separate GitHub Actions workflows", "Basic print-only validation in Project 1", "Trivy scan is configured as non-blocking", "Kube-score analyzes Project 3 manifests", "Project 1 deployment step is simulated", "No automated tests or cluster deployment"],
      technologies: ["Python 3.11", "Flask", "GitHub Actions", "Docker", "Kubernetes YAML", "Trivy", "Kube-score", "GitHub Container Registry (GHCR)"],
      repositoryUrl: "https://github.com/ghozlanetata/CI-CD-Python-Automation-Portfolio",
    },
    {
      name: "Kubernetes Portfolio",
      category: "Kubernetes / Learning labs",
      subtitle: "Four hands-on exercises with Kubernetes resources",
      overview: "A hands-on Kubernetes portfolio featuring four progressively structured projects covering application deployment, RBAC-based access control, multi-tier architecture, and ingress-based traffic management. Demonstrates practical experience with Kubernetes manifests, service exposure, configuration management, health probes, autoscaling, and network security.",
      focus: ["Kubernetes", "YAML manifests", "NGINX"],
      diagramLabel: "FOUR KUBERNETES EXERCISES",
      compactDiagram: true,
      diagramLanes: [
        { title: "Basic NGINX Deployment", steps: ["ConfigMap + Secret", "2-replica Deployment", "NodePort Service"], details: ["Liveness and readiness probes"] },
        { title: "Namespace-scoped RBAC", steps: ["Namespace", "ServiceAccount", "Role → RoleBinding"], details: ["Read-only pod access"] },
        { title: "Two-tier NGINX", steps: ["NodePort frontend", "Frontend pods", "ClusterIP backend"], details: ["Backend pods · HPA · probes · NetworkPolicy"] },
        { title: "Ingress-based two-tier variant", steps: ["Ingress", "ClusterIP frontend", "Frontend → backend"], details: ["Backend pods · probes · NetworkPolicy"] },
      ],
      highlights: ["Deployments and Services", "ConfigMap and Secret", "Liveness and readiness probes", "ServiceAccount, Role, and RoleBinding", "Frontend HPA manifest", "NetworkPolicy", "Ingress"],
      technologies: ["Kubernetes", "YAML manifests", "NGINX"],
      repositoryUrl: "https://github.com/ghozlanetata/Kubernetes-portfolio",
    },
  ],
  academicProjects: [
    {
      title: "Real-Time Traffic Optimization via VANET & Ant Colony Optimization",
      context: "USTHB — Faculty of Electrical Engineering",
      period: "Jan. 2022 — Jun. 2022",
      summary: "Researched real-time urban traffic optimization using Vehicular Ad-hoc Networks (VANETs) and Ant Colony Optimization (ACO) for dynamic vehicle rerouting under high-congestion scenarios.",
      highlights: [
        "Simulated dynamic vehicle rerouting using SUMO and OMNeT++ under high-congestion urban traffic scenarios.",
        "Evaluated V2V (vehicle-to-vehicle) and V2R (vehicle-to-roadside) communication models for dynamic route optimization.",
        "Applied Ant Colony Optimization as a metaheuristic to find near-optimal rerouting paths in real time.",
      ],
      technologies: ["VANET", "Ant Colony Optimization", "SUMO", "OMNeT++", "V2V / V2R", "Simulation"],
    },
    {
      title: "Image Analysis in Biometry — Palmprint Recognition",
      context: "Bachelor's Final Year Project — Image Processing",
      period: "Jan. 2021 — Jul. 2021",
      summary: "Designed and implemented an end-to-end image-processing pipeline for biometric palmprint recognition, from preprocessing through feature extraction and matching.",
      highlights: [
        "Applied preprocessing, segmentation, and feature extraction techniques to palmprint images.",
        "Implemented Local Binary Patterns (LBP) as the core feature descriptor for palmprint texture analysis.",
        "Built and evaluated the full recognition pipeline using MATLAB.",
      ],
      technologies: ["Image Processing", "MATLAB", "Local Binary Patterns", "Biometrics", "Palmprint Recognition"],
    },
  ],
  skills: [
    { category: "Cloud & Platforms", skills: ["Kubernetes", "Docker", "AWS", "Terraform", "Cloud-native infrastructure", "National Data Center"] },
    { category: "DevOps & Technical Delivery", skills: ["GitLab", "Git", "CI/CD", "GitOps", "Ansible", "Solution Architecture", "HLD / LLD", "System Integration", "Deployment & Go-live", "Production Troubleshooting", "Root-Cause Analysis", "Cross-functional Technical Coordination"] },
    { category: "Networking & Systems", skills: ["TCP/IP", "Routing & Switching", "Firewalls", "VPN", "DNS", "Network troubleshooting", "Linux", "Windows systems"] },
    { category: "Development & APIs", skills: ["React", "Node.js", "Python", "JavaScript", "C++", "REST APIs", "SQL", "Flask", "YAML / JSON"] },
    { category: "AI & Machine Learning", skills: ["Machine Learning", "Neural Networks & Deep Learning", "Data Analysis & Preprocessing", "Model Evaluation", "Fault Detection"] },
  ],
  certifications: [
    { name: "Certified Kubernetes Administrator (CKA)", issuer: "Linux Foundation & CNCF", date: "August 2026", credentialUrl: "https://www.credly.com/badges/fd23df6b-aa32-4c02-bd1e-03a2401da6b5" },
    { name: "Huawei HCIA Datacom", issuer: "Huawei ICT Academy", date: "February 2021" },
    { name: "EF SET English Certificate \u2014 C1 Advanced", issuer: "EF SET", date: "February 2026" },
  ],
  education: [
    { qualification: "Master's Degree", institution: "USTHB", period: "2021\u20132023", detail: "Network & Telecommunications Engineering \u00b7 With Highest Honors", featured: true },
    { qualification: "Bachelor's Degree", institution: "USTHB", period: "2018\u20132021", detail: "Telecommunications \u00b7 With Highest Honors" },
    { qualification: "Baccalaureate", institution: "Mohamed Lebdjaoui", period: "2015\u20132018", detail: "Mathematics \u00b7 With Honors" },
  ],
};
