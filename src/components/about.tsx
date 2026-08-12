'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Code2, Cpu, Lightbulb } from 'lucide-react';

export function About() {
  const profileDetails = [
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Education', value: 'B.Tech Information Technology' },
    { icon: <Cpu className="w-5 h-5" />, label: 'Domain', value: 'IoT' },
    { icon: <Code2 className="w-5 h-5" />, label: 'Interests', value: 'IoT, AI, Embedded, Web' },
    { icon: <Lightbulb className="w-5 h-5" />, label: 'Career Interest', value: 'IoT & AI Solutions' },
  ];

  return (
    <section id="about" className="section-padding bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 leading-relaxed text-lg text-muted-foreground">
            <p>
              I am a B.Tech Information Technology student from Sethu Institute of Technology, Kariapatti, with a strong interest in Internet of Things, embedded systems, artificial intelligence, and software development.
            </p>
            <p>
              My interests include designing sensor-based systems, developing IoT dashboards, integrating cloud platforms, and creating AI-powered applications. I enjoy transforming ideas into practical prototypes by combining hardware, software, databases, and intelligent technologies.
            </p>
            <p>
              I am continuously improving my technical and problem-solving skills through academic projects, internships, and hands-on development.
            </p>
          </div>

          <div>
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  Professional Profile
                </h3>
                <div className="grid gap-6">
                  {profileDetails.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase">{item.label}</p>
                        <p className="text-lg font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}