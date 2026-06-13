/**
 * Scoring utilities for opportunity matching and skill gap analysis.
 */

const SKILL_ALIASES = {
  'ml theory': ['machine learning', 'ml', 'deep learning'],
  'machine learning': ['ml', 'ml theory', 'deep learning'],
  'numpy/scipy': ['numpy', 'scipy', 'python'],
  'distributed systems': ['distributed computing', 'kubernetes', 'k8s', 'horovod'],
  'kubernetes': ['k8s', 'docker', 'container orchestration'],
  'k8s': ['kubernetes', 'docker'],
  'ai/ml': ['machine learning', 'artificial intelligence', 'deep learning'],
  'deep learning': ['machine learning', 'pytorch', 'tensorflow', 'neural networks'],
  'pytorch': ['deep learning', 'machine learning', 'tensorflow'],
  'tensorflow': ['deep learning', 'machine learning', 'pytorch'],
  'java': ['spring boot', 'object-oriented design'],
  'spring boot': ['java', 'backend development'],
  'aws': ['cloud computing', 'amazon web services'],
  'docker': ['kubernetes', 'containerization', 'devops'],
  'programming': ['python', 'java', 'javascript', 'c++'],
  'algorithms': ['data structures', 'problem solving'],
  'data structures': ['algorithms', 'problem solving'],
};

function normalizeSkill(skill) {
  return skill.toLowerCase().trim().replace(/[^a-z0-9/+\s-]/g, '');
}

function skillsMatch(userSkill, requiredSkill) {
  const user = normalizeSkill(userSkill);
  const req = normalizeSkill(requiredSkill);

  if (user === req) return true;
  if (user.includes(req) || req.includes(user)) return true;

  const aliases = SKILL_ALIASES[req] || [];
  return aliases.some((alias) => user.includes(alias) || alias.includes(user));
}

export function computeSkillOverlap(userSkills, requiredSkills) {
  const matched = [];
  const missing = [];
  const reqSkills = requiredSkills || [];

  for (const req of reqSkills) {
    const hasSkill = userSkills.some((us) => skillsMatch(us, req));
    if (hasSkill) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }

  const overlapRatio = reqSkills.length > 0 ? matched.length / reqSkills.length : 0;
  return { matched, missing, overlapRatio };
}

export function computeBaseMatchScore(userProfile, opportunity) {
  const oppSkills = opportunity.skills || opportunity.requiredSkills || [];
  const { matched, missing, overlapRatio } = computeSkillOverlap(
    userProfile.skills,
    oppSkills
  );

  let score = overlapRatio * 60;

  const interestBonus = userProfile.interests.some((interest) => {
    const i = normalizeSkill(interest);
    const desc = normalizeSkill((opportunity.description || '') + (opportunity.requirements || '') + (opportunity.category || ''));
    return desc.includes(i) || i.includes(normalizeSkill(opportunity.category || ''));
  })
    ? 15
    : 0;

  const goalBonus = userProfile.careerGoal &&
    normalizeSkill((opportunity.description || '') + (opportunity.requirements || '') + (opportunity.title || '')).includes(
      normalizeSkill(userProfile.careerGoal.split(' ').slice(-3).join(' '))
    )
    ? 10
    : 5;

  const difficultyMap = { Beginner: 0, Intermediate: 5, Advanced: 10 };
  const expMap = { beginner: 0, intermediate: 5, advanced: 10 };
  const levelFit = opportunity.difficulty &&
    Math.abs(
      (difficultyMap[opportunity.difficulty] || 5) -
        (expMap[userProfile.experienceLevel] || 5)
    ) <= 5
      ? 10
      : 0;

  const deadline = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const now = new Date();
  const daysLeft = deadline ? (deadline - now) / (1000 * 60 * 60 * 24) : NaN;
  const urgencyBonus = !isNaN(daysLeft) && daysLeft > 0 && daysLeft <= 30 ? 5 : 0;

  score = Math.min(100, Math.round(score + interestBonus + goalBonus + (levelFit || 0) + urgencyBonus));

  return {
    score,
    matchedSkills: matched,
    missingSkills: missing,
    relevanceFactors: {
      skillOverlap: Math.round(overlapRatio * 100),
      interestAlignment: interestBonus > 0,
      careerGoalFit: goalBonus,
      experienceLevelFit: (levelFit || 0) > 0,
    },
  };
}

