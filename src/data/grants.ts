export interface Grant {
  id: string
  title: string
  provider: string
  amount: string
  amountMin: number
  amountMax: number
  deadline: string
  eligibility: string[]
  category: string
  status: 'open' | 'closing-soon' | 'closed'
  description: string
  location: string
  applicationUrl: string
  requirements: string[]
  applicationProcess: string
  sourceUrl: string
  tags: string[]
  sector: string[]
  stage: string[]
  fundingType: 'grant' | 'loan' | 'equity' | 'hybrid'
}

export const INDIAN_GRANTS: Grant[] = [
  {
    id: 'startup-india-seed-fund',
    title: 'Startup India Seed Funding Scheme (SISFS)',
    provider: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    amount: 'Up to ₹20 Lakhs',
    amountMin: 500000,
    amountMax: 2000000,
    deadline: '2024-12-31',
    eligibility: [
      'DPIIT recognized startup',
      'Incorporated less than 2 years ago',
      'Technology-based business model',
      'Scalable business with high employment potential'
    ],
    category: 'Government',
    status: 'open',
    description: 'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.',
    location: 'Pan India',
    applicationUrl: 'https://www.startupindia.gov.in/content/sih/en/sisfs.html',
    requirements: [
      'DPIIT recognition certificate',
      'Business plan and financial projections',
      'Prototype or proof of concept',
      'Team details and experience',
      'Market analysis and competitive landscape'
    ],
    applicationProcess: 'Step 1: Apply through Startup India portal\nStep 2: Initial screening by incubators\nStep 3: Due diligence and evaluation\nStep 4: Final approval and fund disbursement',
    sourceUrl: 'https://www.startupindia.gov.in',
    tags: ['seed-funding', 'early-stage', 'technology'],
    sector: ['Technology', 'Healthcare', 'Fintech', 'Agtech', 'Edtech'],
    stage: ['Idea', 'Prototype', 'MVP'],
    fundingType: 'grant'
  },
  {
    id: 'atal-innovation-mission',
    title: 'Atal Innovation Mission (AIM) - Startup Support',
    provider: 'NITI Aayog',
    amount: 'Up to ₹50 Lakhs',
    amountMin: 1000000,
    amountMax: 5000000,
    deadline: '2024-11-30',
    eligibility: [
      'Technology-based startup',
      'Innovative solution addressing societal challenges',
      'Scalable business model',
      'Strong founding team'
    ],
    category: 'Government',
    status: 'open',
    description: 'Supports innovative startups working on cutting-edge technologies and solutions that can create significant social and economic impact.',
    location: 'Pan India',
    applicationUrl: 'https://aim.gov.in/',
    requirements: [
      'Detailed project proposal',
      'Technology demonstration',
      'Market validation proof',
      'Financial projections for 3 years',
      'IP strategy and protection plan'
    ],
    applicationProcess: 'Step 1: Online application submission\nStep 2: Technical evaluation by experts\nStep 3: Presentation to evaluation committee\nStep 4: Final selection and funding',
    sourceUrl: 'https://aim.gov.in',
    tags: ['innovation', 'technology', 'social-impact'],
    sector: ['Deep Tech', 'AI/ML', 'IoT', 'Robotics', 'Biotech'],
    stage: ['Prototype', 'MVP', 'Early Revenue'],
    fundingType: 'grant'
  },
  {
    id: 'msme-technology-upgradation',
    title: 'MSME Technology Upgradation Scheme',
    provider: 'Ministry of MSME',
    amount: 'Up to ₹1 Crore',
    amountMin: 2500000,
    amountMax: 10000000,
    deadline: '2024-10-15',
    eligibility: [
      'MSME registered entity',
      'Manufacturing sector focus',
      'Technology upgrade requirement',
      'Minimum 3 years of operation'
    ],
    category: 'Government',
    status: 'closing-soon',
    description: 'Facilitates technology upgradation in MSME sector by providing capital subsidy for technology upgradation and modernization.',
    location: 'All States',
    applicationUrl: 'https://msme.gov.in/schemes-initiatives',
    requirements: [
      'MSME registration certificate',
      'Technology upgrade proposal',
      'Financial statements for last 3 years',
      'Vendor quotations and technical specifications',
      'Environmental clearance (if applicable)'
    ],
    applicationProcess: 'Step 1: Submit application to District Industries Centre\nStep 2: Technical evaluation by state committee\nStep 3: Financial appraisal\nStep 4: Approval and subsidy release',
    sourceUrl: 'https://msme.gov.in',
    tags: ['manufacturing', 'technology-upgrade', 'msme'],
    sector: ['Manufacturing', 'Textiles', 'Food Processing', 'Engineering'],
    stage: ['Growth', 'Expansion'],
    fundingType: 'grant'
  },
  {
    id: 'women-entrepreneur-grant',
    title: 'Stand-Up India - Women Entrepreneur Support',
    provider: 'National Small Industries Corporation (NSIC)',
    amount: 'Up to ₹10 Lakhs',
    amountMin: 100000,
    amountMax: 1000000,
    deadline: '2024-12-15',
    eligibility: [
      'Women-led startup (>51% ownership)',
      'Age between 18-45 years',
      'Innovative business model',
      'First-time entrepreneur'
    ],
    category: 'Government',
    status: 'open',
    description: 'Special grant program to support women entrepreneurs in starting and scaling their businesses with focus on innovation and job creation.',
    location: 'Pan India',
    applicationUrl: 'https://www.standupmitra.in/',
    requirements: [
      'Business plan with market analysis',
      'Educational and experience certificates',
      'Project cost estimates',
      'Collateral security documents',
      'Caste certificate (if applicable)'
    ],
    applicationProcess: 'Step 1: Online registration on Stand-Up India portal\nStep 2: Document verification\nStep 3: Business plan evaluation\nStep 4: Bank loan processing and approval',
    sourceUrl: 'https://www.standupmitra.in',
    tags: ['women-entrepreneur', 'diversity', 'inclusion'],
    sector: ['Retail', 'Services', 'Manufacturing', 'Agriculture'],
    stage: ['Idea', 'Early Stage', 'Growth'],
    fundingType: 'loan'
  },
  {
    id: 'clean-energy-innovation-fund',
    title: 'Clean Energy Innovation Fund',
    provider: 'Tata Trusts',
    amount: 'Up to ₹50 Lakhs',
    amountMin: 1000000,
    amountMax: 5000000,
    deadline: '2024-11-20',
    eligibility: [
      'Clean energy or sustainability focus',
      'Scalable and replicable solution',
      'Measurable environmental impact',
      'Strong technical team'
    ],
    category: 'Private',
    status: 'open',
    description: 'Supporting innovative clean energy solutions that can create significant environmental and social impact while being commercially viable.',
    location: 'India',
    applicationUrl: 'https://www.tatatrusts.org/our-work/individual-grants-programme/innovation-grants',
    requirements: [
      'Detailed project proposal',
      'Environmental impact assessment',
      'Technical feasibility study',
      'Financial model and projections',
      'Team credentials and experience'
    ],
    applicationProcess: 'Step 1: Online application submission\nStep 2: Initial screening by program team\nStep 3: Due diligence and site visit\nStep 4: Final evaluation and funding decision',
    sourceUrl: 'https://www.tatatrusts.org',
    tags: ['clean-energy', 'sustainability', 'environment'],
    sector: ['Clean Energy', 'Sustainability', 'Climate Tech'],
    stage: ['Prototype', 'Pilot', 'Scale'],
    fundingType: 'grant'
  },
  {
    id: 'nasscom-10000-startups',
    title: 'NASSCOM 10,000 Startups Program',
    provider: 'NASSCOM',
    amount: 'Up to ₹25 Lakhs',
    amountMin: 500000,
    amountMax: 2500000,
    deadline: '2024-12-31',
    eligibility: [
      'Technology startup',
      'Product-based company',
      'Scalable business model',
      'Early to growth stage'
    ],
    category: 'Industry',
    status: 'open',
    description: 'Comprehensive startup support program providing funding, mentorship, and market access to technology startups.',
    location: 'Pan India',
    applicationUrl: 'https://10000startups.com/',
    requirements: [
      'Product demonstration',
      'Business model canvas',
      'Market traction proof',
      'Team background verification',
      'Financial projections'
    ],
    applicationProcess: 'Step 1: Online application and screening\nStep 2: Pitch presentation\nStep 3: Mentor evaluation\nStep 4: Final selection and onboarding',
    sourceUrl: 'https://10000startups.com',
    tags: ['technology', 'product-based', 'mentorship'],
    sector: ['Software', 'Hardware', 'AI/ML', 'Blockchain'],
    stage: ['MVP', 'Early Revenue', 'Growth'],
    fundingType: 'grant'
  },
  {
    id: 'biotechnology-ignition-grant',
    title: 'Biotechnology Ignition Grant (BIG)',
    provider: 'Biotechnology Industry Research Assistance Council (BIRAC)',
    amount: 'Up to ₹50 Lakhs',
    amountMin: 1000000,
    amountMax: 5000000,
    deadline: '2024-10-30',
    eligibility: [
      'Biotechnology or life sciences startup',
      'Innovative product or technology',
      'Strong scientific foundation',
      'Commercial potential'
    ],
    category: 'Government',
    status: 'open',
    description: 'Supports biotechnology startups in developing innovative products and technologies in life sciences and healthcare.',
    location: 'Pan India',
    applicationUrl: 'https://birac.nic.in/webcontent/1467_1_BIG.aspx',
    requirements: [
      'Scientific project proposal',
      'Proof of concept or prototype',
      'Regulatory pathway analysis',
      'Intellectual property strategy',
      'Commercialization plan'
    ],
    applicationProcess: 'Step 1: Online application through BIRAC portal\nStep 2: Scientific evaluation by experts\nStep 3: Business evaluation\nStep 4: Final approval and grant disbursement',
    sourceUrl: 'https://birac.nic.in',
    tags: ['biotechnology', 'life-sciences', 'healthcare'],
    sector: ['Biotechnology', 'Healthcare', 'Pharmaceuticals', 'Medical Devices'],
    stage: ['R&D', 'Prototype', 'Clinical'],
    fundingType: 'grant'
  },
  {
    id: 'digital-india-land-records',
    title: 'Digital India Land Records Modernization',
    provider: 'Ministry of Electronics and Information Technology',
    amount: 'Up to ₹2 Crores',
    amountMin: 5000000,
    amountMax: 20000000,
    deadline: '2024-09-30',
    eligibility: [
      'GovTech or PropTech startup',
      'Digital solution for land records',
      'Blockchain or AI-based technology',
      'Proven track record in government projects'
    ],
    category: 'Government',
    status: 'open',
    description: 'Supports startups developing digital solutions for land records management and property registration systems.',
    location: 'Pan India',
    applicationUrl: 'https://digitalindia.gov.in/',
    requirements: [
      'Technical solution architecture',
      'Security and privacy compliance',
      'Scalability demonstration',
      'Government partnership experience',
      'Implementation timeline'
    ],
    applicationProcess: 'Step 1: Expression of Interest submission\nStep 2: Technical evaluation\nStep 3: Pilot project proposal\nStep 4: Final selection and contract award',
    sourceUrl: 'https://digitalindia.gov.in',
    tags: ['govtech', 'proptech', 'blockchain', 'digital-transformation'],
    sector: ['GovTech', 'PropTech', 'Blockchain', 'AI/ML'],
    stage: ['MVP', 'Pilot', 'Scale'],
    fundingType: 'grant'
  },
  {
    id: 'agriculture-innovation-fund',
    title: 'Agriculture Innovation and Entrepreneurship Fund',
    provider: 'Indian Council of Agricultural Research (ICAR)',
    amount: 'Up to ₹25 Lakhs',
    amountMin: 500000,
    amountMax: 2500000,
    deadline: '2024-11-15',
    eligibility: [
      'Agriculture or food technology startup',
      'Innovative farming solution',
      'Farmer-centric approach',
      'Sustainable and scalable model'
    ],
    category: 'Government',
    status: 'open',
    description: 'Promotes innovation in agriculture sector by supporting startups developing solutions for farmers and agricultural value chain.',
    location: 'Pan India',
    applicationUrl: 'https://icar.org.in/',
    requirements: [
      'Agricultural innovation proposal',
      'Farmer impact assessment',
      'Technology demonstration',
      'Market analysis for agricultural products',
      'Sustainability metrics'
    ],
    applicationProcess: 'Step 1: Application through ICAR portal\nStep 2: Agricultural expert evaluation\nStep 3: Field trial assessment\nStep 4: Final approval and funding',
    sourceUrl: 'https://icar.org.in',
    tags: ['agriculture', 'agtech', 'farming', 'food-technology'],
    sector: ['Agriculture', 'Food Tech', 'Rural Development'],
    stage: ['Prototype', 'Pilot', 'Scale'],
    fundingType: 'grant'
  },
  {
    id: 'fintech-regulatory-sandbox',
    title: 'FinTech Regulatory Sandbox Support',
    provider: 'Reserve Bank of India (RBI)',
    amount: 'Up to ₹1 Crore',
    amountMin: 2000000,
    amountMax: 10000000,
    deadline: '2024-12-31',
    eligibility: [
      'FinTech startup with innovative solution',
      'Regulatory compliance readiness',
      'Consumer protection measures',
      'Risk management framework'
    ],
    category: 'Government',
    status: 'open',
    description: 'Supports FinTech startups in testing innovative financial products and services in a controlled regulatory environment.',
    location: 'Pan India',
    applicationUrl: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=47200',
    requirements: [
      'Detailed product/service description',
      'Risk assessment and mitigation plan',
      'Consumer protection framework',
      'Technology architecture documentation',
      'Regulatory compliance roadmap'
    ],
    applicationProcess: 'Step 1: Application to RBI regulatory sandbox\nStep 2: Initial screening and evaluation\nStep 3: Sandbox testing phase\nStep 4: Final evaluation and market launch approval',
    sourceUrl: 'https://rbi.org.in',
    tags: ['fintech', 'regulatory-sandbox', 'financial-services'],
    sector: ['FinTech', 'Banking', 'Insurance', 'Payments'],
    stage: ['MVP', 'Beta', 'Pre-Launch'],
    fundingType: 'grant'
  }
]

