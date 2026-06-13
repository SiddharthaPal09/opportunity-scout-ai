import { useApp } from '../context/AppContext.jsx';
import ReadinessRing, { LearningRoadmap } from '../components/OpportunityComponents.jsx';

export default function SkillInsightsPage() {
  const { skillGapAnalysis, hasResults } = useApp();
  const { currentSkills, missingSkills, readinessScore, learningRoadmap, skillClusters, careerIntent } = skillGapAnalysis;

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Skill Insights</h1>
        <p className="text-body-md text-on-surface-variant">Skill gap analysis powered by the Profile Analysis Agent</p>
      </div>

      <div className="flex gap-xl items-start flex-col lg:flex-row">
        <div className="flex-[2] space-y-lg w-full">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
            <h3 className="font-headline-sm text-headline-sm mb-lg">Current Skills</h3>
            <div className="flex flex-wrap gap-md">
              {currentSkills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 bg-secondary-container/20 border border-secondary/20 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-body-sm font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
            <h3 className="font-headline-sm text-headline-sm mb-lg">Missing Skills</h3>
            <div className="flex flex-wrap gap-md">
              {missingSkills.map((skill, i) => (
                <div
                  key={skill}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    i < 2 ? 'bg-error-container/20 border border-error/20' : 'bg-on-surface/5 border border-outline-variant opacity-60'
                  }`}
                >
                  {i < 2 ? (
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  )}
                  <span className={`text-body-sm ${i < 2 ? 'font-bold text-error' : ''}`}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {skillClusters.length > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
              <h3 className="font-headline-sm text-headline-sm mb-lg">Skill Clusters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {skillClusters.map((cluster) => (
                  <div key={cluster.name} className="p-md bg-surface-container rounded-lg border border-outline-variant">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body-sm font-bold">{cluster.name}</h4>
                      <span className="text-label-sm text-secondary capitalize">{cluster.proficiency}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cluster.skills.map((s) => (
                        <span key={s} className="text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {careerIntent && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
              <h3 className="font-headline-sm text-headline-sm mb-lg">Career Intent</h3>
              <p className="text-body-md text-on-surface-variant mb-md">{careerIntent.primaryGoal}</p>
              <div className="flex flex-wrap gap-md">
                {careerIntent.targetRoles?.map((role) => (
                  <span key={role} className="bg-primary/5 text-primary px-3 py-1 rounded-full text-label-md font-bold">{role}</span>
                ))}
              </div>
              <p className="text-body-sm text-on-surface-variant mt-md">Timeline: {careerIntent.timeline}</p>
            </div>
          )}
        </div>

        <aside className="flex-1 space-y-lg w-full lg:w-auto">
          <ReadinessRing
            percent={readinessScore}
            dimensions={[
              { label: 'Technical Depth', score: Math.min(100, readinessScore + 6) },
              { label: 'Domain Fit', score: Math.min(100, readinessScore + 12) },
              { label: 'Infrastructure Exp', score: Math.max(20, readinessScore - 40) },
            ]}
          />
          <LearningRoadmap steps={learningRoadmap} gapCount={missingSkills.length} />
        </aside>
      </div>

      {!hasResults && (
        <div className="mt-lg p-md bg-surface-container rounded-lg border border-outline-variant flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">info</span>
          <p className="text-body-sm text-on-surface-variant">
            Run <strong>Find Opportunities</strong> for AI-powered skill cluster analysis and personalized learning roadmaps.
          </p>
        </div>
      )}
    </>
  );
}
