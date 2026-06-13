import SideNavBar from './SideNavBar.jsx';
import TopNavBar from './TopNavBar.jsx';

export default function MainLayout({ children }) {
  return (
    <div className="bg-surface font-body-md text-on-surface selection:bg-secondary-container min-h-screen">
      <SideNavBar />
      <TopNavBar />
      <main className="ml-60 pt-16 min-h-screen bg-surface">
        <div className="max-w-[1440px] mx-auto p-xl">{children}</div>
      </main>
      <div className="fixed top-24 left-72 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}
