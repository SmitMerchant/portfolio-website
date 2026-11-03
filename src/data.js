export const PROFILE = {
  name: 'Smit Merchant',
  role: 'AI Full-Stack Developer',
  location: 'Sheffield, UK',
  email: 'smit.merchant@gmail.com',
  github: 'https://github.com/SmitMerchant',
  linkedin: 'https://www.linkedin.com/in/smit-merchant-98340214b',
  cv: '/Smit_Merchant_Resume.pdf',
  oneLiner:
    'I design, build and ship AI-powered products end to end — from data pipelines and models to the polished interfaces people actually use.',
}

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const ABOUT = {
  intro:
    "I'm an AI Full-Stack Developer based in Sheffield, UK. I hold a Masters in Artificial Intelligence and a Bachelors in Computer Engineering, and I love turning research-grade AI into production software that ships.",
  body: 'My work spans the entire stack: training and evaluating deep-learning models, designing FastAPI and Next.js backends, and crafting cinematic, recruiter-ready frontends. Recently I built a five-phase AI sales-intelligence pipeline that automates prospect discovery, lead scoring and personalised outreach at scale. Outside of work I build and ship side projects and stay on top of the latest AI developments.',
  highlights: [
    { value: 'MSc', label: 'Artificial Intelligence' },
    { value: '89.4%', label: 'Dissertation accuracy' },
    { value: '5-phase', label: 'AI pipeline shipped' },
    { value: 'Full-stack', label: 'Model → interface' },
  ],
}

export const EDUCATION = [
  {
    degree: 'Masters in Artificial Intelligence',
    school: 'Sheffield Hallam University',
    date: 'Graduated January 2025',
  },
  {
    degree: 'Bachelors in Computer Engineering',
    school: 'University of Mumbai',
    date: 'Graduated July 2023',
  },
]

export const EXPERIENCE = [
  {
    role: 'AI Full-Stack Developer',
    company: 'Adtecher',
    location: 'Sheffield, UK',
    date: 'April 2026 — Present',
    points: [
      'Built and shipped a five-phase AI-powered sales intelligence pipeline that automates prospect discovery, lead scoring, and personalised outreach generation at scale.',
      'Worked across the full stack — Python and FastAPI backend through to a Next.js frontend dashboard with real-time pipeline monitoring.',
      'Responsible for ongoing bug fixing and maintaining system stability.',
    ],
    tech: ['Python', 'FastAPI', 'Selenium', 'AWS Bedrock', 'Anthropic Claude', 'Next.js', 'React', 'Tailwind', 'GSAP', 'Three.js'],
  },
]

export const PROJECTS = [
  {
    title: 'LeadGen Pro',
    blurb:
      'A SaaS lead-generation tool for freelance developers and web agencies. Search a city and industry, find local businesses with no website, instantly generate an AI website prototype, send a personalised cold email with the prototype, and track every lead through a CRM-style pipeline. Also includes an SEO audit feature for underperforming sites.',
    tech: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Prisma', 'Firebase Auth', 'Google Gemini', 'Google Places API', 'Tailwind', 'Vercel'],
    live: 'https://leadgen-saas-zeta.vercel.app/login',
    github: null,
    featured: true,
  },
  {
    title: 'Smart Search for Research Expert Connections',
    blurb:
      'QA and AI Tester for an AI-driven platform connecting 100+ researchers across Sheffield Hallam University. Investigated PCA and alternative AI techniques to improve researcher clustering and matchmaking accuracy, and collaborated with developers on NLP-based researcher profiling.',
    tech: ['AI Search', 'NLP', 'PCA', 'React'],
    live: null,
    github: 'https://github.com/SmitMerchant/GODL1KE',
    featured: true,
  },
  {
    title: 'Food Transparency',
    blurb:
      'A web app that analyses food products and scores them 0–100 based on nutritional value and ingredient composition. Integrates the DeepSeek API to break down complex ingredients into simple, actionable health insights.',
    tech: ['DeepSeek API', 'React', 'Next.js'],
    live: null,
    github: null,
    featured: false,
  },
  {
    title: 'ReflectoChain',
    blurb:
      'An AI thought-tracking app where users log thoughts every 6 hours to build a structured chain. AI generates weekly summaries without altering original entries, plus a therapist dashboard for aggregated insights and pattern recognition.',
    tech: ['AI', 'React', 'Next.js'],
    live: null,
    github: null,
    featured: false,
  },
  {
    title: 'Dissertation — Action Recognition for Surveillance',
    blurb:
      'A deep-learning model using ResNet-34 and a 3D CNN to detect and classify human activities in real-time surveillance footage. Achieved 89.4% accuracy, 88.7% precision and 31 FPS real-time performance, while exploring federated learning and privacy-preserving AI.',
    tech: ['Python', 'PyTorch', 'ResNet-34', '3D CNN', 'Computer Vision'],
    live: null,
    github: null,
    featured: true,
  },
]

