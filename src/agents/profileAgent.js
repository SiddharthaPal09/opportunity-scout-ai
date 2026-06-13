import { analyzeProfileWithGemini } from '../services/geminiService.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildSkillClusters(skills) {
  const clusters = {
    'Programming Languages': [],
    'ML & AI': [],
    'Cloud & DevOps': [],
    'Backend & Systems': [],
    Other: [],
  };

  const mlKeywords = ['python', 'pytorch', 'tensorflow', 'machine learning', 'ml', 'numpy', 'deep learning', 'ai'];
  const cloudKeywords = ['aws', 'docker', 'kubernetes', 'cloud', 'devops'];
  const backendKeywords = ['java', 'spring', 'api', 'system design', 'distributed'];
  const langKeywords = ['python', 'java', 'javascript', 'c++', 'ruby', 'go', 'rust'];

  for (const skill of skills) {
    const s = skill.toLowerCase();
    if (mlKeywords.some((k) => s.includes(k))) {
      clusters['ML & AI'].push(skill);
    } else if (cloudKeywords.some((k) => s.includes(k))) {
      clusters['Cloud & DevOps'].push(skill);
    } else if (backendKeywords.some((k) => s.includes(k))) {
      clusters['Backend & Systems'].push(skill);
    } else if (langKeywords.some((k) => s.includes(k))) {
      clusters['Programming Languages'].push(skill);
    } else {
      clusters.Other.push(skill);
    }
  }

  return Object.entries(clusters)
    .filter(([, skills]) => skills.length > 0)
    .map(([name, clusterSkills]) => ({
      name,
      skills: clusterSkills,
      proficiency: clusterSkills.length >= 3 ? 'advanced' : clusterSkills.length >= 2 ? 'intermediate' : 'beginner',
    }));
}

function inferCareerIntent(userProfile) {
  const goal = userProfile.careerGoal.toLowerCase();
  const roles = [];
  if (goal.includes('ml') || goal.includes('machine learning')) roles.push('ML Engineer', 'Applied Scientist');
  if (goal.includes('software') || goal.includes('engineering')) roles.push('Software Engineer');
  if (goal.includes('research')) roles.push('Research Engineer');
  if (goal.includes('data')) roles.push('Data Scientist');
  if (roles.length === 0) roles.push('Technology Professional');

  return {
    primaryGoal: userProfile.careerGoal,
    targetRoles: roles,
    timeline: userProfile.experienceLevel === 'beginner' ? '1-2 years' : '6-12 months',
  };
}

/**
 * Profile Analysis Agent — analyzes user skills, interests, goals, and experience.
 */
export async function runProfileAgent(userProfile) {
  await delay(1000);

  const geminiResult = await analyzeProfileWithGemini(userProfile);

  const structuredProfile = geminiResult?.structuredProfile ?? {
    summary: `${userProfile.experienceLevel} professional targeting ${userProfile.careerGoal}`,
    strengths: userProfile.skills.slice(0, 4),
    growthAreas: ['Cloud Infrastructure', 'Distributed Systems', 'System Design'],
  };

  const skillClusters = geminiResult?.skillClusters ?? buildSkillClusters(userProfile.skills);
  const careerIntent = geminiResult?.careerIntent ?? inferCareerIntent(userProfile);

  return {
    agent: 'Profile Analysis Agent',
    status: 'complete',
    timestamp: new Date().toISOString(),
    output: {
      structuredProfile,
      skillClusters,
      careerIntent,
      rawInput: userProfile,
    },
  };
}
