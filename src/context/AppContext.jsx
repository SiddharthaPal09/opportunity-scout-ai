import { createContext, useContext, useState, useCallback } from 'react';
import { DEFAULT_USER_PROFILE } from '../data/opportunities.js';
import { runDiscoveryAgent } from '../agents/discoveryAgent.js';
import { runProfileAgent } from '../agents/profileAgent.js';
import { runMatchingAgent } from '../agents/matchingAgent.js';
import { runRecommendationAgent } from '../agents/recommendationAgent.js';
import { runNotificationAgent } from '../agents/notificationAgent.js';
import { enrichOpportunityWithGemini } from '../services/geminiService.js';
import { computeReadinessScore, buildLearningRoadmap, getMatchBadge, computeBaseMatchScore, generateWhyRecommended, generateRecommendedActions } from '../utils/scoring.js';
import { getOpportunityById } from '../data/opportunities.js';

const AppContext = createContext(null);

const AGENT_STEPS = [
  { id: 'discovery', label: 'Discovery Agent', description: 'Scanning local opportunity dataset...' },
  { id: 'profile', label: 'Profile Analysis Agent', description: 'Analyzing your skills and career goals...' },
  { id: 'matching', label: 'Matching Agent', description: 'Computing compatibility scores...' },
  { id: 'recommendation', label: 'Recommendation Agent', description: 'Ranking opportunities with AI insights...' },
  { id: 'notification', label: 'Notification Agent', description: 'Generating alerts and daily summary...' },
];

