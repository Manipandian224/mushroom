'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, ArrowRight, MousePointer2 } from 'lucide-react';
import Image from 'next/image';
import images from '@/app/lib/placeholder-images.json';

export function Hero() {
  const heroImage = images.images.find(img => img.id === 'hero-bg');

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-5 bg-gradient-to-l from-primary to-transparent" />
      <div className="absolute top-[20%] left-[10%] -z-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <div>
            <h2 className="text-primary font-semibold mb-2 tracking-wide uppercase text-sm">Welcome to my portfolio</h2>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Hi, I'm <span className="text-gradient">Mani Mari Siva P</span>
            </h1>
          </div>
          
          <h3 className="text-xl md:text-2xl text-muted-foreground font-medium">
            B.Tech IT Student | IoT Enthusiast | AI & Embedded Systems Developer
          </h3>
          
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            I am a B.Tech Information Technology student passionate about IoT, embedded systems, artificial intelligence, and modern web technologies. I enjoy building practical technology solutions that connect hardware, software, and intelligent systems to solve real-world problems.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8" suppressHydrationWarning>
              <a href="#projects">
                View My Projects <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8" suppressHydrationWarning>
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
          
          <div className="flex items-center gap-6 pt-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="relative hidden md:block animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
          <div className="relative z-10 rounded-2xl overflow-hidden border-8 border-white shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500">
            <Image
              src={heroImage?.url || ''}
              width={heroImage?.width || 1920}
              height={heroImage?.height || 1080}
              alt={heroImage?.alt || 'Mani Mari Siva P'}
              className="object-cover aspect-[4/5]"
              data-ai-hint={heroImage?.hint}
            />
          </div>
          {/* Accent elements - Refined badge size */}
          <div className="absolute -bottom-4 -left-4 z-20 bg-white py-3 px-5 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <MousePointer2 className="text-primary w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Latest Project</p>
              <p className="text-sm font-bold text-slate-900">AI Smart Irrigation</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </section>
  );
}