export const SKILLS = [
  {
    group: 'AI & Machine Learning',
    items: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'OpenCV', 'NLP', 'Computer Vision'],
  },
  {
    group: 'Backend & Data',
    items: ['FastAPI', 'REST API Development', 'Docker', 'SQL', 'PostgreSQL', 'Prisma', 'Firebase'],
  },
  {
    group: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Three.js'],
  },
  {
    group: 'Cloud & AI Platforms',
    items: ['AWS Bedrock', 'Google Cloud', 'Anthropic Claude', 'Google Gemini', 'DeepSeek', 'GitHub Actions'],
  },
]

export const CHATBOT_SYSTEM_PROMPT = `You are a portfolio assistant for Smit Merchant, an AI Full-Stack Developer based in Sheffield UK. Answer questions from employers and recruiters professionally and helpfully. You know everything about Smit including his projects, skills, experience, education, and background as listed in this portfolio. Keep answers concise, friendly, and professional. If asked about hobbies, Smit enjoys building and shipping side projects and staying on top of the latest AI developments.

Key facts:
- Role: AI Full-Stack Developer, based in Sheffield, UK. Email: smit.merchant@gmail.com.
- Education: Masters in Artificial Intelligence, Sheffield Hallam University (Jan 2025). Bachelors in Computer Engineering, University of Mumbai (July 2023).
- Current role: AI Full-Stack Developer at Adtecher (April 2026 to present, Sheffield UK). Built a five-phase AI-powered sales intelligence pipeline automating prospect discovery, lead scoring and personalised outreach at scale, working full stack across a Python/FastAPI backend and a Next.js dashboard with real-time monitoring; also responsible for bug fixing and system stability. Tech: Python, FastAPI, Selenium, AWS Bedrock, Anthropic Claude, Next.js, React, Tailwind, GSAP, Three.js.
- Projects: LeadGen Pro (SaaS lead generation with AI website prototypes and CRM pipeline; Next.js 14, TypeScript, PostgreSQL, Prisma, Firebase Auth, Google Gemini, Google Places API); Smart Search for Research Expert Connections (QA/AI tester, NLP and PCA for researcher matchmaking at Sheffield Hallam); Food Transparency (food scoring 0-100 with DeepSeek API); ReflectoChain (AI thought-tracking with weekly summaries and therapist dashboard); Dissertation on Action Recognition for Surveillance (ResNet-34 + 3D CNN, 89.4% accuracy, 31 FPS).
- Skills: Python, PyTorch, TensorFlow, scikit-learn, FastAPI, Docker, REST APIs, SQL, PostgreSQL, NumPy, OpenCV, NLP, Computer Vision, Next.js, React, TypeScript, Tailwind CSS, Firebase, Prisma, AWS Bedrock, Google Cloud, Anthropic Claude, Google Gemini, DeepSeek, GSAP, Three.js, GitHub Actions.`
