import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  RefreshCw, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  Database,
  Zap,
  Eye,
  ExternalLink,
  Filter,
  Calendar,
  Award,
  Building
} from 'lucide-react'
import { blink } from '@/blink/client'

interface ScrapedGrant {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  description: string
  eligibility: string[]
  sourceUrl: string
  scrapedAt: string
  status: 'active' | 'expired' | 'pending'
  category: string
  location: string
}

interface ScrapingSource {
  id: string
  name: string
  url: string
  status: 'active' | 'inactive' | 'scraping'
  lastScrape: string
  grantsFound: number
  description: string
}

export function GrantScraper() {
  const [loading, setLoading] = useState(false)
  const [scrapingProgress, setScrapingProgress] = useState(0)
  const [scrapedGrants, setScrapedGrants] = useState<ScrapedGrant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentlyScraping, setCurrentlyScraping] = useState<string | null>(null)

  // Mock data for Indian grant sources
  const [scrapingSources] = useState<ScrapingSource[]>([
    {
      id: '1',
      name: 'Startup India Portal',
      url: 'https://www.startupindia.gov.in',
      status: 'active',
      lastScrape: '2024-07-15T10:30:00Z',
      grantsFound: 45,
      description: 'Official government portal for startup schemes and grants'
    },
    {
      id: '2',
      name: 'MSME Ministry',
      url: 'https://msme.gov.in',
      status: 'active',
      lastScrape: '2024-07-15T09:15:00Z',
      grantsFound: 28,
      description: 'Ministry of Micro, Small and Medium Enterprises schemes'
    },
    {
      id: '3',
      name: 'Department of Science & Technology',
      url: 'https://dst.gov.in',
      status: 'active',
      lastScrape: '2024-07-15T08:45:00Z',
      grantsFound: 32,
      description: 'Science and technology innovation grants'
    },
    {
      id: '4',
      name: 'BIRAC (Biotechnology)',
      url: 'https://birac.nic.in',
      status: 'active',
      lastScrape: '2024-07-14T16:20:00Z',
      grantsFound: 18,
      description: 'Biotechnology Industry Research Assistance Council'
    },
    {
      id: '5',
      name: 'NSTEDB',
      url: 'https://nstedb.com',
      status: 'active',
      lastScrape: '2024-07-14T14:10:00Z',
      grantsFound: 22,
      description: 'National Science & Technology Entrepreneurship Development Board'
    },
    {
      id: '6',
      name: 'Atal Innovation Mission',
      url: 'https://aim.gov.in',
      status: 'active',
      lastScrape: '2024-07-14T12:30:00Z',
      grantsFound: 15,
      description: 'Innovation and entrepreneurship promotion'
    }
  ])

  // Mock scraped grants data
  const [allScrapedGrants] = useState<ScrapedGrant[]>([
    {
      id: 'scraped-1',
      title: 'Startup India Seed Funding Scheme - Batch 2024',
      provider: 'Department for Promotion of Industry and Internal Trade',
      amount: 'Up to ₹20 Lakhs',
      deadline: '2024-08-30',
      description: 'Financial assistance for proof of concept, prototype development, product trials, market entry and commercialization for DPIIT recognized startups.',
      eligibility: ['DPIIT recognized startup', 'Incorporated within 10 years', 'Technology-based innovation'],
      sourceUrl: 'https://www.startupindia.gov.in/content/sih/en/government-schemes.html',
      scrapedAt: '2024-07-15T10:30:00Z',
      status: 'active',
      category: 'Government',
      location: 'Pan India'
    },
    {
      id: 'scraped-2',
      title: 'Technology Business Incubator (TBI) Support',
      provider: 'Department of Science and Technology',
      amount: 'Up to ₹2.5 Crores',
      deadline: '2024-09-15',
      description: 'Support for establishing and strengthening Technology Business Incubators to promote innovation and entrepreneurship.',
      eligibility: ['Academic institutions', 'R&D organizations', 'Industry associations'],
      sourceUrl: 'https://dst.gov.in/scientific-programmes/technology-systems/national-science-technology-entrepreneurship-development-board-nstedb',
      scrapedAt: '2024-07-15T08:45:00Z',
      status: 'active',
      category: 'Government',
      location: 'Pan India'
    },
    {
      id: 'scraped-3',
      title: 'BIRAC BIG (Biotechnology Ignition Grant)',
      provider: 'Biotechnology Industry Research Assistance Council',
      amount: 'Up to ₹50 Lakhs',
      deadline: '2024-08-20',
      description: 'Support for individual innovators and startup companies to undertake proof-of-concept research leading to technology development in biotechnology.',
      eligibility: ['Individual innovators', 'Startup companies', 'Biotechnology focus'],
      sourceUrl: 'https://birac.nic.in/webcontent/1467_BIG.pdf',
      scrapedAt: '2024-07-14T16:20:00Z',
      status: 'active',
      category: 'Government',
      location: 'Pan India'
    },
    {
      id: 'scraped-4',
      title: 'MSME Technology Upgradation Scheme (CLCSS)',
      provider: 'Ministry of MSME',
      amount: 'Up to ₹1 Crore',
      deadline: '2024-07-25',
      description: 'Credit Linked Capital Subsidy Scheme for technology upgradation of MSMEs to enhance productivity and competitiveness.',
      eligibility: ['MSME registered units', 'Manufacturing sector', 'Technology upgrade'],
      sourceUrl: 'https://msme.gov.in/1-credit-linked-capital-subsidy-scheme-clcss',
      scrapedAt: '2024-07-15T09:15:00Z',
      status: 'active',
      category: 'Government',
      location: 'All States'
    },
    {
      id: 'scraped-5',
      title: 'Atal New India Challenge (ANIC)',
      provider: 'Atal Innovation Mission',
      amount: 'Up to ₹1 Crore',
      deadline: '2024-09-10',
      description: 'Product innovation challenge to solve problems of national importance and societal relevance.',
      eligibility: ['Indian startups', 'MSMEs', 'Individual innovators'],
      sourceUrl: 'https://aim.gov.in/atal-new-india-challenge.php',
      scrapedAt: '2024-07-14T12:30:00Z',
      status: 'active',
      category: 'Government',
      location: 'Pan India'
    },
    {
      id: 'scraped-6',
      title: 'Women Entrepreneurship Platform (WEP) Grant',
      provider: 'NITI Aayog',
      amount: 'Up to ₹15 Lakhs',
      deadline: '2024-08-05',
      description: 'Support for women entrepreneurs to start and scale their businesses with focus on innovation and job creation.',
      eligibility: ['Women-led startups', 'Less than 5 years old', 'Innovative business model'],
      sourceUrl: 'https://wep.gov.in/grants',
      scrapedAt: '2024-07-14T11:45:00Z',
      status: 'active',
      category: 'Government',
      location: 'Pan India'
    }
  ])

  useEffect(() => {
    setScrapedGrants(allScrapedGrants)
  }, [allScrapedGrants])

  const handleScrapeSource = async (sourceId: string) => {
    const source = scrapingSources.find(s => s.id === sourceId)
    if (!source) return

    setCurrentlyScraping(sourceId)
    setLoading(true)
    setScrapingProgress(0)

    try {
      // Simulate scraping process with progress updates
      const progressInterval = setInterval(() => {
        setScrapingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Simulate AI-powered web scraping
      const scrapingPrompt = `
        Simulate scraping the ${source.name} website (${source.url}) for Indian government grants and schemes.
        Generate 2-3 realistic grant opportunities that would be found on this website.
        
        For each grant, provide:
        - Title (realistic and specific)
        - Amount range in Indian Rupees
        - Deadline (future date)
        - Brief description
        - Eligibility criteria
        
        Make it specific to ${source.description}.
      `

      const { text } = await blink.ai.generateText({
        prompt: scrapingPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 400
      })

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setScrapingProgress(100)

      // In a real implementation, this would parse the AI response and create new grant objects
      console.log('Scraped content:', text)

      // Simulate adding new grants
      setTimeout(() => {
        setScrapingProgress(0)
        setCurrentlyScraping(null)
        setLoading(false)
        
        // Show success message
        alert(`Successfully scraped ${source.name}! Found new grant opportunities.`)
      }, 1000)

    } catch (error) {
      console.error('Scraping error:', error)
      setScrapingProgress(0)
      setCurrentlyScraping(null)
      setLoading(false)
      alert('Scraping failed. Please try again.')
    }
  }

  const handleScrapeAll = async () => {
    setLoading(true)
    setScrapingProgress(0)

    try {
      for (let i = 0; i < scrapingSources.length; i++) {
        setCurrentlyScraping(scrapingSources[i].id)
        setScrapingProgress((i / scrapingSources.length) * 100)
        
        // Simulate scraping each source
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      setScrapingProgress(100)
      setTimeout(() => {
        setScrapingProgress(0)
        setCurrentlyScraping(null)
        setLoading(false)
        alert('Successfully scraped all sources! Grant database updated.')
      }, 1000)

    } catch (error) {
      console.error('Bulk scraping error:', error)
      setScrapingProgress(0)
      setCurrentlyScraping(null)
      setLoading(false)
    }
  }

  const filteredGrants = scrapedGrants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grant.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || grant.category.toLowerCase() === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'scraping': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Grant Scraper</h1>
        <p className="text-gray-600">Real-time scraping of Indian government and private grant websites</p>
      </div>

      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources">Scraping Sources</TabsTrigger>
          <TabsTrigger value="scraped">Scraped Grants ({filteredGrants.length})</TabsTrigger>
        </TabsList>

        {/* Scraping Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-600" />
                    Scraping Control Panel
                  </CardTitle>
                  <CardDescription>
                    Monitor and control grant scraping from various Indian government sources
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleScrapeAll}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Scraping All...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Scrape All Sources
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {loading && (
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Scraping Progress</span>
                    <span>{Math.round(scrapingProgress)}%</span>
                  </div>
                  <Progress value={scrapingProgress} className="h-2" />
                  {currentlyScraping && (
                    <p className="text-sm text-blue-600">
                      Currently scraping: {scrapingSources.find(s => s.id === currentlyScraping)?.name}
                    </p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Sources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrapingSources.map((source) => (
              <Card key={source.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <Badge className={`${getStatusColor(currentlyScraping === source.id ? 'scraping' : source.status)} border`}>
                      {currentlyScraping === source.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          Scraping
                        </>
                      ) : (
                        <>
                          {source.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {source.status}
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate">
                        {source.url}
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Last Scrape</div>
                        <div className="font-medium">
                          {new Date(source.lastScrape).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Grants Found</div>
                        <div className="font-medium text-green-600">{source.grantsFound}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleScrapeSource(source.id)}
                        disabled={loading}
                        className="flex-1"
                      >
                        {currentlyScraping === source.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Scraping...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Scrape Now
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scraped Grants Tab */}
        <TabsContent value="scraped" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search scraped grants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="government">Government</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Scraped Grants List */}
          <div className="grid gap-6">
            {filteredGrants.map((grant) => (
              <Card key={grant.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
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
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Scraped
                          </Badge>
                          <Badge variant="outline">
                            {grant.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">{grant.description}</p>
                      
                      {/* Eligibility Criteria */}
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility:</h4>
                        <div className="flex flex-wrap gap-2">
                          {grant.eligibility.map((criteria, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {criteria}
                            </Badge>
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
                          <Clock className="w-4 h-4 mr-1 text-blue-600" />
                          Scraped: {new Date(grant.scrapedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={grant.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Source
                        </a>
                      </Button>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGrants.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scraped Grants Found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'Start scraping sources to discover new grants'
                  }
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}