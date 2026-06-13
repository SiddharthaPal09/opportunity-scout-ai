import { useApp } from '../../context/AppContext.jsx';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/discover', icon: 'explore', label: 'Discover' },
  { to: '/opportunities', icon: 'track_changes', label: 'Opportunities', filled: true },
  { to: '/skill-insights', icon: 'psychology', label: 'Skill Insights' },
  { to: '/alerts', icon: 'notifications', label: 'Alerts' },
  { to: '/agents', icon: 'smart_toy', label: 'Agent Activity' },
  { to: '/analytics', icon: 'analytics', label: 'Analytics' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function SideNavBar() {
  const { unreadCount } = useApp();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-container-low dark:bg-inverse-surface border-r border-outline-variant dark:border-outline flex flex-col py-md z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              explore
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface leading-tight">
              Opportunity Scout
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Professional Intelligence
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'text-secondary dark:text-secondary-fixed border-l-2 border-secondary bg-surface-container dark:bg-surface-variant'
                  : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={isActive && item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md flex-1">{item.label}</span>
                {item.label === 'Alerts' && unreadCount > 0 && (
                  <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 mt-auto space-y-4">
        <div className="p-4 bg-primary-container rounded-xl text-on-primary-container relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-label-sm font-bold mb-1 text-on-primary">PRO ACCESS</p>
            <p className="text-[11px] mb-3 opacity-80">Unlock 20+ additional skill gaps.</p>
            <button className="w-full py-2 bg-surface text-primary rounded-lg text-label-md font-bold hover:bg-opacity-90 transition-all">
              Upgrade Plan
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
          </div>
        </div>
        <div className="border-t border-outline-variant pt-4 space-y-1">
          <a className="flex items-center gap-3 px-2 py-2 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="text-label-md">Support</span>
          </a>
          <a className="flex items-center gap-3 px-2 py-2 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-label-md">Sign Out</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
