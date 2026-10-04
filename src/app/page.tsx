
'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Languages,
  Wifi
} from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import Image from 'next/image';
import { diagnoseMushroom, type AnalysisResult } from '@/ai/flows/diagnose-mushroom-flow';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '@/firebase/config';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sensorData, setSensorData] = useState<{
    temperature: string;
    humidity: string;
    co2: string;
    moisture: string;
    isConnected: boolean;
    lastUpdated: string | null;
  }>({
    temperature: '--',
    humidity: '--',
    co2: '--',
    moisture: '--',
    isConnected: false,
    lastUpdated: null,
  });

  useEffect(() => {
    const sensorRef = ref(realtimeDb, '/');
    
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Inspect root or nested nodes (e.g. sensors, sensorData, readings)
        const rootData = data.sensors || data.sensorData || data.readings || data.data || data;
        
        const temp = rootData.temperature ?? rootData.temp ?? rootData.Temp ?? rootData.Temperature;
        const hum = rootData.humidity ?? rootData.hum ?? rootData.Hum ?? rootData.Humidity;
        const co2 = rootData.co2 ?? rootData.CO2 ?? rootData.Co2;
        const moisture = rootData.substrate_moisture ?? rootData.moisture ?? rootData.SubstrateMoisture ?? rootData.soil_moisture ?? rootData.Substrate;

        setSensorData({
          temperature: temp !== undefined && temp !== null ? String(temp) : '--',
          humidity: hum !== undefined && hum !== null ? String(hum) : '--',
          co2: co2 !== undefined && co2 !== null ? String(co2) : '--',
          moisture: moisture !== undefined && moisture !== null ? String(moisture) : '--',
          isConnected: true,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      }
    }, (err) => {
      console.warn("Firebase Realtime DB connection info:", err);
    });

    return () => unsubscribe();
  }, []);

  const sensorStats = [
    { label: 'Temperature', value: sensorData.temperature, unit: '°C', icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-500' },
    { label: 'Humidity', value: sensorData.humidity, unit: '%', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-500' },
    { label: 'CO2', value: sensorData.co2, unit: 'ppm', icon: <Wind className="w-5 h-5" />, color: 'text-green-500' },
    { label: 'Substrate Moisture', value: sensorData.moisture, unit: '%', icon: <Sprout className="w-5 h-5" />, color: 'text-amber-600' },
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
        language: 'en',
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
      {/* Header */}
      <nav className="bg-white border-b px-6 py-4 flex justify-center items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-sm">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-xl leading-none tracking-tight text-slate-900">MushroomSense AI</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Smart Mushroom Cultivation Monitoring</p>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-5xl mx-auto w-full">
          <header className="text-center space-y-1">
            <h2 className="text-3xl font-bold text-slate-900">Mushroom AI Doctor</h2>
            <p className="text-muted-foreground">Upload an image to diagnose mushroom health and get instant solutions</p>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {sensorStats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{stat.label}</CardTitle>
                  <div className={`${stat.color} bg-slate-50 p-1.5 sm:p-2 rounded-full shrink-0`}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <div className="text-xl sm:text-2xl font-bold">
                    {stat.value}
                    <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-0.5 sm:ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 italic truncate">
                    {sensorData.isConnected ? (
                      <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        Firebase Live
                      </span>
                    ) : (
                      "Connecting..."
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Camera className="w-6 h-6 text-blue-600" />
                AI Mushroom Analysis
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
                      <Button 
                        className="rounded-full shadow-lg gap-2 h-12 text-base w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Stethoscope className="w-5 h-5" />
                            Analyze Image
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
                      className="rounded-full shadow-lg gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={handleUploadClick}
                    >
                      <Camera className="w-4 h-4" /> Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4 text-center max-w-sm px-4">
                      Upload a clear photo of your mushroom crop to identify health problems and get recommendations.
                    </p>
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold">Analysis Failed</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                  {/* Problem Section */}
                  <div className="p-5 rounded-2xl bg-red-50/90 border border-red-200 space-y-3">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
                      <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                      <h3>Problem: {analysisResult.condition.name}</h3>
                    </div>
                    <p className="text-sm text-red-900 leading-relaxed font-medium pl-8">
                      {analysisResult.condition.description}
                    </p>

                    {analysisResult.visible_symptoms && analysisResult.visible_symptoms.length > 0 && (
                      <div className="pt-2 pl-8">
                        <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Visible Symptoms:</h4>
                        <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                          {analysisResult.visible_symptoms.map((symptom, i) => (
                            <li key={i}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.possible_causes && analysisResult.possible_causes.length > 0 && (
                      <div className="pt-1 pl-8">
                        <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Possible Causes:</h4>
                        <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                          {analysisResult.possible_causes.map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Solution Section */}
                  <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <h3>Solution & Next Steps</h3>
                    </div>
                    <ol className="list-decimal list-inside text-sm text-emerald-950 space-y-2 font-medium pl-8">
                      {analysisResult.suggested_steps.map((step, i) => (
                        <li key={i} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {analysisResult.species && (
                    <div className="p-4 rounded-xl bg-slate-100 border text-xs text-slate-600 flex justify-between items-center">
                      <span>Identified Species: <strong className="text-slate-800">{analysisResult.species.name || 'Unknown'}</strong></span>
                      {analysisResult.confidence !== null && (
                        <span>Confidence: <strong className="text-slate-800">{Math.round(analysisResult.confidence * 100)}%</strong></span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
