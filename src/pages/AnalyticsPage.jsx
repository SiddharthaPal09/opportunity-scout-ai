import { useApp } from '../context/AppContext.jsx';
import { opportunities } from '../data/opportunities.js';

export default function AnalyticsPage() {
  const { matches, hasResults } = useApp();

  const categoryCounts = opportunities.reduce((acc, o) => {
    acc[o.category] = (acc[o.category] || 0) + 1;
    return acc;
  }, {});

  const avgMatch = hasResults && matches.length > 0
    ? Math.round(matches.reduce((s, m) => s + m.score, 0) / matches.length)
    : 0;

  const scoreDistribution = hasResults
    ? {
        high: matches.filter((m) => m.score >= 80).length,
        medium: matches.filter((m) => m.score >= 60 && m.score < 80).length,
        low: matches.filter((m) => m.score < 60).length,
      }
    : { high: 0, medium: 0, low: 0 };

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Analytics</h1>
        <p className="text-body-md text-on-surface-variant">Opportunity intelligence metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <p className="text-label-sm text-on-surface-variant uppercase font-bold mb-2">Average Match Score</p>
          <span className="font-display-lg text-[36px] text-secondary">{hasResults ? `${avgMatch}%` : '—'}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <p className="text-label-sm text-on-surface-variant uppercase font-bold mb-2">Dataset Size</p>
          <span className="font-display-lg text-[36px] text-on-surface">{opportunities.length}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <p className="text-label-sm text-on-surface-variant uppercase font-bold mb-2">Total Matches</p>
          <span className="font-display-lg text-[36px] text-on-surface">{hasResults ? matches.length : '—'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Opportunities by Category</h3>
          <div className="space-y-md">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-body-sm mb-1">
                  <span>{cat}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${(count / opportunities.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Match Score Distribution</h3>
          {hasResults ? (
            <div className="space-y-lg">
              {[
                { label: 'High Match (80%+)', count: scoreDistribution.high, color: 'bg-secondary' },
                { label: 'Medium Match (60-79%)', count: scoreDistribution.medium, color: 'bg-tertiary-container' },
                { label: 'Low Match (<60%)', count: scoreDistribution.low, color: 'bg-outline' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-body-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${matches.length > 0 ? (item.count / matches.length) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-on-surface-variant">Run Find Opportunities to see match distribution.</p>
          )}
        </div>
      </div>
    </>
  );
}