export const getGrantsByCategory = (category: string) => {
  if (category === 'all') return INDIAN_GRANTS
  return INDIAN_GRANTS.filter(grant => grant.category.toLowerCase() === category.toLowerCase())
}

export const getGrantsByLocation = (location: string) => {
  if (location === 'all') return INDIAN_GRANTS
  return INDIAN_GRANTS.filter(grant => 
    grant.location.toLowerCase().includes(location.toLowerCase())
  )
}

export const getGrantsBySector = (sector: string) => {
  return INDIAN_GRANTS.filter(grant => 
    grant.sector.some(s => s.toLowerCase().includes(sector.toLowerCase()))
  )
}

export const getGrantsByStage = (stage: string) => {
  return INDIAN_GRANTS.filter(grant => 
    grant.stage.some(s => s.toLowerCase().includes(stage.toLowerCase()))
  )
}

export const searchGrants = (query: string) => {
  const searchTerm = query.toLowerCase()
  return INDIAN_GRANTS.filter(grant => 
    grant.title.toLowerCase().includes(searchTerm) ||
    grant.provider.toLowerCase().includes(searchTerm) ||
    grant.description.toLowerCase().includes(searchTerm) ||
    grant.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    grant.sector.some(sector => sector.toLowerCase().includes(searchTerm))
  )
}