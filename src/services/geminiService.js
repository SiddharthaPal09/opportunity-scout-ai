import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

function getClient() {
  if (!API_KEY || API_KEY === 'YOUR_KEY') {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

function extractJSON(text) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Gemini response');
  }
  const raw = jsonMatch[1] || jsonMatch[0];
  return JSON.parse(raw);
}

async function generateStructuredJSON(prompt, schemaDescription) {
  const client = getClient();
  if (!client) {
    return null;
  }

  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const fullPrompt = `${prompt}

Return ONLY valid JSON matching this schema:
${schemaDescription}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch {
    try {
      const result = await model.generateContent(fullPrompt);
      return extractJSON(result.response.text());
    } catch (err) {
      console.error('Gemini API error:', err);
      return null;
    }
  }
}

export async function analyzeProfileWithGemini(userProfile) {
  const prompt = `Analyze this user profile for an opportunity intelligence platform:

Skills: ${userProfile.skills.join(', ')}
Interests: ${userProfile.interests.join(', ')}
Career Goal: ${userProfile.careerGoal}
Experience Level: ${userProfile.experienceLevel}`;

  const schema = `{
    "structuredProfile": { "summary": "string", "strengths": ["string"], "growthAreas": ["string"] },
    "skillClusters": [{ "name": "string", "skills": ["string"], "proficiency": "beginner|intermediate|advanced" }],
    "careerIntent": { "primaryGoal": "string", "targetRoles": ["string"], "timeline": "string" }
  }`;

  return generateStructuredJSON(prompt, schema);
}

export async function generateRecommendationsWithGemini(userProfile, matches, opportunities) {
  const topMatches = matches.slice(0, 8).map((m) => {
    const opp = opportunities.find((o) => o.id === m.opportunityId);
    return {
      id: m.opportunityId,
      title: opp?.title,
      score: m.score,
      category: opp?.category,
      description: opp?.description,
      location: opp?.location,
      skills: opp?.skills || opp?.requiredSkills || [],
      requirements: opp?.requirements || opp?.bullets || [],
      missingSkills: m.missingSkills,
    };
  });

  const prompt = `You are the Recommendation Agent for Opportunity Scout.

User Profile:
- Skills: ${userProfile.skills.join(', ')}
- Interests: ${userProfile.interests.join(', ')}
- Career Goal: ${userProfile.careerGoal}
- Experience: ${userProfile.experienceLevel}

Top Matched Opportunities:
${JSON.stringify(topMatches, null, 2)}

Rank these opportunities and provide personalized insights.
For each opportunity, your recommendation must explicitly mention the opportunity's title, reference the matching and missing skills, and reference the category or event type (e.g. hackathon, conference, workshop, competition, etc.).`;

  const schema = `{
    "rankedOpportunities": [{
      "opportunityId": "string",
      "rank": number,
      "whyRecommended": "string (2-3 sentences, must mention the opportunity title and reference matching/missing skills and event/category type)",
      "recommendedActions": ["string"],
      "personalizedInsight": "string"
    }],
    "overallInsights": "string (2-3 sentences about the user's opportunity landscape)",
    "nextBestAction": "string"
  }`;

  return generateStructuredJSON(prompt, schema);
}

export async function enrichOpportunityWithGemini(userProfile, opportunity, matchData) {
  const oppSkills = opportunity.skills || opportunity.requiredSkills || [];
  const oppReqs = opportunity.requirements || opportunity.bullets || [];
  const prompt = `Analyze this opportunity match for a user:

User Skills: ${userProfile.skills.join(', ')}
Career Goal: ${userProfile.careerGoal}

Opportunity: ${opportunity.title}
Category: ${opportunity.category}
Location: ${opportunity.location || 'N/A'}
Required Skills: ${oppSkills.join(', ')}
Requirements: ${Array.isArray(oppReqs) ? oppReqs.join(', ') : oppReqs}
Match Score: ${matchData.score}%
Missing Skills: ${matchData.missingSkills.join(', ')}

Provide detailed match analysis and recommendations. Your recommendation must explicitly mention the opportunity's title, reference the matching and missing skills, and reference the category or event type (e.g. hackathon, conference, workshop, competition, etc.).`;

  const schema = `{
    "matchAnalysis": "string (2-3 sentences explaining the match, must mention the opportunity title)",
    "whyRecommended": "string (2-3 sentences, must mention the opportunity title)",
    "recommendedNextSteps": ["string"],
    "marketContext": "string (1-2 sentences about market demand for these skills)",
    "learningRoadmap": [{
      "title": "string",
      "description": "string",
      "status": "active|pending",
      "actionLabel": "string"
    }]
  }`;

  return generateStructuredJSON(prompt, schema);
}

export async function generateNotificationsWithGemini(userProfile, opportunities, matches) {
  const upcoming = opportunities
    .filter((o) => {
      const days = Math.ceil((new Date(o.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      return days > 0 && days <= 14;
    })
    .slice(0, 5);

  const prompt = `Generate notification content for Opportunity Scout daily scan.

User: ${userProfile.careerGoal}
Upcoming Deadlines: ${upcoming.map((o) => `${o.title} (${o.deadline})`).join(', ')}
Top Matches: ${matches.slice(0, 3).map((m) => m.opportunityId).join(', ')}`;

  const schema = `{
    "dailySummary": "string",
    "notifications": [{
      "id": "string",
      "type": "deadline|new_opportunity|daily_summary|suggested_action",
      "title": "string",
      "message": "string",
      "priority": "high|medium|low",
      "relatedOpportunityId": "string or null"
    }]
  }`;

  return generateStructuredJSON(prompt, schema);
}

export function isGeminiConfigured() {
  return Boolean(API_KEY && API_KEY !== 'YOUR_KEY');
}
