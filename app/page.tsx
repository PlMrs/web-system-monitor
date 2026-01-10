// app/page.tsx
import SystemMonitor from './components/SystemMonitor';

export const metadata = {
  title: 'Star2Lte Dashboard',
  description: 'Monitoring système pour LineageOS 20',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Vous pouvez ajouter d'autres composants ici (ex: météo, contrôles HA) */}
      <SystemMonitor />
    </main>
  );
}