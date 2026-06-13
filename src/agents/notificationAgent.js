import { generateNotificationsWithGemini } from '../services/geminiService.js';
import { daysUntilDeadline } from '../utils/scoring.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildFallbackNotifications(userProfile, opportunities, matches, recommendations) {
  const notifications = [];
  let id = 1;

  const upcomingDeadlines = opportunities
    .filter((o) => {
      const days = daysUntilDeadline(o.deadline);
      return days > 0 && days <= 14;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  for (const opp of upcomingDeadlines) {
    const days = daysUntilDeadline(opp.deadline);
    notifications.push({
      id: `notif-${id++}`,
      type: 'deadline',
      title: `Deadline in ${days} day${days !== 1 ? 's' : ''}`,
      message: `${opp.title} closes on ${opp.deadline}. Don't miss this ${opp.category.toLowerCase()} opportunity.`,
      priority: days <= 3 ? 'high' : days <= 7 ? 'medium' : 'low',
      relatedOpportunityId: opp.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  const topMatch = matches[0];
  if (topMatch) {
    const opp = opportunities.find((o) => o.id === topMatch.opportunityId);
    notifications.push({
      id: `notif-${id++}`,
      type: 'new_opportunity',
      title: 'New High-Match Opportunity',
      message: `${opp?.title} scored ${topMatch.score}% compatibility with your profile.`,
      priority: 'high',
      relatedOpportunityId: topMatch.opportunityId,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  notifications.push({
    id: `notif-${id++}`,
    type: 'daily_summary',
    title: 'Daily Opportunity Scan Complete',
    message: `Scanned ${opportunities.length} opportunities. Found ${matches.filter((m) => m.score >= 60).length} strong matches for your goal: ${userProfile.careerGoal}.`,
    priority: 'medium',
    relatedOpportunityId: null,
    read: false,
    createdAt: new Date().toISOString(),
  });

  if (recommendations?.nextBestAction) {
    notifications.push({
      id: `notif-${id++}`,
      type: 'suggested_action',
      title: 'Suggested Next Action',
      message: recommendations.nextBestAction,
      priority: 'medium',
      relatedOpportunityId: matches[0]?.opportunityId ?? null,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  const recentOpps = opportunities
    .filter((o) => daysUntilDeadline(o.deadline) > 14 && daysUntilDeadline(o.deadline) <= 30)
    .slice(0, 2);

  for (const opp of recentOpps) {
    notifications.push({
      id: `notif-${id++}`,
      type: 'new_opportunity',
      title: 'Recently Added Opportunity',
      message: `${opp.title} on ${opp.platform} — ${opp.category} now available.`,
      priority: 'low',
      relatedOpportunityId: opp.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    dailySummary: `Today's scan found ${matches.length} opportunities. ${matches.filter((m) => m.score >= 80).length} are high-match for your ${userProfile.experienceLevel} profile.`,
    notifications,
  };
}

/**
 * Notification Agent — simulates daily scans, deadline alerts, and new opportunity notifications.
 */
export async function runNotificationAgent(userProfile, opportunities, matches, recommendations) {
  await delay(900);

  const geminiResult = await generateNotificationsWithGemini(userProfile, opportunities, matches);
  const fallback = buildFallbackNotifications(userProfile, opportunities, matches, recommendations);

  if (!geminiResult) {
    return {
      agent: 'Notification Agent',
      status: 'complete',
      timestamp: new Date().toISOString(),
      output: { ...fallback, source: 'local' },
    };
  }

  const notifications = geminiResult.notifications.map((n, i) => ({
    ...n,
    id: n.id || `notif-gemini-${i}`,
    read: false,
    createdAt: new Date().toISOString(),
  }));

  return {
    agent: 'Notification Agent',
    status: 'complete',
    timestamp: new Date().toISOString(),
    output: {
      dailySummary: geminiResult.dailySummary,
      notifications,
      source: 'gemini',
    },
  };
}
