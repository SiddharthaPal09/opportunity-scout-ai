import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import ReadinessRing, { LearningRoadmap } from '../components/OpportunityComponents.jsx';
import {
  computeBaseMatchScore,
  computeReadinessScore,
  buildLearningRoadmap,
  getMatchBadge,
  generateWhyRecommended,
  generateRecommendedActions,
} from '../utils/scoring.js';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const {
    getMatchForOpportunity,
    getRecommendationForOpportunity,
    enrichOpportunityDetail,
    enrichedDetails,
    trackedIds,
    toggleTrack,
    hasResults,
    getOppById,
    userProfile,
  } = useApp();

  const opportunity = getOppById(id);
  const match = getMatchForOpportunity(id);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(enrichedDetails[id] ?? null);

  useEffect(() => {
    if (!opportunity) return;
    setLoading(true);
    enrichOpportunityDetail(id).then((result) => {
      setDetail(result);
      setLoading(false);
    });
  }, [id, opportunity, enrichOpportunityDetail]);

  if (!opportunity) {
    return (
      <div className="text-center py-xl">
        <h2 className="font-headline-md text-headline-md mb-md">Opportunity Not Found</h2>
        <Link to="/opportunities" className="text-secondary hover:underline">Back to Opportunities</Link>
      </div>
    );
  }

  // Calculate fallbacks on the fly to support immediate details page rendering even before pipeline re-run
  const oppSkills = opportunity.skills || opportunity.requiredSkills || [];
  const matchResult = computeBaseMatchScore(userProfile, opportunity);
  const computedReadiness = computeReadinessScore(userProfile.skills, oppSkills);

  const calculatedScore = matchResult.score;
  const calculatedBadge = getMatchBadge(calculatedScore);
  const calculatedMatchedSkills = matchResult.matchedSkills;
  const calculatedMissingSkills = matchResult.missingSkills;

  const fallback = {
    matchAnalysis: `High relevance to your profile. The technical requirements of "${opportunity.title}" align well with your experience. Skill overlap is calculated at ${matchResult.relevanceFactors.skillOverlap}% compatibility.`,
    whyRecommended: generateWhyRecommended(userProfile, matchResult, opportunity),
    recommendedNextSteps: generateRecommendedActions(matchResult, opportunity),
    marketContext: `${oppSkills[0] || 'These'} skills are in high demand for ${opportunity.category.toLowerCase()} roles.`,
    learningRoadmap: buildLearningRoadmap(calculatedMissingSkills, opportunity.title),
    readiness: computedReadiness,
    badge: calculatedBadge,
  };

  const activeDetail = detail || fallback;

  const score = match?.score ?? calculatedScore;
  const badge = activeDetail?.badge ?? calculatedBadge;
  const readiness = activeDetail?.readiness ?? { overall: calculatedScore, dimensions: [], missingSkills: calculatedMissingSkills };
  const matchedSkillsList = match?.matchedSkills ?? calculatedMatchedSkills;
  const missingSkillsList = match?.missingSkills ?? calculatedMissingSkills;
  const isTracked = trackedIds.has(id);

  return (
    <>
      <div className="flex items-center gap-2 mb-lg text-on-surface-variant text-label-md">
        <Link to="/opportunities" className="hover:text-primary">Opportunities</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-bold">{opportunity.title.split(' - ')[0]}</span>
      </div>

      <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-lg mb-lg flex flex-col md:flex-row md:items-center justify-between gap-md relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          </div>
          <div>
            <h3 className="text-body-md font-bold text-on-surface">AI Career Advisor Report</h3>
            <p className="text-label-sm text-on-surface-variant">Personalized analysis prepared specifically for compatibility with "{opportunity.title}"</p>
          </div>
        </div>
        <div className="bg-secondary-container/20 text-secondary text-label-sm font-bold px-3 py-1.5 rounded-lg border border-secondary/20 relative z-10 uppercase tracking-wider self-start md:self-auto">
          Active Profile Report
        </div>
      </div>

      {!hasResults && (
        <div className="mb-lg p-md bg-surface-container rounded-lg border border-outline-variant flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">info</span>
          <p className="text-body-sm text-on-surface-variant">
            Click <strong>Find Opportunities</strong> in the top nav to run the multi-agent pipeline and generate personalized match scores.
          </p>
        </div>
      )}

      <div className="flex gap-xl items-start flex-col lg:flex-row">
        <div className="flex-[2] space-y-lg w-full">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-lg">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold uppercase tracking-wider">
                {badge}
              </span>
            </div>
            <div className="flex items-start gap-lg">
              <div className="w-16 h-16 rounded-xl bg-white border border-outline-variant flex items-center justify-center p-2">
                <span className="material-symbols-outlined text-[32px] text-primary">business</span>
              </div>
              <div className="flex-1">
                <h2 className="font-display-lg text-display-lg text-on-surface mb-xs">{opportunity.title}</h2>
                <div className="flex flex-wrap items-center gap-md text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="text-body-sm">{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="text-body-sm">{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary font-bold">
                    <span className="material-symbols-outlined text-[18px]">stars</span>
                    <span className="text-body-sm">{score}% Advisor Match Score</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-xl flex gap-md flex-wrap">
              <a
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Apply Now
                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
              </a>
              <button
                onClick={() => toggleTrack(id)}
                className={`border px-8 py-3 rounded-lg font-label-md font-bold transition-all flex items-center gap-2 ${
                  isTracked
                    ? 'border-secondary bg-secondary-container/20 text-secondary'
                    : 'border-outline text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{isTracked ? 'bookmark' : 'bookmark'}</span>
                {isTracked ? 'Tracking' : 'Track Opportunity'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <div className="flex items-center gap-2 text-secondary mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                <h3 className="font-headline-sm text-headline-sm">Match Analysis</h3>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {loading && hasResults ? 'Analyzing match...' : activeDetail?.matchAnalysis}
              </p>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <div className="flex items-center gap-2 text-tertiary-container mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <h3 className="font-headline-sm text-headline-sm">Why Recommended</h3>
              </div>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {loading && hasResults ? 'Generating recommendation...' : activeDetail?.whyRecommended}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
            <h3 className="font-headline-sm text-headline-sm mb-lg">Technical Requirements</h3>
            <div className="space-y-xl">
              <div>
                <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-md font-bold">Matching Skills</p>
                <div className="flex flex-wrap gap-md">
                  {oppSkills.map((skill) => {
                    const isMet = matchedSkillsList.some((s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
                    return (
                      <div key={skill} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isMet ? 'bg-secondary-container/20 border border-secondary/20' : 'bg-on-surface/5 border border-outline-variant'}`}>
                        {isMet ? (
                          <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-outline" />
                        )}
                        <span className="text-body-sm font-medium">{skill}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-md font-bold">Detected Missing Skills (Priority)</p>
                <div className="flex flex-wrap gap-md">
                  {missingSkillsList.map((skill, i) => (
                    <div key={skill} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-container/20 border border-error/20">
                      <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                      <span className="text-body-sm font-bold text-error">{skill}</span>
                    </div>
                  ))}
                  {missingSkillsList.length === 0 && (
                    <p className="text-body-sm text-secondary font-medium">Excellent! You possess all required technical skills for "{opportunity.title}".</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
            <h3 className="font-headline-sm text-headline-sm mb-lg">Opportunity Overview</h3>
            <div className="prose prose-slate max-w-none text-on-surface-variant text-body-md leading-relaxed space-y-md">
              <p className="font-medium text-on-surface">
                Detailed profile alignment report for <span className="text-primary font-bold">"{opportunity.title}"</span>. This {opportunity.category.toLowerCase()} opportunity is hosted by <span className="font-bold">{opportunity.platform || 'the organizer'}</span> and is located in <span className="font-bold">{opportunity.location || 'remote/unspecified'}</span>.
              </p>
              <p>{opportunity.description}</p>
              {opportunity.bullets && (
                <ul className="list-disc pl-5 space-y-2 mt-md">
                  {opportunity.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {activeDetail?.recommendedNextSteps && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
              <h3 className="font-headline-sm text-headline-sm mb-lg">Recommended Actions</h3>
              <div className="space-y-md">
                {activeDetail.recommendedNextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-secondary-container/30 flex items-center justify-center text-label-sm font-bold text-secondary flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-body-md text-on-surface-variant">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="flex-1 space-y-lg sticky top-24 w-full lg:w-auto">
          <ReadinessRing percent={readiness.overall} dimensions={readiness.dimensions} />
          <LearningRoadmap steps={activeDetail?.learningRoadmap ?? []} gapCount={missingSkillsList.length} />
          <div className="p-lg bg-surface-container rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">trending_up</span>
              <span className="text-label-sm font-bold uppercase tracking-widest text-on-surface-variant">Market Demand</span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {activeDetail?.marketContext}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
