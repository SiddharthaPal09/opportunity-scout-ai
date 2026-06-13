import { useApp } from '../context/AppContext.jsx';

export default function AgentActivityPage() {
  const { agentRuns, isFinding, currentStep, agentSteps, completedSteps } = useApp();

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Agent Activity</h1>
        <p className="text-body-md text-on-surface-variant">Multi-agent pipeline execution history</p>
      </div>

      {isFinding && (
        <div className="mb-lg p-lg bg-surface-container rounded-xl border border-secondary/30">
          <div className="flex items-center gap-2 mb-md">
            <span className="material-symbols-outlined text-secondary animate-spin">progress_activity</span>
            <h3 className="font-headline-sm text-headline-sm">Pipeline Running</h3>
          </div>
          <div className="grid grid-cols-5 gap-md">
            {agentSteps.map((step) => {
              const isComplete = completedSteps.includes(step.id);
              const isActive = currentStep === step.id;
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center ${
                    isComplete ? 'bg-secondary-container/20 border-secondary/30' : isActive ? 'bg-surface-container border-secondary animate-pulse' : 'opacity-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-[24px] mb-1">smart_toy</span>
                  <p className="text-label-sm font-bold">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {agentRuns.length === 0 && !isFinding ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">smart_toy</span>
          <h2 className="font-headline-md text-headline-md mb-md">No Agent Activity</h2>
          <p className="text-body-md text-on-surface-variant">
            Click <strong>Find Opportunities</strong> to start the 5-agent pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-md">
          {agentRuns.map((run, index) => (
            <div key={`${run.agent}-${index}`} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">smart_toy</span>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm">{run.agent}</h3>
                    <p className="text-label-sm text-on-surface-variant">{new Date(run.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <span className="bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-bold uppercase">
                  {run.status}
                </span>
              </div>
              <div className="bg-surface-container rounded-lg p-md">
                <pre className="text-mono-data text-on-surface-variant overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(run.output, null, 2).slice(0, 500)}
                  {JSON.stringify(run.output).length > 500 ? '...' : ''}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