export function computeReadinessScore(userSkills, requiredSkills) {
  const { matched, missing, overlapRatio } = computeSkillOverlap(userSkills, requiredSkills);
  const overall = Math.round(overlapRatio * 100);

  const technicalDepth = Math.min(100, overall + Math.floor(Math.random() * 8));
  const domainFit = Math.min(100, overall + 10);
  const infrastructureExp = Math.max(20, overall - 30 + Math.floor(Math.random() * 15));

  return {
    overall,
    matchedSkills: matched,
    missingSkills: missing,
    dimensions: [
      { label: 'Technical Depth', score: technicalDepth },
      { label: 'Domain Fit', score: domainFit },
      { label: 'Infrastructure Exp', score: infrastructureExp },
    ],
  };
}

export function getMatchBadge(score) {
  if (score >= 80) return 'High Match';
  if (score >= 60) return 'Medium Match';
  return 'Low Match';
}

export function buildLearningRoadmap(missingSkills, opportunityTitle = '') {
  const suffix = opportunityTitle ? ` for ${opportunityTitle}` : '';
  return missingSkills.slice(0, 3).map((skill, index) => ({
    id: `roadmap-${index}`,
    title: index === 0 ? `Bridge: ${skill}${suffix}` : index === 1 ? `Implement: ${skill} Project${suffix}` : `Validate: ${skill} Assessment${suffix}`,
    description:
      index === 0
        ? `Complete foundational training in ${skill} (4-6 hrs) to qualify for ${opportunityTitle || 'this role'}.`
        : index === 1
          ? `Add a ${skill} example to your GitHub portfolio highlighting its relevance to ${opportunityTitle || 'this role'}.`
          : `Pass the "${skill} Fundamentals" skill assessment to hit 90%+ readiness for ${opportunityTitle || 'this role'}.`,
    status: index === 0 ? 'active' : 'pending',
    actionLabel: index === 0 ? 'Launch Course' : index === 1 ? `Pending Step ${index}` : undefined,
    actionUrl: index === 0 ? `https://www.coursera.org/search?query=${encodeURIComponent(skill)}` : undefined,
  }));
}

export function daysUntilDeadline(deadline) {
  if (!deadline) return 0;
  const now = new Date();
  const end = new Date(deadline);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

export function generateWhyRecommended(userProfile, match, opp) {
  const title = opp.title || 'this opportunity';
  const category = opp.category || 'opportunity';
  const matchedSkillsStr = match.matchedSkills && match.matchedSkills.length > 0
    ? `your matching skills in ${match.matchedSkills.slice(0, 3).join(', ')}`
    : 'your background';
  
  const missingSkillsStr = match.missingSkills && match.missingSkills.length > 0
    ? `addressing the gaps in ${match.missingSkills.slice(0, 2).join(' and ')}`
    : 'leveraging your existing expertise';

  const isEvent = ['Hackathons', 'Conferences', 'Workshops', 'Competitions'].some(
    (c) => c.toLowerCase() === category.toLowerCase()
  );

  if (isEvent) {
    const eventTypeMap = {
      hackathons: 'hackathon',
      conferences: 'conference',
      workshops: 'workshop',
      competitions: 'competition',
    };
    const eventType = eventTypeMap[category.toLowerCase()] || category.toLowerCase();
    return `We recommend the ${eventType} "${title}" because it offers high category relevance for your career goal. It aligns with ${matchedSkillsStr}, and participating will help you gain exposure by ${missingSkillsStr}.`;
  }
  
  return `We recommend the ${category.toLowerCase()} "${title}" because it is highly relevant to your career trajectory. It directly leverages ${matchedSkillsStr}, and we suggest ${missingSkillsStr} to maximize your candidacy.`;
}

export function generateRecommendedActions(match, opp) {
  const actions = [];
  const oppSkills = opp.skills || opp.requiredSkills || [];
  
  if (match.missingSkills && match.missingSkills.length > 0) {
    actions.push(`Build proficiency in ${match.missingSkills.slice(0, 2).join(' and ')} to meet the requirements for ${opp.title}.`);
  } else {
    actions.push(`Highlight your experience with ${oppSkills.slice(0, 2).join(' and ')} in your application for ${opp.title}.`);
  }
  
  actions.push(`Review the ${opp.category || 'opportunity'} details at ${opp.location || 'the specified location'} for ${opp.title}.`);
  actions.push(`Prepare submission materials tailored to the requirements of ${opp.title}.`);
  return actions;
}
