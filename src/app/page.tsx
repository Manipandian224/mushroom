
'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sprout, 
  ShieldAlert, 
  Camera, 
  History, 
  LayoutDashboard,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Info,
  Settings,
  Languages
} from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import Image from 'next/image';
import { diagnoseMushroom, type AnalysisResult } from '@/ai/flows/diagnose-mushroom-flow';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensorStats = [
    { label: 'Temperature', value: '--', unit: '°C', icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-500' },
    { label: 'Humidity', value: '--', unit: '%', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-500' },
    { label: 'CO2', value: '--', unit: 'ppm', icon: <Wind className="w-5 h-5" />, color: 'text-green-500' },
    { label: 'Substrate Moisture', value: '--', unit: '%', icon: <Sprout className="w-5 h-5" />, color: 'text-amber-600' },
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await diagnoseMushroom({
        photoDataUri: selectedImage,
        language: lang,
      });
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header - Fixed to English per request */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl leading-none">MushroomSense AI</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Smart Mushroom Cultivation Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShieldAlert className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar - Fixed to English per request */}
        <aside className="w-64 bg-white border-r hidden lg:flex flex-col p-4 gap-2">
          <SidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
          <SidebarItem icon={<Thermometer className="w-4 h-4" />} label="Live Monitoring" />
          <SidebarItem icon={<History className="w-4 h-4" />} label="History" />
          <SidebarItem icon={<Camera className="w-4 h-4" />} label="AI Doctor" />
          <div className="mt-auto pt-4 border-t flex flex-col gap-2">
            <SidebarItem icon={<ShieldAlert className="w-4 h-4" />} label="Alerts" />
            <SidebarItem icon={<Settings className="w-4 h-4" />} label="Settings" />
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">Smart Cultivation Overview</p>
            </div>
          </header>

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
                  <p className="text-xs text-muted-foreground mt-1 italic">Waiting for sensor data...</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  {t.aiDoctor}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className={`relative flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl transition-colors ${
                    selectedImage ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />

                  {selectedImage ? (
                    <div className="w-full flex flex-col items-center gap-6 px-6">
                      <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden border-4 border-white shadow-xl">
                        <Image 
                          src={selectedImage} 
                          alt="Mushroom preview" 
                          fill 
                          className="object-cover"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 rounded-full shadow-lg"
                          onClick={clearImage}
                          disabled={isAnalyzing}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col gap-4 w-full max-w-sm">
                        {/* Language Selector specifically for AI analysis */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                           <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                {t.analysisLanguage}
                              </span>
                           </div>
                           <LanguageSelector />
                        </div>

                        <Button 
                          className="rounded-full shadow-lg gap-2 h-12 text-base w-full"
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t.loading}
                            </>
                          ) : (
                            <>
                              <Stethoscope className="w-5 h-5" />
                              {t.analyzeImage}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <Button 
                        size="lg" 
                        className="rounded-full shadow-lg gap-2"
                        onClick={handleUploadClick}
                      >
                        <Camera className="w-4 h-4" /> {t.uploadPhoto}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-4 text-center max-w-sm px-4">
                        {t.disclaimer}
                      </p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 animate-in fade-in zoom-in duration-300">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold">{t.analysisFailed}</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border">
                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">{t.condition}</h4>
                        <p className="text-xl font-bold text-slate-900">{analysisResult.condition.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{analysisResult.condition.description}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border">
                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">{t.speciesIdentification}</h4>
                        <p className="text-xl font-bold text-slate-900">{analysisResult.species.name || t.unknown}</p>
                        <p className="text-sm text-slate-600 mt-1">{t.status}: {analysisResult.species.identification_status}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {t.visibleSymptoms}
                        </h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {analysisResult.visible_symptoms.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          {t.possibleCauses}
                        </h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {analysisResult.possible_causes.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                          <Stethoscope className="w-4 h-4" />
                          {t.suggestedSteps}
                        </h4>
                        <ul className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                          {analysisResult.suggested_steps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                      <Info className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed italic">{t.disclaimer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">System Alerts</CardTitle>
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
