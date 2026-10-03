
'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Sprout, ShieldAlert, Camera, History, LayoutDashboard } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';

export default function Dashboard() {
  const { t } = useLanguage();

  const sensorStats = [
    { label: t.temperature, value: '--', unit: '°C', icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-500' },
    { label: t.humidity, value: '--', unit: '%', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-500' },
    { label: t.co2, value: '--', unit: 'ppm', icon: <Wind className="w-5 h-5" />, color: 'text-green-500' },
    { label: t.moisture, value: '--', unit: '%', icon: <Sprout className="w-5 h-5" />, color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none">{t.appName}</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShieldAlert className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden lg:flex flex-col p-4 gap-2">
          <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label={t.dashboard} active />
          <SidebarItem icon={<Thermometer className="w-4 h-4" />} label={t.liveMonitoring} />
          <SidebarItem icon={<History className="w-4 h-4" />} label={t.history} />
          <SidebarItem icon={<Camera className="w-4 h-4" />} label={t.aiDoctor} />
          <SidebarItem icon={<History className="w-4 h-4" />} label={t.analysisHistory} />
          <div className="mt-auto pt-4 border-t flex flex-col gap-2">
            <SidebarItem icon={<ShieldAlert className="w-4 h-4" />} label={t.alerts} />
            <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label={t.settings} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 space-y-8">
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold">{t.dashboard}</h2>
              <p className="text-muted-foreground">{t.tagline}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{t.lastUpdated}: --</p>
            </div>
          </header>

          {/* Sensor Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensorStats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <div className={`${stat.color} bg-slate-50 p-2 rounded-full`}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">{t.waitingForData}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions / AI Preview */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  {t.aiDoctor}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                <Button size="lg" className="rounded-full shadow-lg gap-2">
                  <Camera className="w-4 h-4" /> {t.uploadPhoto}
                </Button>
                <p className="text-sm text-muted-foreground mt-4 text-center max-w-sm">
                  {t.disclaimer.slice(0, 100)}...
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{t.alerts}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <ShieldAlert className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm italic">No active alerts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start gap-3 rounded-xl font-medium ${active ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700' : ''}`}
    >
      {icon}
      {label}
    </Button>
  );
}
