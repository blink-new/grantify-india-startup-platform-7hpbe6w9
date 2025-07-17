import { useState, useEffect } from 'react'
import { StartupProfileSetup } from '@/components/StartupProfileSetup'
import { GrantMatcher } from '@/components/GrantMatcher'
import { ApplicationBuilder } from '@/components/ApplicationBuilder'
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

type AppStep = 'profile' | 'matching' | 'application' | 'success'

export function KhojApp() {
  const [currentStep, setCurrentStep] = useState<AppStep>('profile')
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<GrantMatch | null>(null)
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)

  const handleProfileComplete = (profileData: StartupProfile) => {
    setProfile(profileData)
    setCurrentStep('matching')
  }

  const handleGrantSelect = (match: GrantMatch) => {
    setSelectedMatch(match)
    setCurrentStep('application')
  }

  const handleApplicationSubmit = async (appData: ApplicationData) => {
    setApplicationData(appData)
    
    // Here you would typically save to database and submit to the grant provider
    try {
      // Save application to database (when available)
      console.log('Application submitted:', {
        profile,
        grant: selectedMatch?.grant,
        applicationData: appData
      })
      
      // Generate step-by-step application guide
      if (selectedMatch) {
        const { text } = await blink.ai.generateText({
          prompt: `Create a detailed, step-by-step application guide for ${profile?.companyName} to apply for ${selectedMatch.grant.title}.

Grant Details:
- Provider: ${selectedMatch.grant.provider}
- Application URL: ${selectedMatch.grant.applicationUrl}
- Requirements: ${selectedMatch.grant.requirements.join(', ')}
- Process: ${selectedMatch.grant.applicationProcess}

Startup Profile:
- Company: ${profile?.companyName}
- Industry: ${profile?.industry}
- Stage: ${profile?.stage}

Please provide:
1. Exact steps to follow on the official website
2. Documents to prepare and how to format them
3. Common mistakes to avoid
4. Tips for increasing success chances
5. Timeline expectations
6. Follow-up actions

Make it actionable and specific to this grant and startup.`,
          model: 'gpt-4o'
        })
        
        console.log('Application guide generated:', text)
      }
      
      setCurrentStep('success')
    } catch (error) {
      console.error('Application submission error:', error)
    }
  }

  const handleBackToMatching = () => {
    setSelectedMatch(null)
    setCurrentStep('matching')
  }

  const handleStartOver = () => {
    setProfile(null)
    setSelectedMatch(null)
    setApplicationData(null)
    setCurrentStep('profile')
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'profile':
        return <StartupProfileSetup onComplete={handleProfileComplete} />
      
      case 'matching':
        return profile ? (
          <GrantMatcher 
            profile={profile} 
            onSelectGrant={handleGrantSelect}
          />
        ) : null
      
      case 'application':
        return profile && selectedMatch ? (
          <ApplicationBuilder
            grantMatch={selectedMatch}
            profile={profile}
            onSubmit={handleApplicationSubmit}
            onBack={handleBackToMatching}
          />
        ) : null
      
      case 'success':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center px-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Ready for Submission!
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Your AI-crafted application for <strong>{selectedMatch?.grant.title}</strong> is complete. 
                Follow the step-by-step guide below to submit it officially.
              </p>
              
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps:</h2>
                <div className="space-y-4">
                  {selectedMatch?.grant.applicationProcess.split('\n').map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step.replace(/^Step \d+: /, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open(selectedMatch?.grant.applicationUrl, '_blank')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply on Official Website
                </button>
                <button
                  onClick={handleStartOver}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Find More Grants
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Success Probability:</strong> {selectedMatch?.successProbability}% based on AI analysis
                </p>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return renderCurrentStep()
}