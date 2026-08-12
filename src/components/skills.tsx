'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Code, Globe, Database, Brain, Palette } from 'lucide-react';

const skillCategories = [
  {
    title: 'IoT & Embedded',
    icon: <Cpu className="w-5 h-5" />,
    skills: ['ESP32', 'Arduino', 'NodeMCU', 'Sensors', 'Embedded Systems', 'IoT Architecture', 'MQTT', 'Firebase']
  },
  {
    title: 'Programming',
    icon: <Code className="w-5 h-5" />,
    skills: ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL']
  },
  {
    title: 'Web Development',
    icon: <Globe className="w-5 h-5" />,
    skills: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'Flask']
  },
  {
    title: 'Database & Cloud',
    icon: <Database className="w-5 h-5" />,
    skills: ['MySQL', 'Firebase Realtime Database', 'Firebase Storage', 'Supabase']
  },
  {
    title: 'AI & Tools',
    icon: <Brain className="w-5 h-5" />,
    skills: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'Roboflow', 'Git', 'GitHub']
  },
  {
    title: 'Design',
    icon: <Palette className="w-5 h-5" />,
    skills: ['UI/UX Design', 'Responsive Web Design']
  }
];

export function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <Card key={idx} className="glass-card hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-3">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                  {category.icon}
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 font-medium bg-slate-100 hover:bg-primary hover:text-white transition-colors">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}