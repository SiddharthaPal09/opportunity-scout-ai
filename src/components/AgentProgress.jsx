import { useApp } from '../context/AppContext.jsx';

export default function AgentProgress() {
  const { agentSteps, currentStep, completedSteps, isFinding } = useApp();

  if (!isFinding && currentStep !== 'complete') return null;

  return (
    <div className="fixed top-16 right-0 w-[calc(100%-240px)] z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <div className="max-w-[1440px] mx-auto px-xl py-md">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-secondary text-[20px] animate-pulse">smart_toy</span>
          <h3 className="font-headline-sm text-headline-sm">Multi-Agent Pipeline Active</h3>
        </div>
        <div className="grid grid-cols-5 gap-md">
          {agentSteps.map((step) => {
            const isComplete = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            const isPending = !isComplete && !isActive;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all ${
                  isComplete
                    ? 'bg-secondary-container/20 border-secondary/30'
                    : isActive
                      ? 'bg-surface-container border-secondary animate-pulse'
                      : 'bg-surface-container-low border-outline-variant opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isComplete ? (
                    <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  ) : isActive ? (
                    <span className="material-symbols-outlined text-secondary text-[16px] animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">radio_button_unchecked</span>
                  )}
                  <span className="text-label-sm font-bold truncate">{step.label}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-tight">
                  {isPending ? 'Waiting...' : isActive ? step.description : 'Complete'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
