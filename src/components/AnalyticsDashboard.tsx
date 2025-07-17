import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown,
  Award,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface AnalyticsData {
  totalApplications: number
  successRate: number
  totalFunding: number
  avgProcessingTime: number
  monthlyTrend: number
  topCategories: Array<{
    name: string
    count: number
    successRate: number
  }>
  recentActivity: Array<{
    id: string
    type: 'application' | 'approval' | 'rejection'
    grantName: string
    amount: string
    date: string
  }>
  fundingByMonth: Array<{
    month: string
    amount: number
    applications: number
  }>
}

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  // Mock analytics data
  const [analyticsData] = useState<AnalyticsData>({
    totalApplications: 24,
    successRate: 78,
    totalFunding: 4500000, // ₹45 Lakhs
    avgProcessingTime: 52, // days
    monthlyTrend: 15.3, // percentage increase
    topCategories: [
      { name: 'Technology', count: 8, successRate: 85 },
      { name: 'Healthcare', count: 6, successRate: 72 },
      { name: 'Clean Energy', count: 4, successRate: 90 },
      { name: 'Manufacturing', count: 3, successRate: 65 },
      { name: 'Agriculture', count: 3, successRate: 80 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'approval',
        grantName: 'Startup India Seed Fund',
        amount: '₹20 Lakhs',
        date: '2024-07-14'
      },
      {
        id: '2',
        type: 'application',
        grantName: 'BIRAC Innovation Grant',
        amount: '₹50 Lakhs',
        date: '2024-07-13'
      },
      {
        id: '3',
        type: 'approval',
        grantName: 'Women Entrepreneur Grant',
        amount: '₹10 Lakhs',
        date: '2024-07-12'
      },
      {
        id: '4',
        type: 'rejection',
        grantName: 'MSME Technology Upgrade',
        amount: '₹1 Crore',
        date: '2024-07-11'
      }
    ],
    fundingByMonth: [
      { month: 'Jan', amount: 500000, applications: 3 },
      { month: 'Feb', amount: 750000, applications: 4 },
      { month: 'Mar', amount: 1200000, applications: 6 },
      { month: 'Apr', amount: 800000, applications: 4 },
      { month: 'May', amount: 950000, applications: 5 },
      { month: 'Jun', amount: 1300000, applications: 7 }
    ]
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`
    } else {
      return `₹${amount.toLocaleString()}`
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'application':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'rejection':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'application':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejection':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your grant application performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalApplications}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+{analyticsData.monthlyTrend}%</span>
                  <span className="text-sm text-gray-500 ml-1">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.successRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analyticsData.successRate}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Funding</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalFunding)}</p>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">Secured</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.avgProcessingTime} days</p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600 font-medium">Average time</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Funding Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Funding Trend (6 Months)
                </CardTitle>
                <CardDescription>Monthly funding secured over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.fundingByMonth.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {month.month}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(month.amount)}</p>
                          <p className="text-sm text-gray-600">{month.applications} applications</p>
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress 
                          value={(month.amount / Math.max(...analyticsData.fundingByMonth.map(m => m.amount))) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-green-600" />
                  Success Metrics
                </CardTitle>
                <CardDescription>Application outcomes breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Approved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">18</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Under Review</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">4</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-sm font-medium">Rejected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold">2</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
              <CardDescription>Success rates and application counts across different grant categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topCategories.map((category, index) => (
                  <div key={category.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.count} applications</p>
                        </div>
                      </div>
                      <Badge className={`${category.successRate >= 80 ? 'bg-green-100 text-green-800 border-green-200' : 
                                       category.successRate >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                                       'bg-orange-100 text-orange-800 border-orange-200'} border`}>
                        {category.successRate}% success
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">{category.successRate}%</span>
                      </div>
                      <Progress value={category.successRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your grant applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.grantName}
                        </p>
                        <Badge className={`${getActivityColor(activity.type)} border text-xs`}>
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">{activity.amount}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}