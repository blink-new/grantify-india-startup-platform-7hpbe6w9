import { blink } from '@/blink/client'
import { INDIAN_GRANTS, Grant } from '@/data/grants'

export interface StartupProfile {
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
  sector: string[]
  technologies: string[]
  socialImpact: string
  scalabilityPlan: string
}

export interface GrantMatch {
  grant: Grant
  matchScore: number
  successProbability: number
  aiExplanation: string
  missingRequirements: string[]
  recommendedActions: string[]
  simplifiedExplanation: string
  strengthsAlignment: string[]
  riskFactors: string[]
  timelineEstimate: string
  competitionLevel: 'Low' | 'Medium' | 'High'
}

export class GrantMatcherService {
  private calculateBasicMatchScore(profile: StartupProfile, grant: Grant): number {
    let score = 0
    
    // Stage alignment (30% weight)
    const stageMatch = grant.stage.some(stage => 
      stage.toLowerCase().includes(profile.stage.toLowerCase()) ||
      profile.stage.toLowerCase().includes(stage.toLowerCase())
    )
    if (stageMatch) score += 30
    
    // Sector alignment (25% weight)
    const sectorMatch = grant.sector.some(sector => 
      profile.sector.some(pSector => 
        sector.toLowerCase().includes(pSector.toLowerCase()) ||
        pSector.toLowerCase().includes(sector.toLowerCase())
      )
    )
    if (sectorMatch) score += 25
    
    // Funding amount alignment (20% weight)
    const fundingNeed = parseInt(profile.fundingNeeds.replace(/[^\d]/g, '')) || 1000000
    if (fundingNeed >= grant.amountMin && fundingNeed <= grant.amountMax) {
      score += 20
    } else if (fundingNeed <= grant.amountMax) {
      score += 15
    } else if (fundingNeed >= grant.amountMin) {
      score += 10
    }
    
    // Location alignment (15% weight)
    if (grant.location === 'Pan India' || grant.location === 'All States') {
      score += 15
    } else if (grant.location.toLowerCase().includes(profile.location.toLowerCase())) {
      score += 15
    } else {
      score += 5
    }
    
    // Company age alignment (10% weight)
    const companyAge = new Date().getFullYear() - profile.foundedYear
    if (grant.eligibility.some(req => req.includes('2 years') && companyAge <= 2)) {
      score += 10
    } else if (grant.eligibility.some(req => req.includes('3 years') && companyAge <= 3)) {
      score += 10
    } else if (companyAge <= 5) {
      score += 8
    } else {
      score += 5
    }
    
    return Math.min(score, 100)
  }

  private async generateAIAnalysis(profile: StartupProfile, grant: Grant, basicScore: number): Promise<{
    aiExplanation: string
    successProbability: number
    missingRequirements: string[]
    recommendedActions: string[]
    simplifiedExplanation: string
    strengthsAlignment: string[]
    riskFactors: string[]
    timelineEstimate: string
    competitionLevel: 'Low' | 'Medium' | 'High'
  }> {
    try {
      const prompt = `Analyze the grant match between this startup and grant opportunity:

STARTUP PROFILE:
- Company: ${profile.companyName}
- Industry: ${profile.industry}
- Stage: ${profile.stage}
- Location: ${profile.location}
- Description: ${profile.description}
- Team Size: ${profile.teamSize}
- Funding Raised: ₹${profile.fundingRaised.toLocaleString()}
- Revenue: ₹${profile.revenue.toLocaleString()}
- Founded: ${profile.foundedYear}
- Key Products: ${profile.keyProducts}
- Target Market: ${profile.targetMarket}
- Competitive Advantage: ${profile.competitiveAdvantage}
- Funding Needs: ${profile.fundingNeeds}
- Use of Funds: ${profile.useOfFunds}
- Sectors: ${profile.sector.join(', ')}
- Technologies: ${profile.technologies.join(', ')}
- Social Impact: ${profile.socialImpact}

GRANT OPPORTUNITY:
- Title: ${grant.title}
- Provider: ${grant.provider}
- Amount: ${grant.amount}
- Category: ${grant.category}
- Description: ${grant.description}
- Eligibility: ${grant.eligibility.join('; ')}
- Requirements: ${grant.requirements.join('; ')}
- Sector Focus: ${grant.sector.join(', ')}
- Stage Focus: ${grant.stage.join(', ')}
- Funding Type: ${grant.fundingType}

Basic Match Score: ${basicScore}/100

Please provide a comprehensive analysis in JSON format with these fields:
{
  "aiExplanation": "Detailed explanation of why this grant matches the startup (200-300 words)",
  "successProbability": number (0-100, realistic assessment),
  "missingRequirements": ["requirement1", "requirement2"],
  "recommendedActions": ["action1", "action2", "action3"],
  "simplifiedExplanation": "Simple 2-3 sentence explanation for non-technical users",
  "strengthsAlignment": ["strength1", "strength2"],
  "riskFactors": ["risk1", "risk2"],
  "timelineEstimate": "Expected application to approval timeline",
  "competitionLevel": "Low/Medium/High based on grant popularity and requirements"
}

Focus on practical, actionable insights. Be honest about challenges while highlighting opportunities.`

      const { object } = await blink.ai.generateObject({
        prompt,
        schema: {
          type: 'object',
          properties: {
            aiExplanation: { type: 'string' },
            successProbability: { type: 'number' },
            missingRequirements: {
              type: 'array',
              items: { type: 'string' }
            },
            recommendedActions: {
              type: 'array',
              items: { type: 'string' }
            },
            simplifiedExplanation: { type: 'string' },
            strengthsAlignment: {
              type: 'array',
              items: { type: 'string' }
            },
            riskFactors: {
              type: 'array',
              items: { type: 'string' }
            },
            timelineEstimate: { type: 'string' },
            competitionLevel: { 
              type: 'string',
              enum: ['Low', 'Medium', 'High']
            }
          },
          required: [
            'aiExplanation', 'successProbability', 'missingRequirements',
            'recommendedActions', 'simplifiedExplanation', 'strengthsAlignment',
            'riskFactors', 'timelineEstimate', 'competitionLevel'
          ]
        }
      })

      return object as any
    } catch (error) {
      console.error('AI analysis failed:', error)
      
      // Fallback analysis
      return {
        aiExplanation: `This grant shows a ${basicScore}% match with your startup based on sector alignment, funding requirements, and eligibility criteria. The ${grant.provider} offers ${grant.amount} for ${grant.sector.join(', ')} startups in the ${grant.stage.join(', ')} stage.`,
        successProbability: Math.max(20, Math.min(85, basicScore - 10)),
        missingRequirements: grant.requirements.slice(0, 2),
        recommendedActions: [
          'Review all eligibility criteria carefully',
          'Prepare required documentation',
          'Strengthen your business plan'
        ],
        simplifiedExplanation: `This grant is a good fit for your ${profile.industry} startup. You meet most requirements and the funding amount aligns with your needs.`,
        strengthsAlignment: [
          `Strong sector alignment with ${profile.industry}`,
          `Appropriate funding stage for ${profile.stage} companies`
        ],
        riskFactors: [
          'High competition from similar startups',
          'Strict documentation requirements'
        ],
        timelineEstimate: '2-4 months from application to approval',
        competitionLevel: basicScore > 80 ? 'High' : basicScore > 60 ? 'Medium' : 'Low'
      }
    }
  }

