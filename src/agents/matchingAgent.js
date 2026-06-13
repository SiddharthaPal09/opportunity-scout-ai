import { computeBaseMatchScore } from '../utils/scoring.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Matching Agent — compares user profile against opportunities and generates match scores.
 */
export async function runMatchingAgent(userProfile, discoveredOpportunities) {
  await delay(1200);

  const matches = discoveredOpportunities.map((opportunity) => {
    const result = computeBaseMatchScore(userProfile, opportunity);
    return {
      opportunityId: opportunity.id,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      relevanceAnalysis: `Skill overlap at ${result.relevanceFactors.skillOverlap}%. ${
        result.relevanceFactors.interestAlignment ? 'Strong interest alignment detected.' : 'Moderate interest alignment.'
      } ${result.relevanceFactors.experienceLevelFit ? 'Experience level is a good fit.' : 'Consider building foundational skills.'}`,
      relevanceFactors: result.relevanceFactors,
    };
  });

  matches.sort((a, b) => b.score - a.score);

  return {
    agent: 'Matching Agent',
    status: 'complete',
    timestamp: new Date().toISOString(),
    output: {
      totalMatched: matches.length,
      matches,
      averageScore: Math.round(matches.reduce((sum, m) => sum + m.score, 0) / matches.length),
      topMatch: matches[0] ?? null,
    },
  };
}
