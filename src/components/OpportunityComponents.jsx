import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ReadinessRing({ percent, dimensions = [] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [percent]);

  const offset = animated ? `calc(251.2 - (251.2 * ${percent}) / 100)` : '251.2';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
      <h3 className="font-headline-sm text-headline-sm mb-xl text-center">Readiness Analysis</h3>
      <div className="relative w-48 h-48 mx-auto mb-lg">
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" />
          <circle
            className="text-secondary skill-ring"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="12"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display-lg text-[42px] text-on-surface">{percent}%</span>
          <span className="text-label-sm uppercase tracking-tighter font-bold text-on-surface-variant">Qualified</span>
        </div>
      </div>
      {dimensions.length > 0 && (
        <div className="space-y-md">
          {dimensions.map((dim) => (
            <div key={dim.label}>
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">{dim.label}</span>
                <span className="font-bold">{dim.score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full ${dim.score < 50 ? 'bg-error' : 'bg-secondary'}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LearningRoadmap({ steps, gapCount }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="font-headline-sm text-headline-sm">Learning Roadmap</h3>
        <span className="text-secondary bg-secondary-container/20 px-2 py-0.5 rounded text-[11px] font-bold">
          {gapCount ?? steps.length} Gaps Detected
        </span>
      </div>
      <div className="space-y-xl relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant" />
        {steps.map((step, index) => (
          <div key={step.id ?? index} className="relative pl-9 group">
            <div
              className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center z-10 ${
                step.status === 'active' ? 'border-secondary' : 'border-outline-variant'
              }`}
            >
              {step.status === 'active' ? (
                <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              ) : (
                <div className="w-2 h-2 rounded-full bg-outline-variant" />
              )}
            </div>
            <h4 className="text-body-sm font-bold text-on-surface mb-1">{step.title}</h4>
            <p className="text-label-md text-on-surface-variant mb-3">{step.description}</p>
            {step.actionLabel && (
              step.actionUrl ? (
                <a href={step.actionUrl} target="_blank" rel="noopener noreferrer" className="text-label-sm text-secondary font-bold hover:underline">
                  {step.actionLabel}
                </a>
              ) : (
                <button className="text-label-sm text-on-surface-variant font-bold opacity-50 cursor-not-allowed">
                  {step.actionLabel}
                </button>
              )
            )}
          </div>
        ))}
      </div>
      <button className="w-full mt-xl py-3 border border-dashed border-outline-variant rounded-lg text-label-md text-on-surface-variant hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">add</span>
        Add Custom Goal
      </button>
    </div>
  );
}

export function RecommendationCard({ recommendation, opportunity, onSelect }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-secondary/30 transition-all">
      <div className="flex items-start justify-between mb-md">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
              {recommendation.badge}
            </span>
            <span className="text-label-sm text-on-surface-variant">{opportunity.category}</span>
          </div>
          <Link to={`/opportunities/${opportunity.id}`} className="font-headline-sm text-headline-sm hover:text-secondary transition-colors">
            {opportunity.title}
          </Link>
        </div>
        <div className="text-right">
          <span className="font-display-lg text-[24px] text-secondary">{recommendation.score}%</span>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Match</p>
        </div>
      </div>
      <div className="flex items-center gap-md text-on-surface-variant text-body-sm mb-md">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">business</span>
          <span>{opportunity.platform}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">event</span>
          <span>{opportunity.deadline}</span>
        </div>
      </div>
      <p className="text-body-sm text-on-surface-variant mb-md line-clamp-2">{recommendation.whyRecommended}</p>
      <div className="space-y-1">
        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">Recommended Actions</p>
        {recommendation.recommendedActions?.slice(0, 2).map((action, i) => (
          <div key={i} className="flex items-center gap-2 text-body-sm">
            <span className="material-symbols-outlined text-secondary text-[14px]">arrow_forward</span>
            <span>{action}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onSelect?.(opportunity.id)}
        className="mt-md w-full py-2 border border-outline text-on-surface rounded-lg text-label-md font-bold hover:bg-surface-container transition-all"
      >
        View Details
      </button>
    </div>
  );
}
