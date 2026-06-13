import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { RecommendationCard } from '../components/OpportunityComponents.jsx';

export default function OpportunitiesPage() {
  const { recommendations, hasResults, isFinding, matches, getOppById } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Opportunities</h1>
        <p className="text-body-md text-on-surface-variant">
          {hasResults
            ? `${recommendations.rankedOpportunities.length} personalized recommendations from the multi-agent pipeline`
            : 'Run the agent pipeline to discover matching opportunities'}
        </p>
      </div>

      {!hasResults && !isFinding && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">explore</span>
          <h2 className="font-headline-md text-headline-md mb-md">No Recommendations Yet</h2>
          <p className="text-body-md text-on-surface-variant mb-lg max-w-md mx-auto">
            Click <strong>Find Opportunities</strong> to activate the Discovery, Profile Analysis, Matching, Recommendation, and Notification agents.
          </p>
          <div className="grid grid-cols-5 gap-md max-w-2xl mx-auto text-left">
            {['Discovery', 'Profile', 'Matching', 'Recommendation', 'Notification'].map((agent) => (
              <div key={agent} className="p-3 bg-surface-container rounded-lg border border-outline-variant">
                <span className="material-symbols-outlined text-secondary text-[20px] mb-1">smart_toy</span>
                <p className="text-label-sm font-bold">{agent}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isFinding && (
        <div className="flex items-center justify-center py-xl">
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] text-secondary animate-spin mb-md">progress_activity</span>
            <p className="text-body-md text-on-surface-variant">Agents are analyzing opportunities...</p>
          </div>
        </div>
      )}

      {hasResults && (
        <>
          {recommendations.overallInsights && (
            <div className="mb-lg p-lg bg-surface-container rounded-xl border border-outline-variant">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm">AI Insights</h3>
              </div>
              <p className="text-body-md text-on-surface-variant">{recommendations.overallInsights}</p>
              {recommendations.nextBestAction && (
                <p className="text-body-sm text-secondary font-bold mt-2">{recommendations.nextBestAction}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {recommendations.rankedOpportunities.map((rec) => {
              const opportunity = getOppById(rec.opportunityId);
              if (!opportunity) return null;
              return (
                <RecommendationCard
                  key={rec.opportunityId}
                  recommendation={rec}
                  opportunity={opportunity}
                  onSelect={(id) => navigate(`/opportunities/${id}`)}
                />
              );
            })}
          </div>

          {matches.length > recommendations.rankedOpportunities.length && (
            <div className="mt-xl">
              <h3 className="font-headline-sm text-headline-sm mb-lg">All Matches</h3>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="text-left p-md text-label-sm uppercase text-on-surface-variant">Opportunity</th>
                      <th className="text-left p-md text-label-sm uppercase text-on-surface-variant">Category</th>
                      <th className="text-left p-md text-label-sm uppercase text-on-surface-variant">Platform</th>
                      <th className="text-left p-md text-label-sm uppercase text-on-surface-variant">Deadline</th>
                      <th className="text-right p-md text-label-sm uppercase text-on-surface-variant">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => {
                      const opp = getOppById(match.opportunityId);
                      if (!opp) return null;
                      return (
                        <tr key={match.opportunityId} className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                          <td className="p-md">
                            <Link to={`/opportunities/${opp.id}`} className="text-body-sm font-medium hover:text-secondary">
                              {opp.title}
                            </Link>
                          </td>
                          <td className="p-md text-body-sm text-on-surface-variant">{opp.category}</td>
                          <td className="p-md text-body-sm text-on-surface-variant">{opp.platform}</td>
                          <td className="p-md text-body-sm text-on-surface-variant">{opp.deadline}</td>
                          <td className="p-md text-right">
                            <span className={`font-bold ${match.score >= 80 ? 'text-secondary' : match.score >= 60 ? 'text-tertiary-container' : 'text-on-surface-variant'}`}>
                              {match.score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
