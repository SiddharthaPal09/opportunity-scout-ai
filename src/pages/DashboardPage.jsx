import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { opportunities } from '../data/opportunities.js';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { hasResults, matches, recommendations, notifications, dailySummary, userProfile, addUserSkills, removeUserSkill, getOppById } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkills = (e) => {
    e.preventDefault();
    const skills = skillInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (skills.length > 0) {
      addUserSkills(skills);
    }
    setSkillInput('');
    setIsModalOpen(false);
  };

  const categories = [...new Set(opportunities.map((o) => o.category))];
  const highMatches = matches.filter((m) => m.score >= 80).length;
  const unreadAlerts = notifications.filter((n) => !n.read).length;

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Dashboard</h1>
        <p className="text-body-md text-on-surface-variant">Opportunity intelligence overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
        {[
          { label: 'Total Opportunities', value: opportunities.length, icon: 'explore' },
          { label: 'High Matches', value: hasResults ? highMatches : '—', icon: 'stars' },
          { label: 'Unread Alerts', value: unreadAlerts, icon: 'notifications' },
          { label: 'Categories', value: categories.length, icon: 'category' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary">{stat.icon}</span>
              <span className="text-label-sm text-on-surface-variant uppercase font-bold">{stat.label}</span>
            </div>
            <span className="font-display-lg text-[28px] text-on-surface">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-lg">
              <h3 className="font-headline-sm text-headline-sm">Your Profile</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-label-md text-primary font-bold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Skill
              </button>
            </div>
            <p className="text-body-sm text-on-surface-variant mb-md">{userProfile.careerGoal}</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((s) => (
                <span key={s} className="group flex items-center gap-1 bg-secondary-container/20 px-3 py-1 rounded-lg text-label-md transition-all">
                  <span>{s}</span>
                  <button
                    onClick={() => removeUserSkill(s)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-black/10 hover:text-on-surface text-[14px] leading-none focus:outline-none cursor-pointer"
                    style={{ marginLeft: '2px', marginRight: '-4px' }}
                    title={`Remove ${s}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Quick Actions</h3>
          <div className="space-y-md">
            <Link to="/opportunities" className="flex items-center gap-3 p-md bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">track_changes</span>
              <span className="text-body-sm font-medium">View Recommendations</span>
            </Link>
            <Link to="/skill-insights" className="flex items-center gap-3 p-md bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">psychology</span>
              <span className="text-body-sm font-medium">Skill Gap Analysis</span>
            </Link>
            <Link to="/alerts" className="flex items-center gap-3 p-md bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">notifications</span>
              <span className="text-body-sm font-medium">Alert Center</span>
            </Link>
          </div>
        </div>
      </div>

      {dailySummary && (
        <div className="mt-xl p-lg bg-surface-container rounded-xl border border-outline-variant">
          <h3 className="font-headline-sm text-headline-sm mb-2">Latest Scan Summary</h3>
          <p className="text-body-md text-on-surface-variant">{dailySummary}</p>
        </div>
      )}

      {hasResults && recommendations?.rankedOpportunities?.[0] && (
        <div className="mt-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Top Recommendation</h3>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <p className="text-body-md font-bold mb-1">
              {getOppById(recommendations.rankedOpportunities[0].opportunityId)?.title}
            </p>
            <p className="text-body-sm text-on-surface-variant">{recommendations.rankedOpportunities[0].whyRecommended}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl max-w-md w-full shadow-2xl relative">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-md text-headline-md">Add Skills</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded-full p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSkills}>
              <p className="text-body-sm text-on-surface-variant mb-md">
                Enter one or more skills separated by commas (e.g., Docker, Kubernetes, AWS).
              </p>
              <input
                type="text"
                autoFocus
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:ring-1 focus:ring-primary focus:outline-none transition-all mb-lg"
                placeholder="e.g. Docker, Kubernetes, AWS"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <div className="flex justify-end gap-md">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-outline text-on-surface px-4 py-2 rounded-lg font-label-md hover:bg-surface-container transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all"
                >
                  Add Skills
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
