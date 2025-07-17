import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Award, 
  Building, 
  MapPin, 
  ExternalLink,
  Brain,
  Target,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  Zap
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Grant {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  eligibility: string[]
  category: string
  status: 'open' | 'closing-soon' | 'closed'
  matchScore: number
  description: string
  location: string
  requirements: string[]
  successRate: number
  avgProcessingTime: string
  tags: string[]
}

interface StartupProfile {
  companyName: string
  industry: string
  stage: string
  location: string
  description: string
  teamSize: number
  revenue: string
  fundingHistory: string
}

export function GrantDiscovery() {
  const [loading, setLoading] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [startupProfile, setStartupProfile] = useState<StartupProfile>({
    companyName: '',
    industry: '',
    stage: '',
    location: '',
    description: '',
    teamSize: 0,
    revenue: '',
    fundingHistory: ''
  })

  // Enhanced mock grants data with AI matching scores
  const [grants] = useState<Grant[]>([
    {
      id: '1',
      title: 'Startup India Seed Funding Scheme',
      provider: 'Department for Promotion of Industry and Internal Trade',
      amount: 'Up to ₹20 Lakhs',
      deadline: '2024-08-15',
      eligibility: ['Early-stage startup', 'DPIIT recognized', 'Technology-based'],
      category: 'Government',
      status: 'open',
      matchScore: 95,
      description: 'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.',
      location: 'Pan India',
      requirements: ['Business plan', 'Financial projections', 'DPIIT certificate', 'Prototype demo'],
      successRate: 78,
      avgProcessingTime: '45-60 days',
      tags: ['seed-funding', 'technology', 'early-stage']
    },
    {
      id: '2',
      title: 'MSME Technology Upgradation Scheme',
      provider: 'Ministry of MSME',
      amount: 'Up to ₹1 Crore',
      deadline: '2024-07-30',
      eligibility: ['MSME registered', 'Manufacturing sector', 'Technology upgrade'],
      category: 'Government',
      status: 'closing-soon',
      matchScore: 88,
      description: 'Facilitates technology upgradation in MSME sector by providing capital subsidy for technology upgradation.',
      location: 'All States',
      requirements: ['MSME certificate', 'Technology upgrade plan', 'Cost estimates', 'Vendor quotations'],
      successRate: 65,
      avgProcessingTime: '60-90 days',
      tags: ['manufacturing', 'technology-upgrade', 'msme']
    },
    {
      id: '3',
      title: 'Women Entrepreneur Grant',
      provider: 'National Small Industries Corporation',
      amount: 'Up to ₹10 Lakhs',
      deadline: '2024-09-01',
      eligibility: ['Women-led startup', 'Less than 3 years old', 'Innovative business model'],
      category: 'Government',
      status: 'open',
      matchScore: 82,
      description: 'Special grant program to support women entrepreneurs in starting and scaling their businesses.',
      location: 'Pan India',
      requirements: ['Women entrepreneur certificate', 'Business plan', 'Innovation proof', 'Market analysis'],
      successRate: 72,
      avgProcessingTime: '30-45 days',
      tags: ['women-entrepreneur', 'innovation', 'early-stage']
    },
    {
      id: '4',
      title: 'Clean Energy Innovation Fund',
      provider: 'Tata Trusts',
      amount: 'Up to ₹50 Lakhs',
      deadline: '2024-08-20',
      eligibility: ['Clean energy focus', 'Scalable solution', 'Social impact'],
      category: 'Private',
      status: 'open',
      matchScore: 76,
      description: 'Supporting innovative clean energy solutions that can create significant environmental and social impact.',
      location: 'India',
      requirements: ['Impact assessment', 'Technical feasibility', 'Scalability plan', 'Team credentials'],
      successRate: 45,
      avgProcessingTime: '90-120 days',
      tags: ['clean-energy', 'social-impact', 'innovation']
    },
    {
      id: '5',
      title: 'Digital India Innovation Challenge',
      provider: 'Ministry of Electronics and IT',
      amount: 'Up to ₹25 Lakhs',
      deadline: '2024-08-10',
      eligibility: ['Digital solution', 'Government problem solving', 'Scalable technology'],
      category: 'Government',
      status: 'open',
      matchScore: 91,
      description: 'Supports digital innovations that solve government and citizen problems through technology.',
      location: 'Pan India',
      requirements: ['Problem statement', 'Technical solution', 'Pilot results', 'Government endorsement'],
      successRate: 58,
      avgProcessingTime: '75-90 days',
      tags: ['digital-india', 'govtech', 'technology']
    },
    {
      id: '6',
      title: 'Biotechnology Startup Grant',
      provider: 'Department of Biotechnology',
      amount: 'Up to ₹75 Lakhs',
      deadline: '2024-09-15',
      eligibility: ['Biotech startup', 'Research-based', 'Commercial potential'],
      category: 'Government',
      status: 'open',
      matchScore: 69,
      description: 'Supports biotechnology startups with innovative solutions in healthcare, agriculture, and industrial biotechnology.',
      location: 'Pan India',
      requirements: ['Research proposal', 'IP documentation', 'Regulatory approvals', 'Clinical data'],
      successRate: 42,
      avgProcessingTime: '120-150 days',
      tags: ['biotechnology', 'research', 'healthcare']
    }
  ])

  const [aiRecommendations, setAiRecommendations] = useState<string>('')

  const handleAIAnalysis = async () => {
    setAiAnalyzing(true)
    try {
      // Simulate AI analysis with actual AI call
      const analysisPrompt = `
        Analyze this startup profile and recommend the best grants from the available options:
        
        Company: ${startupProfile.companyName}
        Industry: ${startupProfile.industry}
        Stage: ${startupProfile.stage}
        Location: ${startupProfile.location}
        Description: ${startupProfile.description}
        Team Size: ${startupProfile.teamSize}
        Revenue: ${startupProfile.revenue}
        Funding History: ${startupProfile.fundingHistory}
        
        Available grants: ${grants.map(g => `${g.title} (${g.category}, ${g.amount}, Match: ${g.matchScore}%)`).join(', ')}
        
        Provide specific recommendations with reasoning for why each grant is suitable.
      `

      const { text } = await blink.ai.generateText({
        prompt: analysisPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 500
      })

      setAiRecommendations(text)
      setShowAIRecommendations(true)
    } catch (error) {
      console.error('AI analysis error:', error)
      setAiRecommendations('AI analysis temporarily unavailable. Please try again later.')
      setShowAIRecommendations(true)
    } finally {
      setAiAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200'
      case 'closing-soon': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || grant.category.toLowerCase() === selectedCategory
    const matchesLocation = selectedLocation === 'all' || grant.location.toLowerCase().includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesLocation
  }).sort((a, b) => b.matchScore - a.matchScore) // Sort by match score

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grant Discovery</h1>
        <p className="text-gray-600">Find the perfect grants for your startup with AI-powered matching</p>
      </div>

      <Tabs defaultValue="discover" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover Grants</TabsTrigger>
          <TabsTrigger value="ai-match">AI Smart Match</TabsTrigger>
        </TabsList>

        {/* Discover Grants Tab */}
        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search grants by title, provider, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="pan india">Pan India</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Grants List */}
          <div className="grid gap-6">
            {filteredGrants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{grant.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            {grant.provider}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(grant.status)} border`}>
                            {grant.status === 'closing-soon' && <Clock className="w-3 h-3 mr-1" />}
                            {grant.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={`${getMatchScoreColor(grant.matchScore)} border`}>
                            <Target className="w-3 h-3 mr-1" />
                            {grant.matchScore}% match
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">{grant.description}</p>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{grant.successRate}%</div>
                          <div className="text-xs text-gray-600">Success Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">{grant.avgProcessingTime}</div>
                          <div className="text-xs text-gray-600">Processing Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">{grant.requirements.length}</div>
                          <div className="text-xs text-gray-600">Requirements</div>
                        </div>
                      </div>
                      
                      {/* Eligibility Criteria */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility Criteria:</h4>
                        <div className="flex flex-wrap gap-2">
                          {grant.eligibility.map((criteria, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {criteria}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {grant.requirements.slice(0, 4).map((req, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                              <FileText className="w-3 h-3 mr-1 text-gray-400" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-medium">{grant.amount}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-orange-600" />
                          Deadline: {new Date(grant.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                          {grant.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Smart Match Tab */}
        <TabsContent value="ai-match" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                AI-Powered Grant Matching
              </CardTitle>
              <CardDescription>
                Tell us about your startup and get personalized grant recommendations powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name</label>
                  <Input 
                    placeholder="Enter your company name"
                    value={startupProfile.companyName}
                    onChange={(e) => setStartupProfile({...startupProfile, companyName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
                  <Select value={startupProfile.industry} onValueChange={(value) => setStartupProfile({...startupProfile, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="biotechnology">Biotechnology</SelectItem>
                      <SelectItem value="clean-energy">Clean Energy</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stage</label>
                  <Select value={startupProfile.stage} onValueChange={(value) => setStartupProfile({...startupProfile, stage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea Stage</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="early-revenue">Early Revenue</SelectItem>
                      <SelectItem value="growth">Growth Stage</SelectItem>
                      <SelectItem value="scale">Scale Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                  <Select value={startupProfile.location} onValueChange={(value) => setStartupProfile({...startupProfile, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="kolkata">Kolkata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Team Size</label>
                  <Input 
                    type="number"
                    placeholder="Number of team members"
                    value={startupProfile.teamSize || ''}
                    onChange={(e) => setStartupProfile({...startupProfile, teamSize: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Current Revenue</label>
                  <Select value={startupProfile.revenue} onValueChange={(value) => setStartupProfile({...startupProfile, revenue: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
                      <SelectItem value="0-1l">₹0 - ₹1 Lakh</SelectItem>
                      <SelectItem value="1l-10l">₹1 - ₹10 Lakhs</SelectItem>
                      <SelectItem value="10l-1cr">₹10 Lakhs - ₹1 Crore</SelectItem>
                      <SelectItem value="1cr+">₹1 Crore+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company Description</label>
                <Textarea 
                  placeholder="Describe your company, what problem you solve, your solution, and target market..."
                  rows={4}
                  value={startupProfile.description}
                  onChange={(e) => setStartupProfile({...startupProfile, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Previous Funding History</label>
                <Textarea 
                  placeholder="Any previous grants, investments, or funding received (optional)..."
                  rows={2}
                  value={startupProfile.fundingHistory}
                  onChange={(e) => setStartupProfile({...startupProfile, fundingHistory: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleAIAnalysis} 
                disabled={aiAnalyzing || !startupProfile.companyName || !startupProfile.industry || !startupProfile.description}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {aiAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    AI Analyzing Your Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Grant Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          {showAIRecommendations && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Grant Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-blue-800">
                  <div className="whitespace-pre-wrap">{aiRecommendations}</div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Top Matched Grants:</h4>
                  <div className="grid gap-3">
                    {filteredGrants.slice(0, 3).map((grant) => (
                      <div key={grant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                        <div>
                          <h5 className="font-medium text-gray-900">{grant.title}</h5>
                          <p className="text-sm text-gray-600">{grant.amount} • {grant.provider}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getMatchScoreColor(grant.matchScore)} border`}>
                            {grant.matchScore}% match
                          </Badge>
                          <Button size="sm" variant="outline">
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}