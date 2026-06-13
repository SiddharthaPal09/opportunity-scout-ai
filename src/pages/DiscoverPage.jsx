import { useApp } from '../context/AppContext.jsx';
import { opportunities } from '../data/opportunities.js';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Hackathons', 'Internships', 'Scholarships', 'Workshops', 'Conferences', 'Competitions', 'Fellowships'];

export default function DiscoverPage() {
  const { discoveredOpportunities, hasResults } = useApp();
  const displayOpps = hasResults ? discoveredOpportunities : opportunities;

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Discover</h1>
        <p className="text-body-md text-on-surface-variant">Browse opportunities across all categories</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-md mb-xl">
        {CATEGORIES.map((cat) => {
          const count = displayOpps.filter((o) => o.category === cat).length;
          return (
            <div key={cat} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center">
              <span className="font-display-lg text-[24px] text-secondary">{count}</span>
              <p className="text-label-sm text-on-surface-variant mt-1">{cat}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-md">
        {displayOpps.map((opp) => (
          <Link
            key={opp.id}
            to={`/opportunities/${opp.id}`}
            className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-xl p-lg hover:border-secondary/30 transition-all"
          >
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">business</span>
              </div>
              <div>
                <h3 className="text-body-md font-bold">{opp.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{opp.platform} · {opp.category} · {opp.location}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-label-sm text-on-surface-variant">{opp.deadline}</span>
              <p className="text-label-sm text-secondary font-bold">{opp.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
