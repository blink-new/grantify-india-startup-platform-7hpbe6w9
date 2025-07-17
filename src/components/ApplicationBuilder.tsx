import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  Clock,
  Target,
  DollarSign,
  Users,
  Lightbulb,
  Send
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Grant {
  id: string
  title: string
  provider: string
  amountMin: number
  amountMax: number
  deadline: string
  eligibility: string[]
  category: string
  description: string
  location: string
  applicationUrl: string
  requirements: string[]
  applicationProcess: string
  sourceUrl: string
}

interface GrantMatch {
  grant: Grant
  matchScore: number
  successProbability: number
  aiExplanation: string
  missingRequirements: string[]
  recommendedActions: string[]
  simplifiedExplanation: string
}

interface StartupProfile {
  companyName: string
  industry: string
  stage: string
  location: string
  description: string
  teamSize: number
  fundingRaised: number
  revenue: number
  website: string
  foundedYear: number
  legalStructure: string
  registrationNumber: string
  documents: string[]
  keyProducts: string
  targetMarket: string
  competitiveAdvantage: string
  fundingNeeds: string
  useOfFunds: string
}

interface ApplicationData {
  projectTitle: string
  projectDescription: string
  problemStatement: string
  solution: string
  marketSize: string
  businessModel: string
  competitiveAnalysis: string
  teamDetails: string
  financialProjections: string
  fundingAmount: string
  useOfFunds: string
  timeline: string
  expectedOutcomes: string
  socialImpact: string
  scalabilityPlan: string
}

interface ApplicationBuilderProps {
  grantMatch: GrantMatch
  profile: StartupProfile
  onSubmit: (applicationData: ApplicationData) => void
  onBack: () => void
}

