import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const TYPE_ICONS = {
  deadline: 'event',
  new_opportunity: 'new_releases',
  daily_summary: 'summarize',
  suggested_action: 'lightbulb',
};

const PRIORITY_STYLES = {
  high: 'border-l-error bg-error-container/10',
  medium: 'border-l-secondary bg-secondary-container/10',
  low: 'border-l-outline bg-surface-container',
};

export default function AlertsPage() {
  const { notifications, dailySummary, markNotificationRead, hasResults } = useApp();

  const upcomingDeadlines = notifications.filter((n) => n.type === 'deadline');
  const newOpportunities = notifications.filter((n) => n.type === 'new_opportunity');
  const dailySummaries = notifications.filter((n) => n.type === 'daily_summary');
  const suggestedActions = notifications.filter((n) => n.type === 'suggested_action');

  const sections = [
    { title: 'Upcoming Deadlines', items: upcomingDeadlines, icon: 'event' },
    { title: 'New Opportunities', items: newOpportunities, icon: 'new_releases' },
    { title: 'Daily Opportunity Summary', items: dailySummaries, icon: 'summarize' },
    { title: 'Suggested Actions', items: suggestedActions, icon: 'lightbulb' },
  ];

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Alert Center</h1>
        <p className="text-body-md text-on-surface-variant">Notifications from the Notification Agent</p>
      </div>

      {!hasResults && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center mb-lg">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">notifications</span>
          <h2 className="font-headline-md text-headline-md mb-md">No Alerts Yet</h2>
          <p className="text-body-md text-on-surface-variant">
            Run <strong>Find Opportunities</strong> to generate deadline alerts, new opportunity notifications, and daily summaries.
          </p>
        </div>
      )}

      {dailySummary && (
        <div className="mb-lg p-lg bg-surface-container rounded-xl border border-outline-variant">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary">today</span>
            <h3 className="font-headline-sm text-headline-sm">Today&apos;s Summary</h3>
          </div>
          <p className="text-body-md text-on-surface-variant">{dailySummary}</p>
        </div>
      )}

      <div className="space-y-xl">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-on-surface-variant">{section.icon}</span>
              <h3 className="font-headline-sm text-headline-sm">{section.title}</h3>
              <span className="text-label-sm text-on-surface-variant">({section.items.length})</span>
            </div>
            {section.items.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant pl-8">No alerts in this category.</p>
            ) : (
              <div className="space-y-md">
                {section.items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-l-4 rounded-lg p-lg border border-outline-variant ${PRIORITY_STYLES[notification.priority] ?? PRIORITY_STYLES.low} ${notification.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant mt-0.5">
                          {TYPE_ICONS[notification.type] ?? 'notifications'}
                        </span>
                        <div>
                          <h4 className="text-body-sm font-bold text-on-surface mb-1">{notification.title}</h4>
                          <p className="text-body-sm text-on-surface-variant">{notification.message}</p>
                          {notification.relatedOpportunityId && (
                            <Link
                              to={`/opportunities/${notification.relatedOpportunityId}`}
                              className="text-label-sm text-secondary font-bold hover:underline mt-2 inline-block"
                            >
                              View Opportunity
                            </Link>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationRead(notification.id)}
                          className="text-label-sm text-secondary hover:underline flex-shrink-0"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
