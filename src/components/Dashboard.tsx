import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { GrantDiscovery } from '@/components/GrantDiscovery'
import { ApplicationForm } from '@/components/ApplicationForm'
import { GrantScraper } from '@/components/GrantScraper'
import { INDIAN_GRANTS, Grant, getGrantsByCategory, getGrantsByLocation, searchGrants } from '@/data/grants'
import { 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Award,
  Users,
  Building,
  MapPin,
  ExternalLink,
  Bell,
  Sparkles,
  Brain,
  Globe
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Application {
  id: string
  grantTitle: string
  provider: string
  amount: string
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected'
  submittedDate: string
  progress: number
}

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [showGrantDiscovery, setShowGrantDiscovery] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedGrantId, setSelectedGrantId] = useState<string>('')

  // Use real grant data
  const [grants] = useState<Grant[]>(INDIAN_GRANTS)
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>(INDIAN_GRANTS)

  const [applications] = useState<Application[]>([
    {
      id: '1',
      grantTitle: 'Startup India Seed Funding Scheme',
      provider: 'DPIIT',
      amount: '₹20 Lakhs',
      status: 'under-review',
      submittedDate: '2024-07-10',
      progress: 75
    },
    {
      id: '2',
      grantTitle: 'Women Entrepreneur Grant',
      provider: 'NSIC',
      amount: '₹10 Lakhs',
      status: 'draft',
      submittedDate: '',
      progress: 40
    }
  ])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await blink.auth.logout('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'closing-soon': return 'bg-orange-100 text-orange-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'under-review': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'under-review': return <Clock className="w-4 h-4" />
      case 'rejected': return <AlertCircle className="w-4 h-4" />
      case 'draft': return <FileText className="w-4 h-4" />
      case 'submitted': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleApplyGrant = (grantId: string) => {
    setSelectedGrantId(grantId)
    setShowApplicationForm(true)
  }

  // Filter grants based on search and filters
  useEffect(() => {
    let filtered = grants
    
    // Apply combined filters
    if (searchQuery.trim() || selectedCategory !== 'all' || selectedLocation !== 'all') {
      filtered = grants.filter(grant => {
        const matchesSearch = !searchQuery.trim() || 
          grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          grant.sector.some(sector => sector.toLowerCase().includes(searchQuery.toLowerCase()))
        
        const matchesCategory = selectedCategory === 'all' || grant.category.toLowerCase() === selectedCategory
        const matchesLocation = selectedLocation === 'all' || grant.location.toLowerCase().includes(selectedLocation.toLowerCase())
        
        return matchesSearch && matchesCategory && matchesLocation
      })
    }
    
    setFilteredGrants(filtered)
  }, [searchQuery, selectedCategory, selectedLocation, grants])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Award className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Khoj</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Grants</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredGrants.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funding</p>
                  <p className="text-2xl font-bold text-gray-900">₹2.5Cr</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => setShowGrantDiscovery(true)}>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">AI Grant Discovery</h3>
                  <p className="text-sm text-blue-700">Find perfect matches with AI</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Success Predictor</h3>
                  <p className="text-sm text-purple-700">Check your approval chances</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-900">Grant Scraper</h3>
                  <p className="text-sm text-orange-700">Real-time grant discovery</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Application Tracker</h3>
                  <p className="text-sm text-green-700">Monitor your progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover Grants</TabsTrigger>
            <TabsTrigger value="scraper">Grant Scraper</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                      <SelectItem value="industry">Industry</SelectItem>
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
              {filteredGrants.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredGrants.map((grant) => (
                  <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                              <Badge className={`${getStatusColor(grant.status)} border-0`}>
                                {grant.status.replace('-', ' ')}
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {grant.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3 text-sm">{grant.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {grant.eligibility.slice(0, 3).map((criteria, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {criteria}
                              </Badge>
                            ))}
                            {grant.eligibility.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{grant.eligibility.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Award className="w-4 h-4 mr-1" />
                              {grant.amount}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Deadline: {new Date(grant.deadline).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {grant.location}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(grant.applicationUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleApplyGrant(grant.id)}>
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Grant Scraper Tab */}
          <TabsContent value="scraper" className="space-y-6">
            <GrantScraper />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-6">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{application.grantTitle}</h3>
                            <p className="text-sm text-gray-600">{application.provider}</p>
                          </div>
                          <Badge className={`${getStatusColor(application.status)} border-0 flex items-center gap-1`}>
                            {getStatusIcon(application.status)}
                            {application.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 mr-1" />
                            {application.amount}
                          </div>
                          {application.submittedDate && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Submitted: {new Date(application.submittedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {application.status !== 'draft' && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Application Progress</span>
                              <span className="text-gray-900 font-medium">{application.progress}%</span>
                            </div>
                            <Progress value={application.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {application.status === 'draft' ? (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Continue Application
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Application
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Startup Profile</CardTitle>
                <CardDescription>
                  Complete your profile to get better grant recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name</label>
                    <Input placeholder="Enter your company name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Stage</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="prototype">Prototype</SelectItem>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="early-revenue">Early Revenue</SelectItem>
                        <SelectItem value="growth">Growth Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Company Description</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    placeholder="Describe your company and what you do..."
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Grant Discovery Modal */}
      {showGrantDiscovery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">AI Grant Discovery</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowGrantDiscovery(false)}>
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <GrantDiscovery />
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && selectedGrantId && (
        <ApplicationForm 
          grantId={selectedGrantId} 
          onClose={() => {
            setShowApplicationForm(false)
            setSelectedGrantId('')
          }} 
        />
      )}
    </div>
  )
}