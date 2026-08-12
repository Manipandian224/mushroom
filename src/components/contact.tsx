'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Github, Send } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="section-padding bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have an idea, project, internship opportunity, or collaboration in IoT, AI, or software development? I'd be happy to connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-8">Contact Info</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Email</p>
                      <a href="mailto:mani.m.s.p@example.com" className="font-medium hover:text-primary transition-colors">mani.m.s.p@sit.edu</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Phone</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">LinkedIn</p>
                      <a href="https://linkedin.com" target="_blank" className="font-medium hover:text-primary transition-colors">manimarisivap</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">GitHub</p>
                      <a href="https://github.com" target="_blank" className="font-medium hover:text-primary transition-colors">mani-msp</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardContent className="p-8">
                <form className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Name</label>
                      <Input placeholder="Enter your name" className="bg-slate-50/50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Email</label>
                      <Input type="email" placeholder="Enter your email" className="bg-slate-50/50 border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Subject</label>
                    <Input placeholder="What is this regarding?" className="bg-slate-50/50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">Message</label>
                    <Textarea placeholder="Tell me more..." className="min-h-[150px] bg-slate-50/50 border-slate-200" />
                  </div>
                  <Button size="lg" className="rounded-full font-bold px-8 w-fit ml-auto">
                    Send Message <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}