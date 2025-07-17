import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  X, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Sparkles,
  Brain,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  Award,
  Building,
  Calendar,
  Target,
  Zap,
  Eye,
  Download
} from 'lucide-react'
import { blink } from '@/blink/client'

interface ApplicationFormProps {
  grantId: string
  onClose: () => void
}

interface Grant {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  description: string
  requirements: string[]
  eligibility: string[]
  successRate: number
}

interface ApplicationData {
  // Basic Information
  companyName: string
  registrationNumber: string
  foundedYear: string
  legalStructure: string
  
  // Project Details
  projectTitle: string
  projectDescription: string
  problemStatement: string
  solution: string
  innovation: string
  
  // Business Information
  marketSize: string
  targetMarket: string
  businessModel: string
  competitiveAdvantage: string
  
  // Financial Information
  fundingAmount: string
  useOfFunds: string
  financialProjections: string
  currentRevenue: string
  
  // Team Information
  teamDetails: string
  keyPersonnel: string
  advisors: string
  
  // Implementation
  timeline: string
  milestones: string
  expectedOutcomes: string
  socialImpact: string
  
  // Documents
  documents: File[]
}

export function ApplicationForm({ grantId, onClose }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completionProgress, setCompletionProgress] = useState(0)
  const [grant, setGrant] = useState<Grant | null>(null)
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    companyName: '',
    registrationNumber: '',
    foundedYear: '',
    legalStructure: '',
    projectTitle: '',
    projectDescription: '',
    problemStatement: '',
    solution: '',
    innovation: '',
    marketSize: '',
    targetMarket: '',
    businessModel: '',
    competitiveAdvantage: '',
    fundingAmount: '',
    useOfFunds: '',
    financialProjections: '',
    currentRevenue: '',
    teamDetails: '',
    keyPersonnel: '',
    advisors: '',
    timeline: '',
    milestones: '',
    expectedOutcomes: '',
    socialImpact: '',
    documents: []
  })

  // Mock grant data - in real app, fetch by grantId
  useEffect(() => {
    const mockGrant: Grant = {
      id: grantId,
      title: 'Startup India Seed Funding Scheme',
      provider: 'Department for Promotion of Industry and Internal Trade',
      amount: 'Up to ₹20 Lakhs',
      deadline: '2024-08-15',
      description: 'Provides financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization.',
      requirements: ['Business plan', 'Financial projections', 'DPIIT certificate', 'Prototype demo'],
      eligibility: ['Early-stage startup', 'DPIIT recognized', 'Technology-based'],
      successRate: 78
    }
    setGrant(mockGrant)
  }, [grantId])

  const steps = [
    { id: 0, title: 'Basic Info', icon: Building },
    { id: 1, title: 'Project Details', icon: FileText },
    { id: 2, title: 'Business Model', icon: Target },
    { id: 3, title: 'Financials', icon: Award },
    { id: 4, title: 'Team', icon: Building },
    { id: 5, title: 'Implementation', icon: Calendar },
    { id: 6, title: 'Documents', icon: Upload }
  ]

  // Calculate completion progress
  useEffect(() => {
    const totalFields = Object.keys(applicationData).length - 1 // Exclude documents array
    const completedFields = Object.entries(applicationData).filter(([key, value]) => 
      key !== 'documents' && value && value.toString().trim() !== ''
    ).length
    
    setCompletionProgress((completedFields / totalFields) * 100)
  }, [applicationData])

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAIGenerate = async (field: keyof ApplicationData, context: string) => {
    setAiGenerating(true)
    try {
      const prompt = `
        Generate content for a grant application field: ${field}
        
        Context: ${context}
        Grant: ${grant?.title}
        Company: ${applicationData.companyName}
        Project: ${applicationData.projectTitle}
        
        Generate professional, compelling content that would help win this grant.
        Keep it concise but comprehensive (2-3 paragraphs max).
      `

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 300
      })

      handleInputChange(field, text.trim())
    } catch (error) {
      console.error('AI generation error:', error)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setApplicationData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }))
    }
  }

  const removeDocument = (index: number) => {
    setApplicationData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate application submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, save to database and submit to grant provider
      console.log('Application submitted:', applicationData)
      
      alert('Application submitted successfully!')
      onClose()
    } catch (error) {
      console.error('Submission error:', error)
      alert('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      // Save draft to database
      console.log('Draft saved:', applicationData)
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name *</label>
                <Input
                  placeholder="Enter your company name"
                  value={applicationData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Registration Number</label>
                <Input
                  placeholder="Company registration number"
                  value={applicationData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Founded Year</label>
                <Input
                  type="number"
                  placeholder="Year founded"
                  value={applicationData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Legal Structure</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={applicationData.legalStructure}
                  onChange={(e) => handleInputChange('legalStructure', e.target.value)}
                >
                  <option value="">Select legal structure</option>
                  <option value="private-limited">Private Limited Company</option>
                  <option value="llp">Limited Liability Partnership</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 1: // Project Details
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Project Title *</label>
              <Input
                placeholder="Enter your project title"
                value={applicationData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Project Description *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('projectDescription', 'Comprehensive project description')}
                  disabled={aiGenerating}
                >
                  {aiGenerating ? (
                    <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Brain className="w-3 h-3 mr-1" />
                  )}
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Describe your project in detail..."
                rows={4}
                value={applicationData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Problem Statement *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('problemStatement', 'Problem your project solves')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="What problem does your project solve?"
                rows={3}
                value={applicationData.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Solution *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('solution', 'Your innovative solution')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Describe your solution..."
                rows={3}
                value={applicationData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Innovation & Uniqueness</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('innovation', 'What makes your solution innovative')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="What makes your solution innovative and unique?"
                rows={3}
                value={applicationData.innovation}
                onChange={(e) => handleInputChange('innovation', e.target.value)}
              />
            </div>
          </div>
        )

      case 2: // Business Model
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Market Size & Opportunity</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('marketSize', 'Market size and opportunity analysis')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Describe the market size and opportunity..."
                rows={3}
                value={applicationData.marketSize}
                onChange={(e) => handleInputChange('marketSize', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Target Market</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('targetMarket', 'Target customer segments')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Who are your target customers?"
                rows={3}
                value={applicationData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Business Model</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('businessModel', 'How you make money')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="How does your business make money?"
                rows={3}
                value={applicationData.businessModel}
                onChange={(e) => handleInputChange('businessModel', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Competitive Advantage</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('competitiveAdvantage', 'What sets you apart from competitors')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="What is your competitive advantage?"
                rows={3}
                value={applicationData.competitiveAdvantage}
                onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
              />
            </div>
          </div>
        )

      case 3: // Financials
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Funding Amount Requested *</label>
                <Input
                  placeholder="e.g., ₹10 Lakhs"
                  value={applicationData.fundingAmount}
                  onChange={(e) => handleInputChange('fundingAmount', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Current Revenue</label>
                <Input
                  placeholder="e.g., ₹5 Lakhs annually"
                  value={applicationData.currentRevenue}
                  onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Use of Funds *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('useOfFunds', 'How you will use the grant money')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="How will you use the grant funds?"
                rows={4}
                value={applicationData.useOfFunds}
                onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Financial Projections</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('financialProjections', '3-year financial projections')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Provide 3-year financial projections..."
                rows={4}
                value={applicationData.financialProjections}
                onChange={(e) => handleInputChange('financialProjections', e.target.value)}
              />
            </div>
          </div>
        )

      case 4: // Team
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Team Details *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('teamDetails', 'Team composition and roles')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Describe your team composition, roles, and experience..."
                rows={4}
                value={applicationData.teamDetails}
                onChange={(e) => handleInputChange('teamDetails', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Key Personnel</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('keyPersonnel', 'Key team members and their backgrounds')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Highlight key team members and their backgrounds..."
                rows={3}
                value={applicationData.keyPersonnel}
                onChange={(e) => handleInputChange('keyPersonnel', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Advisors & Mentors</label>
              <Textarea
                placeholder="List any advisors, mentors, or board members..."
                rows={3}
                value={applicationData.advisors}
                onChange={(e) => handleInputChange('advisors', e.target.value)}
              />
            </div>
          </div>
        )

      case 5: // Implementation
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Project Timeline *</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('timeline', 'Project implementation timeline')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Provide a detailed project timeline..."
                rows={4}
                value={applicationData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Key Milestones</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('milestones', 'Key project milestones and deliverables')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="List key milestones and deliverables..."
                rows={3}
                value={applicationData.milestones}
                onChange={(e) => handleInputChange('milestones', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Expected Outcomes</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('expectedOutcomes', 'Expected project outcomes and impact')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="What outcomes do you expect from this project?"
                rows={3}
                value={applicationData.expectedOutcomes}
                onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">Social Impact</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAIGenerate('socialImpact', 'Social and economic impact of your project')}
                  disabled={aiGenerating}
                >
                  <Brain className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                placeholder="Describe the social and economic impact..."
                rows={3}
                value={applicationData.socialImpact}
                onChange={(e) => handleInputChange('socialImpact', e.target.value)}
              />
            </div>
          </div>
        )

      case 6: // Documents
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload all required documents. Ensure files are in PDF format and under 10MB each.
              </AlertDescription>
            </Alert>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Required Documents</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {grant?.requirements.map((req, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>

            {applicationData.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                <div className="space-y-2">
                  {applicationData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (!grant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grant details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Grant Application</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1 text-blue-600" />
                {grant.title}
              </div>
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-1 text-green-600" />
                {grant.provider}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-orange-600" />
                Deadline: {new Date(grant.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Target className="w-3 h-3 mr-1" />
              {grant.successRate}% Success Rate
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Application Progress</span>
            <span className="text-sm text-gray-600">{Math.round(completionProgress)}% Complete</span>
          </div>
          <Progress value={completionProgress} className="h-2" />
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Steps Sidebar */}
          <div className="w-64 bg-gray-50 border-r p-4 overflow-y-auto">
            <div className="space-y-2">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = step.id < currentStep
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                        : isCompleted
                        ? 'bg-green-50 text-green-800 hover:bg-green-100'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-75">
                        {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  {currentStep === 0 && "Provide basic information about your company"}
                  {currentStep === 1 && "Describe your project in detail"}
                  {currentStep === 2 && "Explain your business model and market"}
                  {currentStep === 3 && "Provide financial information and projections"}
                  {currentStep === 4 && "Tell us about your team"}
                  {currentStep === 5 && "Outline your implementation plan"}
                  {currentStep === 6 && "Upload required documents"}
                </p>
              </div>

              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || completionProgress < 80}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}