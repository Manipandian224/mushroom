'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2 } from 'lucide-react';

const experiences = [
  {
    title: 'UI/UX Design Internship',
    description: 'Gained practical experience in interface design and user-centered design concepts, focusing on creating intuitive digital experiences.',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    title: 'Web & Software Development',
    description: 'Hands-on experience with React, Node.js, MySQL, Firebase, Flask, and modern web development architectures.',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    title: 'IoT & Embedded Systems',
    description: 'Developed sensor-based projects using ESP32, Arduino, NodeMCU, and cloud platforms like Firebase and Supabase.',
    icon: <Calendar className="w-5 h-5" />
  }
];

const achievements = [
  'Developed multiple IoT and AI-based academic projects',
  'Hands-on experience with ESP32 and sensor integration',
  'Experience building cloud-connected IoT dashboards',
  'Experience with AI/computer vision integration',
  'UI/UX design experience'
];

export function Experience() {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience & Learning</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>

            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 shadow-sm">
                    {exp.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="mt-12 p-4 bg-primary/5 rounded-lg border border-primary/10 italic text-muted-foreground">
              "Continuously learning and building practical technology solutions."
            </p>
          </div>

          <div>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Achievements</h2>
              <div className="w-20 h-1.5 bg-primary rounded-full" />
            </div>

            <Card className="glass-card">
              <CardContent className="p-8 space-y-6">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg font-medium">{achievement}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}