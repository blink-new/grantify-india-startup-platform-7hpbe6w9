import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, ArrowRight, Building, Users, MapPin, Calendar, DollarSign, Lightbulb } from 'lucide-react'
import { blink } from '@/blink/client'

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

interface ProfileSetupProps {
  onComplete: (profile: StartupProfile) => void
}

export function StartupProfileSetup({ onComplete }: ProfileSetupProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<StartupProfile>({
    companyName: '',
    industry: '',
    stage: '',
    location: '',
    description: '',
    teamSize: 1,
    fundingRaised: 0,
    revenue: 0,
    website: '',
    foundedYear: new Date().getFullYear(),
    legalStructure: '',
    registrationNumber: '',
    documents: [],
    keyProducts: '',
    targetMarket: '',
    competitiveAdvantage: '',
    fundingNeeds: '',
    useOfFunds: ''
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const industries = [
    'Technology', 'Healthcare', 'Fintech', 'E-commerce', 'Manufacturing',
    'Agriculture', 'Education', 'Clean Energy', 'Food & Beverage', 'Logistics',
    'Real Estate', 'Media & Entertainment', 'Travel & Tourism', 'Fashion',
    'Automotive', 'Biotechnology', 'Aerospace', 'Other'
  ]

  const stages = [
    'Idea Stage', 'Prototype', 'MVP', 'Early Revenue', 'Growth Stage', 'Scaling'
  ]

  const legalStructures = [
    'Private Limited Company', 'Limited Liability Partnership (LLP)', 
    'Partnership Firm', 'Sole Proprietorship', 'One Person Company (OPC)'
  ]

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 
    'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Other'
  ]

  const handleInputChange = (field: keyof StartupProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setLoading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const { publicUrl } = await blink.storage.upload(
          file,
          `startup-documents/${Date.now()}-${file.name}`,
          { upsert: true }
        )
        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setProfile(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Upload error:', error)
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
      // Save profile and trigger AI analysis
      onComplete(profile)
    } catch (error) {
      console.error('Profile submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
              <p className="text-gray-600">Tell us about your startup</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={profile.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={profile.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="stage">Business Stage *</Label>
                <Select value={profile.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage.toLowerCase()}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Select value={profile.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={profile.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                  placeholder="2024"
                  className="mt-1"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Company Description *</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what your company does, your mission, and key products/services..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
              <p className="text-gray-600">Help us understand your business better</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={profile.teamSize}
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value))}
                  placeholder="5"
                  className="mt-1"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="legalStructure">Legal Structure</Label>
                <Select value={profile.legalStructure} onValueChange={(value) => handleInputChange('legalStructure', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select legal structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalStructures.map((structure) => (
                      <SelectItem key={structure} value={structure.toLowerCase()}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={profile.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="CIN/LLP/Partnership registration number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fundingRaised">Previous Funding Raised (₹)</Label>
                <Input
                  id="fundingRaised"
                  type="number"
                  value={profile.fundingRaised}
                  onChange={(e) => handleInputChange('fundingRaised', parseFloat(e.target.value))}
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="revenue">Annual Revenue (₹)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={profile.revenue}
                  onChange={(e) => handleInputChange('revenue', parseFloat(e.target.value))}
                  placeholder="0"
                  className="mt-1"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="keyProducts">Key Products/Services</Label>
              <Textarea
                id="keyProducts"
                value={profile.keyProducts}
                onChange={(e) => handleInputChange('keyProducts', e.target.value)}
                placeholder="Describe your main products or services..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                value={profile.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                placeholder="Who are your customers? What market do you serve?"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Lightbulb className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Competitive Edge & Funding</h2>
              <p className="text-gray-600">What makes you unique and what funding do you need?</p>
            </div>

            <div>
              <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
              <Textarea
                id="competitiveAdvantage"
                value={profile.competitiveAdvantage}
                onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                placeholder="What makes your startup unique? What's your competitive moat?"
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="fundingNeeds">Funding Requirements</Label>
              <Textarea
                id="fundingNeeds"
                value={profile.fundingNeeds}
                onChange={(e) => handleInputChange('fundingNeeds', e.target.value)}
                placeholder="How much funding do you need and for what stage of growth?"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="useOfFunds">Use of Funds</Label>
              <Textarea
                id="useOfFunds"
                value={profile.useOfFunds}
                onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
                placeholder="How will you use the grant money? (e.g., product development, marketing, hiring, equipment)"
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Supporting Documents</h2>
              <p className="text-gray-600">Upload any relevant documents to strengthen your profile</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-900 mb-2">Upload Documents</p>
                <p className="text-gray-600 text-sm">
                  Business plan, pitch deck, financial statements, certificates, etc.
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" disabled={loading}>
                  {loading ? 'Uploading...' : 'Choose Files'}
                </Button>
              </label>
            </div>

            {profile.documents.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Uploaded Documents:</h3>
                {profile.documents.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 truncate">
                      Document {index + 1}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Recommended Documents:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Business Plan or Executive Summary</li>
                <li>• Pitch Deck (if available)</li>
                <li>• Financial Statements or Projections</li>
                <li>• Company Registration Certificate</li>
                <li>• DPIIT Recognition Certificate (if applicable)</li>
                <li>• Product Demo or Prototype Images</li>
                <li>• Team Member CVs</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Setup Your Startup Profile</h1>
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
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={
                    (currentStep === 1 && (!profile.companyName || !profile.industry || !profile.stage || !profile.location || !profile.description)) ||
                    loading
                  }
                >
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Analyzing Profile...' : 'Complete Setup'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}