export function AppProvider({ children }) {
  const [userProfile, setUserProfile] = useState(DEFAULT_USER_PROFILE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFinding, setIsFinding] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState(null);
  const [discoveredOpportunities, setDiscoveredOpportunities] = useState([]);

  const getOppById = useCallback((id) => {
    return discoveredOpportunities.find((o) => o.id === id) || getOpportunityById(id);
  }, [discoveredOpportunities]);

  const addUserSkills = useCallback((newSkills) => {
    setUserProfile((prev) => {
      const updatedSkills = [...prev.skills];
      newSkills.forEach((skill) => {
        const trimmed = skill.trim();
        if (trimmed && !updatedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
          updatedSkills.push(trimmed);
        }
      });
      const updatedProfile = {
        ...prev,
        skills: updatedSkills,
      };

      setMatches((prevMatches) => {
        if (!prevMatches || prevMatches.length === 0) return prevMatches;
        const updated = prevMatches.map((match) => {
          const opportunity = getOppById(match.opportunityId);
          if (!opportunity) return match;
          const result = computeBaseMatchScore(updatedProfile, opportunity);
          return {
            ...match,
            score: result.score,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            relevanceAnalysis: `Skill overlap at ${result.relevanceFactors.skillOverlap}%. ${
              result.relevanceFactors.interestAlignment ? 'Strong interest alignment detected.' : 'Moderate interest alignment.'
            } ${result.relevanceFactors.experienceLevelFit ? 'Experience level is a good fit.' : 'Consider building foundational skills.'}`,
            relevanceFactors: result.relevanceFactors,
          };
        });
        return updated.sort((a, b) => b.score - a.score);
      });

      setRecommendations((prevRecs) => {
        if (!prevRecs || !prevRecs.rankedOpportunities) return prevRecs;
        const updatedRanked = prevRecs.rankedOpportunities.map((rec) => {
          const opportunity = getOppById(rec.opportunityId);
          if (!opportunity) return rec;
          const result = computeBaseMatchScore(updatedProfile, opportunity);
          return {
            ...rec,
            score: result.score,
            badge: getMatchBadge(result.score),
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            whyRecommended: `This ${opportunity.category.toLowerCase()} aligns with your career interests. Your ${result.matchedSkills.slice(0, 2).join(' and ')} skills provide a strong foundation, with ${result.missingSkills.length} skill gaps to address.`,
            recommendedActions: [
              result.missingSkills.length > 0
                ? `Learn ${result.missingSkills[0]} to improve readiness`
                : 'Prepare your application materials',
              `Research ${opportunity.platform} culture and values`,
              `Apply before ${opportunity.deadline}`,
            ],
            personalizedInsight: `Match score of ${result.score}% based on skill overlap and career goal alignment.`,
            relevanceAnalysis: `Skill overlap at ${result.relevanceFactors.skillOverlap}%. ${
              result.relevanceFactors.interestAlignment ? 'Strong interest alignment detected.' : 'Moderate interest alignment.'
            } ${result.relevanceFactors.experienceLevelFit ? 'Experience level is a good fit.' : 'Consider building foundational skills.'}`,
          };
        });

        updatedRanked.sort((a, b) => b.score - a.score);

        return {
          ...prevRecs,
          rankedOpportunities: updatedRanked,
        };
      });

      return updatedProfile;
    });
  }, []);

  const removeUserSkill = useCallback((skillToRemove) => {
    setUserProfile((prev) => {
      const updatedSkills = prev.skills.filter(s => s !== skillToRemove);
      const updatedProfile = {
        ...prev,
        skills: updatedSkills,
      };

      setMatches((prevMatches) => {
        if (!prevMatches || prevMatches.length === 0) return prevMatches;
        const updated = prevMatches.map((match) => {
          const opportunity = getOppById(match.opportunityId);
          if (!opportunity) return match;
          const result = computeBaseMatchScore(updatedProfile, opportunity);
          return {
            ...match,
            score: result.score,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            relevanceAnalysis: `Skill overlap at ${result.relevanceFactors.skillOverlap}%. ${
              result.relevanceFactors.interestAlignment ? 'Strong interest alignment detected.' : 'Moderate interest alignment.'
            } ${result.relevanceFactors.experienceLevelFit ? 'Experience level is a good fit.' : 'Consider building foundational skills.'}`,
            relevanceFactors: result.relevanceFactors,
          };
        });
        return updated.sort((a, b) => b.score - a.score);
      });

      setRecommendations((prevRecs) => {
        if (!prevRecs || !prevRecs.rankedOpportunities) return prevRecs;
        const updatedRanked = prevRecs.rankedOpportunities.map((rec) => {
          const opportunity = getOppById(rec.opportunityId);
          if (!opportunity) return rec;
          const result = computeBaseMatchScore(updatedProfile, opportunity);
          return {
            ...rec,
            score: result.score,
            badge: getMatchBadge(result.score),
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            whyRecommended: `This ${opportunity.category.toLowerCase()} aligns with your career interests. Your ${result.matchedSkills.slice(0, 2).join(' and ')} skills provide a strong foundation, with ${result.missingSkills.length} skill gaps to address.`,
            recommendedActions: [
              result.missingSkills.length > 0
                ? `Learn ${result.missingSkills[0]} to improve readiness`
                : 'Prepare your application materials',
              `Research ${opportunity.platform} culture and values`,
              `Apply before ${opportunity.deadline}`,
            ],
            personalizedInsight: `Match score of ${result.score}% based on skill overlap and career goal alignment.`,
            relevanceAnalysis: `Skill overlap at ${result.relevanceFactors.skillOverlap}%. ${
              result.relevanceFactors.interestAlignment ? 'Strong interest alignment detected.' : 'Moderate interest alignment.'
            } ${result.relevanceFactors.experienceLevelFit ? 'Experience level is a good fit.' : 'Consider building foundational skills.'}`,
          };
        });

        updatedRanked.sort((a, b) => b.score - a.score);

        return {
          ...prevRecs,
          rankedOpportunities: updatedRanked,
        };
      });

      return updatedProfile;
    });
  }, []);

  const [profileAnalysis, setProfileAnalysis] = useState(null);
  const [matches, setMatches] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [dailySummary, setDailySummary] = useState('');
  const [agentRuns, setAgentRuns] = useState([]);
  const [trackedIds, setTrackedIds] = useState(new Set());
  const [enrichedDetails, setEnrichedDetails] = useState({});

  const findOpportunities = useCallback(async (isEvents = false) => {
    setIsFinding(true);
    setError(null);
    setCompletedSteps([]);
    setCurrentStep('discovery');
    const runs = [];

    try {
      const discoveryResult = await runDiscoveryAgent({ query: searchQuery });

      if (isEvents) {
        const EVENT_CATEGORIES = ['Hackathons', 'Competitions', 'Workshops', 'Conferences'];
        discoveryResult.output.opportunities = discoveryResult.output.opportunities.filter(
          (o) => EVENT_CATEGORIES.includes(o.category)
        );
        discoveryResult.output.totalFound = discoveryResult.output.opportunities.length;
        discoveryResult.output.categories = [...new Set(discoveryResult.output.opportunities.map((o) => o.category))];
      }

      runs.push(discoveryResult);
      setDiscoveredOpportunities(discoveryResult.output.opportunities);
      setCompletedSteps(['discovery']);
      setAgentRuns([...runs]);

      setCurrentStep('profile');
      const profileResult = await runProfileAgent(userProfile);
      runs.push(profileResult);
      setProfileAnalysis(profileResult.output);
      setCompletedSteps(['discovery', 'profile']);
      setAgentRuns([...runs]);

      setCurrentStep('matching');
      const matchingResult = await runMatchingAgent(userProfile, discoveryResult.output.opportunities);
      runs.push(matchingResult);
      setMatches(matchingResult.output.matches);
      setCompletedSteps(['discovery', 'profile', 'matching']);
      setAgentRuns([...runs]);

      setCurrentStep('recommendation');
      const recommendationResult = await runRecommendationAgent(
        userProfile,
        matchingResult.output.matches,
        discoveryResult.output.opportunities
      );
      runs.push(recommendationResult);
      setRecommendations(recommendationResult.output);
      setCompletedSteps(['discovery', 'profile', 'matching', 'recommendation']);
      setAgentRuns([...runs]);

      setCurrentStep('notification');
      const notificationResult = await runNotificationAgent(
        userProfile,
        discoveryResult.output.opportunities,
        matchingResult.output.matches,
        recommendationResult.output
      );
      runs.push(notificationResult);
      setNotifications(notificationResult.output.notifications);
      setDailySummary(notificationResult.output.dailySummary);
      setCompletedSteps(['discovery', 'profile', 'matching', 'recommendation', 'notification']);
      setAgentRuns([...runs]);
      setCurrentStep('complete');
    } catch (err) {
      setError(err.message || 'An error occurred during opportunity discovery.');
      setCurrentStep(null);
    } finally {
      setIsFinding(false);
    }
  }, [userProfile, searchQuery]);

  const getRecommendationForOpportunity = useCallback(
    (opportunityId) => {
      return recommendations?.rankedOpportunities?.find((r) => r.opportunityId === opportunityId) ?? null;
    },
    [recommendations]
  );

  const getMatchForOpportunity = useCallback(
    (opportunityId) => {
      return matches.find((m) => m.opportunityId === opportunityId) ?? null;
    },
    [matches]
  );

  const enrichOpportunityDetail = useCallback(
    async (opportunityId) => {
      if (enrichedDetails[opportunityId]) return enrichedDetails[opportunityId];

      const opportunity = getOppById(opportunityId);
      const match = getMatchForOpportunity(opportunityId);
      if (!opportunity || !match) return null;

      const oppSkills = opportunity.skills || opportunity.requiredSkills || [];
      const readiness = computeReadinessScore(userProfile.skills, oppSkills);
      const fallback = {
        matchAnalysis: `High relevance to your ${userProfile.skills.slice(0, 2).join(' and ')} experience. ${match.relevanceAnalysis}`,
        whyRecommended: getRecommendationForOpportunity(opportunityId)?.whyRecommended ??
          generateWhyRecommended(userProfile, match, opportunity),
        recommendedNextSteps: getRecommendationForOpportunity(opportunityId)?.recommendedActions ??
          generateRecommendedActions(match, opportunity),
        marketContext: `${oppSkills[0] || 'These'} skills are in high demand for ${opportunity.category.toLowerCase()} roles.`,
        learningRoadmap: buildLearningRoadmap(readiness.missingSkills, opportunity.title),
        readiness,
        badge: getMatchBadge(match.score),
      };

      const geminiEnrichment = await enrichOpportunityWithGemini(userProfile, opportunity, match);
      const enriched = geminiEnrichment
        ? {
            ...fallback,
            matchAnalysis: geminiEnrichment.matchAnalysis,
            whyRecommended: geminiEnrichment.whyRecommended,
            recommendedNextSteps: geminiEnrichment.recommendedNextSteps,
            marketContext: geminiEnrichment.marketContext,
            learningRoadmap: geminiEnrichment.learningRoadmap?.map((step, i) => ({
              id: `gemini-roadmap-${i}`,
              ...step,
            })) ?? fallback.learningRoadmap,
          }
        : fallback;

      setEnrichedDetails((prev) => ({ ...prev, [opportunityId]: enriched }));
      return enriched;
    },
    [userProfile, getMatchForOpportunity, getRecommendationForOpportunity, enrichedDetails]
  );

  const toggleTrack = useCallback((opportunityId) => {
    setTrackedIds((prev) => {
      const next = new Set(prev);
      if (next.has(opportunityId)) next.delete(opportunityId);
      else next.add(opportunityId);
      return next;
    });
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fallbackMissing = ['Docker', 'AWS', 'Kubernetes', 'Distributed Systems'].filter(
    (s) => !userProfile.skills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const fallbackRoadmap = ['Docker', 'AWS'].filter(
    (s) => !userProfile.skills.some((us) => us.toLowerCase() === s.toLowerCase())
  );

  const skillGapAnalysis = profileAnalysis
    ? {
        currentSkills: userProfile.skills,
        missingSkills: (matches.length > 0
          ? [...new Set(matches.flatMap((m) => m.missingSkills))]
          : ['Docker', 'AWS', 'Kubernetes', 'Distributed Systems']
        ).filter(s => !userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase())).slice(0, 8),
        readinessScore: matches.length > 0
          ? Math.round(matches.reduce((s, m) => s + m.score, 0) / matches.length)
          : 82,
        learningRoadmap: buildLearningRoadmap(
          (matches.length > 0
            ? [...new Set(matches.flatMap((m) => m.missingSkills))]
            : ['Docker', 'AWS']
          ).filter(s => !userProfile.skills.some(us => us.toLowerCase() === s.toLowerCase())).slice(0, 3)
        ),
        skillClusters: profileAnalysis.skillClusters,
        careerIntent: profileAnalysis.careerIntent,
      }
    : {
        currentSkills: userProfile.skills,
        missingSkills: fallbackMissing,
        readinessScore: 82,
        learningRoadmap: buildLearningRoadmap(fallbackRoadmap),
        skillClusters: [],
        careerIntent: null,
      };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        addUserSkills,
        removeUserSkill,
        getOppById,
        searchQuery,
        setSearchQuery,
        isFinding,
        currentStep,
        completedSteps,
        agentSteps: AGENT_STEPS,
        error,
        findOpportunities,
        discoveredOpportunities,
        profileAnalysis,
        matches,
        recommendations,
        notifications,
        dailySummary,
        agentRuns,
        trackedIds,
        toggleTrack,
        markNotificationRead,
        unreadCount,
        getRecommendationForOpportunity,
        getMatchForOpportunity,
        enrichOpportunityDetail,
        enrichedDetails,
        skillGapAnalysis,
        hasResults: recommendations !== null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