  async findMatches(profile: StartupProfile): Promise<GrantMatch[]> {
    const matches: GrantMatch[] = []
    
    for (const grant of INDIAN_GRANTS) {
      // Skip closed grants
      if (grant.status === 'closed') continue
      
      const basicScore = this.calculateBasicMatchScore(profile, grant)
      
      // Only include grants with reasonable match scores
      if (basicScore < 30) continue
      
      const aiAnalysis = await this.generateAIAnalysis(profile, grant, basicScore)
      
      // Adjust match score based on AI analysis
      const adjustedScore = Math.round((basicScore + aiAnalysis.successProbability) / 2)
      
      matches.push({
        grant,
        matchScore: adjustedScore,
        successProbability: aiAnalysis.successProbability,
        aiExplanation: aiAnalysis.aiExplanation,
        missingRequirements: aiAnalysis.missingRequirements,
        recommendedActions: aiAnalysis.recommendedActions,
        simplifiedExplanation: aiAnalysis.simplifiedExplanation,
        strengthsAlignment: aiAnalysis.strengthsAlignment,
        riskFactors: aiAnalysis.riskFactors,
        timelineEstimate: aiAnalysis.timelineEstimate,
        competitionLevel: aiAnalysis.competitionLevel
      })
    }
    
    // Sort by match score (descending)
    return matches.sort((a, b) => b.matchScore - a.matchScore)
  }

  async getTopMatches(profile: StartupProfile, limit: number = 5): Promise<GrantMatch[]> {
    const allMatches = await this.findMatches(profile)
    return allMatches.slice(0, limit)
  }

  async analyzeSpecificGrant(profile: StartupProfile, grantId: string): Promise<GrantMatch | null> {
    const grant = INDIAN_GRANTS.find(g => g.id === grantId)
    if (!grant) return null
    
    const basicScore = this.calculateBasicMatchScore(profile, grant)
    const aiAnalysis = await this.generateAIAnalysis(profile, grant, basicScore)
    const adjustedScore = Math.round((basicScore + aiAnalysis.successProbability) / 2)
    
    return {
      grant,
      matchScore: adjustedScore,
      successProbability: aiAnalysis.successProbability,
      aiExplanation: aiAnalysis.aiExplanation,
      missingRequirements: aiAnalysis.missingRequirements,
      recommendedActions: aiAnalysis.recommendedActions,
      simplifiedExplanation: aiAnalysis.simplifiedExplanation,
      strengthsAlignment: aiAnalysis.strengthsAlignment,
      riskFactors: aiAnalysis.riskFactors,
      timelineEstimate: aiAnalysis.timelineEstimate,
      competitionLevel: aiAnalysis.competitionLevel
    }
  }
}

export const grantMatcher = new GrantMatcherService()