export function ApplicationBuilder({ grantMatch, profile, onSubmit, onBack }: ApplicationBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    projectTitle: '',
    projectDescription: '',
    problemStatement: '',
    solution: '',
    marketSize: '',
    businessModel: '',
    competitiveAnalysis: '',
    teamDetails: '',
    financialProjections: '',
    fundingAmount: '',
    useOfFunds: '',
    timeline: '',
    expectedOutcomes: '',
    socialImpact: '',
    scalabilityPlan: ''
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  useEffect(() => {
    // Pre-populate with AI-generated content
    generateInitialContent()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const generateInitialContent = async () => {
    setAiGenerating(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Generate a comprehensive grant application for the following startup and grant opportunity. Use the startup's profile to create compelling, specific content.

Startup Profile:
- Company: ${profile.companyName}
- Industry: ${profile.industry}
- Stage: ${profile.stage}
- Description: ${profile.description}
- Key Products: ${profile.keyProducts}
- Target Market: ${profile.targetMarket}
- Competitive Advantage: ${profile.competitiveAdvantage}
- Funding Needs: ${profile.fundingNeeds}
- Use of Funds: ${profile.useOfFunds}

Grant Details:
- Title: ${grantMatch.grant.title}
- Provider: ${grantMatch.grant.provider}
- Amount: ₹${grantMatch.grant.amountMin.toLocaleString()} - ₹${grantMatch.grant.amountMax.toLocaleString()}
- Description: ${grantMatch.grant.description}
- Eligibility: ${grantMatch.grant.eligibility.join(', ')}

Please generate content for each section. Make it compelling, specific, and tailored to this grant opportunity. Format as JSON:

{
  "projectTitle": "Compelling project title",
  "projectDescription": "Detailed project description (200-300 words)",
  "problemStatement": "Clear problem statement (150-200 words)",
  "solution": "Innovative solution description (200-250 words)",
  "marketSize": "Market size and opportunity analysis (150-200 words)",
  "businessModel": "Business model explanation (150-200 words)",
  "competitiveAnalysis": "Competitive landscape analysis (150-200 words)",
  "teamDetails": "Team capabilities and experience (150-200 words)",
  "financialProjections": "Financial projections and milestones (200-250 words)",
  "fundingAmount": "Specific funding amount requested",
  "useOfFunds": "Detailed breakdown of fund utilization (200-250 words)",
  "timeline": "Project timeline and milestones (150-200 words)",
  "expectedOutcomes": "Expected outcomes and impact (150-200 words)",
  "socialImpact": "Social and economic impact (150-200 words)",
  "scalabilityPlan": "Scalability and growth plan (150-200 words)"
}`,
        model: 'gpt-4o'
      })

      try {
        const generatedContent = JSON.parse(text)
        setApplicationData(generatedContent)
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        // Fallback with basic content
        setApplicationData(prev => ({
          ...prev,
          projectTitle: `${profile.companyName} - ${grantMatch.grant.title} Application`,
          projectDescription: profile.description,
          useOfFunds: profile.useOfFunds,
          fundingAmount: `₹${Math.min(grantMatch.grant.amountMax, 1000000).toLocaleString()}`
        }))
      }
    } catch (error) {
      console.error('AI generation error:', error)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }))
  }

  const enhanceWithAI = async (field: keyof ApplicationData) => {
    setLoading(true)
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Enhance this ${field} for a grant application. Make it more compelling and specific for ${grantMatch.grant.title} from ${grantMatch.grant.provider}.

Current content: ${applicationData[field]}

Startup context:
- Company: ${profile.companyName}
- Industry: ${profile.industry}
- Description: ${profile.description}

Please provide an enhanced version that is more compelling, specific, and tailored to this grant opportunity. Keep it professional and factual.`,
        model: 'gpt-4o-mini'
      })

      handleInputChange(field, text.trim())
    } catch (error) {
      console.error('AI enhancement error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      onSubmit(applicationData)
    } catch (error) {
      console.error('Application submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Overview</h2>
              <p className="text-gray-600">Define your project and its core objectives</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('projectTitle')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Input
                  id="projectTitle"
                  value={applicationData.projectTitle}
                  onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                  placeholder="Enter a compelling project title"
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('projectDescription')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="projectDescription"
                  value={applicationData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="Provide a comprehensive overview of your project..."
                  rows={6}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {applicationData.projectDescription.length} characters
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="problemStatement">Problem Statement *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('problemStatement')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="problemStatement"
                  value={applicationData.problemStatement}
                  onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                  placeholder="Clearly define the problem your project addresses..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="solution">Solution *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('solution')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="solution"
                  value={applicationData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="Describe your innovative solution..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Market & Business Model</h2>
              <p className="text-gray-600">Demonstrate market opportunity and business viability</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="marketSize">Market Size & Opportunity *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('marketSize')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="marketSize"
                  value={applicationData.marketSize}
                  onChange={(e) => handleInputChange('marketSize', e.target.value)}
                  placeholder="Analyze the market size, growth potential, and opportunity..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="businessModel">Business Model *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('businessModel')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="businessModel"
                  value={applicationData.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  placeholder="Explain how your business generates revenue..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="competitiveAnalysis">Competitive Analysis *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('competitiveAnalysis')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="competitiveAnalysis"
                  value={applicationData.competitiveAnalysis}
                  onChange={(e) => handleInputChange('competitiveAnalysis', e.target.value)}
                  placeholder="Analyze your competitive landscape and advantages..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="teamDetails">Team Details *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('teamDetails')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="teamDetails"
                  value={applicationData.teamDetails}
                  onChange={(e) => handleInputChange('teamDetails', e.target.value)}
                  placeholder="Highlight your team's expertise and capabilities..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Planning</h2>
              <p className="text-gray-600">Detail your funding requirements and financial projections</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="fundingAmount">Funding Amount Requested *</Label>
                <Input
                  id="fundingAmount"
                  value={applicationData.fundingAmount}
                  onChange={(e) => handleInputChange('fundingAmount', e.target.value)}
                  placeholder="₹10,00,000"
                  className="text-lg font-medium"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Grant range: ₹{grantMatch.grant.amountMin.toLocaleString()} - ₹{grantMatch.grant.amountMax.toLocaleString()}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="useOfFunds">Use of Funds *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('useOfFunds')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="useOfFunds"
                  value={applicationData.useOfFunds}
                  onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
                  placeholder="Provide a detailed breakdown of how funds will be utilized..."
                  rows={5}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="financialProjections">Financial Projections *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('financialProjections')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="financialProjections"
                  value={applicationData.financialProjections}
                  onChange={(e) => handleInputChange('financialProjections', e.target.value)}
                  placeholder="Include revenue projections, key milestones, and ROI expectations..."
                  rows={5}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Impact</h2>
              <p className="text-gray-600">Define your project timeline and expected outcomes</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('timeline')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="timeline"
                  value={applicationData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  placeholder="Outline key milestones and timeline for project execution..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('expectedOutcomes')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="expectedOutcomes"
                  value={applicationData.expectedOutcomes}
                  onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
                  placeholder="Describe the expected outcomes and measurable impact..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="socialImpact">Social & Economic Impact *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('socialImpact')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="socialImpact"
                  value={applicationData.socialImpact}
                  onChange={(e) => handleInputChange('socialImpact', e.target.value)}
                  placeholder="Explain the broader social and economic impact of your project..."
                  rows={4}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="scalabilityPlan">Scalability Plan *</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('scalabilityPlan')}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Enhance with AI
                  </Button>
                </div>
                <Textarea
                  id="scalabilityPlan"
                  value={applicationData.scalabilityPlan}
                  onChange={(e) => handleInputChange('scalabilityPlan', e.target.value)}
                  placeholder="Describe how you plan to scale and grow the project..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-600">Review your application before submission</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Application Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Grant:</span>
                  <p className="text-blue-700">{grantMatch.grant.title}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Provider:</span>
                  <p className="text-blue-700">{grantMatch.grant.provider}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Funding Requested:</span>
                  <p className="text-blue-700">{applicationData.fundingAmount}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Success Probability:</span>
                  <p className="text-blue-700">{grantMatch.successProbability}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Application Sections:</h3>
              {[
                { label: 'Project Title', value: applicationData.projectTitle },
                { label: 'Project Description', value: applicationData.projectDescription },
                { label: 'Problem Statement', value: applicationData.problemStatement },
                { label: 'Solution', value: applicationData.solution },
                { label: 'Market Size', value: applicationData.marketSize },
                { label: 'Business Model', value: applicationData.businessModel },
                { label: 'Use of Funds', value: applicationData.useOfFunds }
              ].map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{section.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {section.value.length} chars
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{section.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-800 mb-2">Next Steps After Submission:</h3>
              <div className="text-sm text-amber-700 space-y-1">
                {grantMatch.grant.applicationProcess.split('\n').map((step, index) => (
                  <p key={index}>• {step.replace(/^Step \d+: /, '')}</p>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (aiGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI is crafting your application...</h2>
          <p className="text-gray-600 mb-4">Analyzing your profile and generating tailored content</p>
          <Progress value={60} className="w-64 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Grant Application Builder</h1>
              <p className="text-gray-600">{grantMatch.grant.title}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onBack}>
                  Back to Matches
                </Button>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}