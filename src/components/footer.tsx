'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="py-12 px-6 border-t bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-2">
            <span>Mani Mari Siva P</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">
            B.Tech Information Technology student specializing in IoT & AI.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex items-center gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:mani.m.s.p@sit.edu" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-muted-foreground text-sm">
            © {year || '2026'} Mani Mari Siva P. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
