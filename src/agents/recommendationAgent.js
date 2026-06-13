import { generateRecommendationsWithGemini } from '../services/geminiService.js';
import { getMatchBadge, generateWhyRecommended, generateRecommendedActions } from '../utils/scoring.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildFallbackRecommendations(userProfile, matches, opportunities) {
  const ranked = matches.slice(0, 10).map((match, index) => {
    const opp = opportunities.find((o) => o.id === match.opportunityId);
    if (!opp) return null;
    return {
      opportunityId: match.opportunityId,
      rank: index + 1,
      score: match.score,
      badge: getMatchBadge(match.score),
      whyRecommended: generateWhyRecommended(userProfile, match, opp),
      recommendedActions: generateRecommendedActions(match, opp),
      personalizedInsight: `Match score of ${match.score}% for "${opp.title}" based on skill compatibility and goals.`,
      relevanceAnalysis: match.relevanceAnalysis,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
    };
  }).filter(Boolean);

  return {
    rankedOpportunities: ranked,
    overallInsights: `Found ${matches.length} opportunities matching your profile. Your strongest areas are ${userProfile.skills.slice(0, 3).join(', ')}.`,
    nextBestAction: matches[0]
      ? `Apply to ${opportunities.find((o) => o.id === matches[0].opportunityId)?.title || 'your top match'} — highest compatibility at ${matches[0].score}%.`
      : 'No recommendations available at this time.',
  };
}

/**
 * Recommendation Agent — ranks opportunities and generates personalized insights via Gemini.
 */
export async function runRecommendationAgent(userProfile, matches, opportunities) {
  await delay(1500);

  const geminiResult = await generateRecommendationsWithGemini(userProfile, matches, opportunities);
  const fallback = buildFallbackRecommendations(userProfile, matches, opportunities);

  if (!geminiResult) {
    return {
      agent: 'Recommendation Agent',
      status: 'complete',
      timestamp: new Date().toISOString(),
      output: { ...fallback, source: 'local' },
    };
  }

  const enrichedRanked = geminiResult.rankedOpportunities.map((rec) => {
    const match = matches.find((m) => m.opportunityId === rec.opportunityId);
    return {
      ...rec,
      score: match?.score ?? 0,
      badge: getMatchBadge(match?.score ?? 0),
      relevanceAnalysis: match?.relevanceAnalysis ?? '',
      matchedSkills: match?.matchedSkills ?? [],
      missingSkills: match?.missingSkills ?? [],
    };
  });

  return {
    agent: 'Recommendation Agent',
    status: 'complete',
    timestamp: new Date().toISOString(),
    output: {
      rankedOpportunities: enrichedRanked,
      overallInsights: geminiResult.overallInsights,
      nextBestAction: geminiResult.nextBestAction,
      source: 'gemini',
    },
  };
}
