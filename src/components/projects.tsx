'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowRight } from 'lucide-react';
import images from '@/app/lib/placeholder-images.json';

const projects = [
  {
    id: 'project-irrigation',
    title: 'AI-Enabled Smart Night-Time Irrigation & Fertigation System',
    description: 'An IoT-based smart agriculture system designed to automate irrigation and fertigation while monitoring plant and environmental conditions. The system combines sensors, ESP32, cloud connectivity, and an intelligent dashboard.',
    technologies: ['ESP32', 'IoT', 'Sensors', 'Firebase', 'Web Dashboard', 'AI'],
  },
  {
    id: 'project-parking',
    title: 'Smart Parking System',
    description: 'An IoT-based smart parking solution that detects parking slot availability and automates vehicle entry using sensors and RFID. Real-time parking information can be monitored through a connected dashboard.',
    technologies: ['ESP32', 'RFID', 'Ultrasonic Sensors', 'Servo Motor', 'Firebase', 'IoT'],
  },
  {
    id: 'project-recircle',
    title: 'ReCircle – Smart Waste Management Platform',
    description: 'A technology-driven circular economy platform designed to connect waste generators, collectors, and buyers. Features waste uploading, AI classification, price calculation, and pickup scheduling.',
    technologies: ['AI', 'Computer Vision', 'React', 'Firebase', 'Supabase', 'Roboflow'],
  },
  {
    id: 'project-jaundice',
    title: 'Smart Jaundice Detection System',
    description: 'An AI and sensor-based healthcare prototype designed to assist in jaundice screening by analyzing optical characteristics using a multispectral sensing approach.',
    technologies: ['ESP32', 'AS7262 Multispectral Sensor', 'AI', 'IoT', 'Data Analysis'],
  }
];

export function Projects() {
  return (
    <section id="projects" className="section-padding bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const projectImage = images.images.find(img => img.id === project.id);
            return (
              <Card key={project.id} className="glass-card overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={projectImage?.url || ''}
                    width={projectImage?.width || 800}
                    height={projectImage?.height || 600}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={projectImage?.hint}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="rounded-full">
                      View Project <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-primary border-primary/20">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline">+{project.technologies.length - 3} more</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0 text-primary font-bold hover:underline group/btn flex items-center gap-1">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
