import { useApp } from '../context/AppContext.jsx';
import { isGeminiConfigured } from '../services/geminiService.js';

export default function SettingsPage() {
  const { userProfile } = useApp();
  const geminiConfigured = isGeminiConfigured();

  return (
    <>
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Settings</h1>
        <p className="text-body-md text-on-surface-variant">Platform configuration</p>
      </div>

      <div className="space-y-lg max-w-2xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Profile</h3>
          <div className="space-y-md">
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase font-bold">Career Goal</label>
              <p className="text-body-md mt-1">{userProfile.careerGoal}</p>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase font-bold">Experience Level</label>
              <p className="text-body-md mt-1 capitalize">{userProfile.experienceLevel}</p>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase font-bold">Skills</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {userProfile.skills.map((s) => (
                  <span key={s} className="bg-surface-container px-3 py-1 rounded-lg text-label-md">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase font-bold">Interests</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {userProfile.interests.map((i) => (
                  <span key={i} className="bg-surface-container px-3 py-1 rounded-lg text-label-md">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Gemini API</h3>
          <div className="flex items-center gap-3 mb-md">
            <span className={`w-3 h-3 rounded-full ${geminiConfigured ? 'bg-secondary' : 'bg-error'}`} />
            <span className="text-body-sm">{geminiConfigured ? 'API key configured' : 'API key not configured'}</span>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            Set <code className="bg-surface-container px-1 rounded">VITE_GEMINI_API_KEY</code> in your <code className="bg-surface-container px-1 rounded">.env</code> file to enable AI-powered recommendations. The platform works with local fallbacks when no key is set.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl">
          <h3 className="font-headline-sm text-headline-sm mb-lg">Multi-Agent System</h3>
          <div className="space-y-2">
            {['Discovery Agent', 'Profile Analysis Agent', 'Matching Agent', 'Recommendation Agent', 'Notification Agent'].map((agent) => (
              <div key={agent} className="flex items-center gap-3 p-md bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px]">smart_toy</span>
                <span className="text-body-sm font-medium">{agent}</span>
                <span className="ml-auto text-label-sm text-secondary">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
