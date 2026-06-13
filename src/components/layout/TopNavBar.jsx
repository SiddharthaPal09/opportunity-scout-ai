import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import AgentProgress from '../AgentProgress.jsx';

export default function TopNavBar() {
  const { searchQuery, setSearchQuery, findOpportunities, isFinding } = useApp();
  const [showProgress, setShowProgress] = useState(false);
  const [findType, setFindType] = useState(null);

  const handleFind = async () => {
    setFindType('opportunities');
    setShowProgress(true);
    try {
      await findOpportunities(false);
    } finally {
      setTimeout(() => {
        setShowProgress(false);
        setFindType(null);
      }, 2000);
    }
  };

  const handleFindEvents = async () => {
    setFindType('events');
    setShowProgress(true);
    try {
      await findOpportunities(true);
    } finally {
      setTimeout(() => {
        setShowProgress(false);
        setFindType(null);
      }, 2000);
    }
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-surface dark:bg-on-surface border-b border-outline-variant dark:border-outline flex items-center justify-between px-lg z-40">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-64 text-label-md focus:ring-1 focus:ring-primary transition-all"
              placeholder="Search opportunities..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button
            onClick={handleFind}
            disabled={isFinding}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isFinding && findType === 'opportunities' ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Scanning...
              </>
            ) : (
              'Find Opportunities'
            )}
          </button>
          <button
            onClick={handleFindEvents}
            disabled={isFinding}
            className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isFinding && findType === 'events' ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Scanning...
              </>
            ) : (
              'Find Events'
            )}
          </button>
          <div className="flex items-center gap-2">
            <Link
              to="/alerts"
              className="hover:bg-surface-container-highest dark:hover:bg-surface-variant rounded-full p-2 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </Link>
            <Link
              to="/settings"
              className="hover:bg-surface-container-highest dark:hover:bg-surface-variant rounded-full p-2 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </Link>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ijcx7dgTBggfoBmXP2V4N0Roo8vAW0gHRLAJLaYDAjO57Znt53FZ-IFpInPQ6__0oDgHNvfOKto93wJH-moGjaDJmf7fH1hKHCi619FMRTYQMQqOaX2Z70k4sDTdN80Z7j5pIT2sD61SmmoQoMJ8mjy6lnhg1wF0atBaLjOO62VLEreKMW-XOv6vHp203HV3D5u1qpru3u-uVeHJeiD0giTod5tpMW30YO4yZU5GRUDLhc2CVFdaG0-cAXEhvKt3pBOoBrbvsH2N"
            />
          </div>
        </div>
      </nav>
      {showProgress && <AgentProgress />}
    </>
  );
}
