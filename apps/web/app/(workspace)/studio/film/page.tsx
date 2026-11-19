'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clapperboard,
  FileText,
  MessageSquare,
  Users,
  Calendar,
  Camera,
  Sparkles,
  Info,
  Send,
  UserCheck,
  MapPin,
  Clock,
  Layers,
  Bot,
  User,
  Wand2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FilmTab =
  | 'Screenplay'
  | 'Dialogue'
  | 'Scene Breakdown'
  | 'Characters'
  | 'Schedule'
  | 'Shot Planning';

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  archetype: string;
  description: string;
  arcNotes: string;
  traits: string[];
}

interface SceneBreakdownItem {
  sceneNumber: number;
  slugline: string;
  location: string;
  timeOfDay: string;
  characters: string[];
  props: string[];
  pages: string;
}

const charactersData: CharacterProfile[] = [
  {
    id: 'char-1',
    name: 'Kaelen "Kael" Cross',
    role: 'Protagonist',
    archetype: 'Rogue Neural Architect',
    description:
      'A disgraced neuro-coder who escaped the Hyperion Syndicate after discovering their memory-harvesting protocol.',
    arcNotes:
      'Starts cynical and isolated; transforms into a self-sacrificing beacon of rebellion after losing his neural anchor.',
    traits: ['Hyper-vigilant', 'Wry humor', 'Cybernetic optic prosthesis', 'Reluctant leader'],
  },
  {
    id: 'char-2',
    name: 'Dr. Maya Lin',
    role: 'Deuteragonist',
    archetype: 'Underground Cybernetic Surgeon',
    description:
      'Brilliant bio-engineer running a clandestine clinic in the Sub-Levels. The moral compass of the crew.',
    arcNotes:
      'Begins as cautious pragmatist; embraces direct revolution when the Syndicate poisons the local water filtration plants.',
    traits: ['Methodical', 'Empathetic', 'Tactical thinker', 'Master bio-hacker'],
  },
  {
    id: 'char-3',
    name: 'Commander Kane Vance',
    role: 'Antagonist',
    archetype: 'Syndicate Enforcement Chief',
    description:
      'Cold, heavily augmented enforcer tasked with retrieving the stolen quantum neural core at all costs.',
    arcNotes:
      'A man who surrendered his humanity for artificial immortality, blinded by absolute corporate order.',
    traits: ['Ruthless', 'Unflinching', 'Sub-dermal armor plating', 'Calculated speech'],
  },
];

const scenesBreakdownData: SceneBreakdownItem[] = [
  {
    sceneNumber: 1,
    slugline: 'EXT. NEO-TOKYO METROPOLIS - DUSK',
    location: 'Metropolis Skyline Platform',
    timeOfDay: 'DUSK',
    characters: ['Kael'],
    props: ['Encrypted Neural Drive', 'Pulse Carbine', 'Couriers Bag'],
    pages: '2 1/8',
  },
  {
    sceneNumber: 2,
    slugline: 'INT. UNDERGROUND REBEL LAB - CONTINUOUS',
    location: 'Maya’s Bio-Clinic Sub-Level 4',
    timeOfDay: 'NIGHT',
    characters: ['Kael', 'Dr. Maya Lin'],
    props: ['Neural Synthesis Table', 'Surgical Laser', 'Flickering Monitors'],
    pages: '3 4/8',
  },
  {
    sceneNumber: 3,
    slugline: 'INT. SYNTHESIS CORRIDOR - NIGHT',
    location: 'Blast Corridor 09',
    timeOfDay: 'NIGHT',
    characters: ['Kael', 'Commander Kane Vance', 'Syndicate Sentinels'],
    props: ['Thermal Breaching Charge', 'Riot Shields', 'EMP Grenades'],
    pages: '2 0/8',
  },
  {
    sceneNumber: 4,
    slugline: 'EXT. SKYLINE PLATFORM - NIGHT',
    location: 'Upper Transit Chasm',
    timeOfDay: 'NIGHT',
    characters: ['Kael', 'Dr. Maya Lin'],
    props: ['Tethered Cargo Skiff', 'Grapple Launcher'],
    pages: '1 6/8',
  },
  {
    sceneNumber: 5,
    slugline: 'INT. HYPERION AIRSHIP COCKPIT - DAWN',
    location: 'Command Airship "Aegis"',
    timeOfDay: 'DAWN',
    characters: ['Commander Kane Vance', 'Syndicate Pilot'],
    props: ['Holographic Radar Array', 'Tactical HUD Headset'],
    pages: '2 2/8',
  },
];

const defaultScreenplayText = `EXT. NEO-TOKYO METROPOLIS - DUSK

Smog choked with electric cobalt rain wraps the jagged spires of Sector 7. 
Holographic advertisements flicker like dying stars across the steel canyon.

KAELEN CROSS (30s), drenched in reflective synth-leather, scrambles onto the observation ledge. His left cybernetic eye WHIRRS, auto-focusing on the air-traffic grid below.

He reaches into his trench coat, pulling out the QUANTUM NEURAL DRIVE. 
The core pulses with an unstable violet luminescence.

KAEL
(whispering to comm-link)
Maya, the packet is extracted. But Kane's hounds are already sniffing the grid.

INTERCUT WITH:

INT. UNDERGROUND REBEL LAB - CONTINUOUS

DR. MAYA LIN (30s) furiously reroutes cooling conduits on the bio-synthesis table. Sparks cascade over the cracked floor.

MAYA
You have three minutes before they scramble the mag-lev interceptors. Drop to the sub-vents, Kael. Do NOT take the catwalk!

KAEL (V.O.)
Too late. The catwalk is my only exit.`;

export default function FilmProductionPage() {
  const [activeTab, setActiveTab] = useState<FilmTab>('Screenplay');
  const [scriptText, setScriptText] = useState(defaultScreenplayText);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content:
        'Hello! I am your AI Film Production & Screenplay Assistant. I can analyze pacing, check character voice consistency, suggest punchy dialogue, or format scene transitions. How can I help with your draft?',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');

    // Generate smart simulated reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Analysis for "${userMsg}":\n\n• Dramatic Tension: High urgency established through short, kinetic sentences.\n• Character Voice: Kael sounds authentically cynical yet determined; Maya's clinical pragmatism contrasts sharply.\n• Pacing Recommendation: Consider adding one micro-beat of sensory hesitation before Kael leaps to heighten the stakes.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/studio"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Back to Studio Hub"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                    Film Production Assistant
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Screenplay authoring, dialogue doctoring, character arcs, and call sheet breakdown
                  </p>
                </div>
              </div>
            </div>

            {/* Quick status badge */}
            <span className="text-xs font-mono text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-lg border border-border">
              Draft 3.2 • 112 Pages Estimated
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-border/50 mt-3 scrollbar-none">
            {(
              [
                'Screenplay',
                'Dialogue',
                'Scene Breakdown',
                'Characters',
                'Schedule',
                'Shot Planning',
              ] as const
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all',
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Informational Banner */}
        <div className="flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sky-200">
          <Info className="h-4 w-4 shrink-0 text-sky-400" />
          <p className="text-xs sm:text-sm">
            This module is a design preview. Actual processing requires engine integration in later development stages.
          </p>
        </div>

        {/* TAB 1: SCREENPLAY (Two-Column: Script on left, AI Assistant on right) */}
        {activeTab === 'Screenplay' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Script Editor (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Standard Screenplay Format (Courier FinalDraft)</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">Scene 1 & 2</span>
              </div>

              {/* Formatted Script Editor */}
              <div className="rounded-xl border border-border bg-background p-4">
                <textarea
                  rows={18}
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  className="w-full font-mono text-xs leading-relaxed text-foreground bg-transparent resize-y focus:outline-none"
                  spellCheck={false}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Auto-saved locally</span>
                <span className="font-mono">Word count: ~180 words</span>
              </div>
            </div>

            {/* Right: AI Assistant Chat Panel (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm flex flex-col h-[580px]">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-rose-400" />
                  <span>AI Script Doctor & Co-Writer</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Online
                </span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex gap-2.5 rounded-xl p-3',
                      msg.role === 'assistant'
                        ? 'border border-border/70 bg-secondary/30 text-foreground'
                        : 'border border-primary/20 bg-primary/10 text-primary-foreground ml-4'
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {msg.role === 'assistant' ? (
                        <Bot className="h-4 w-4 text-rose-400" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {msg.role === 'assistant' ? 'Script Doctor AI' : 'Screenwriter'}
                      </span>
                      <p className="whitespace-pre-line leading-relaxed text-[11px]">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions Chips */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                {[
                  'Analyze scene pacing',
                  'Sharpen Kael\'s dialogue',
                  'Suggest dramatic twist',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setChatInput(s);
                    }}
                    className="rounded-full border border-border/80 bg-secondary/40 px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your screenplay..."
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: DIALOGUE */}
        {activeTab === 'Dialogue' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Character Voice Matrix & Subtext Analysis
                </span>
                <span className="text-xs text-muted-foreground font-mono">3 Voice Profiles</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    char: 'Kaelen Cross',
                    tone: 'Cynical, High Subtext, Clipped',
                    sample: '"Maya, the packet is extracted. But Kane\'s hounds are already sniffing the grid."',
                    suggestion: 'Inject more dry self-deprecation to mirror his weary soldier psyche.',
                  },
                  {
                    char: 'Dr. Maya Lin',
                    tone: 'Urgent, Clinical, Protective',
                    sample: '"Drop to the sub-vents, Kael. Do NOT take the catwalk!"',
                    suggestion: 'Balance technical jargon with emotional vulnerability in high-stress moments.',
                  },
                  {
                    char: 'Commander Kane Vance',
                    tone: 'Methodical, Imperial, Absolute',
                    sample: '"Every neuron in your mind belongs to the Syndicate ledger, Cross."',
                    suggestion: 'Emphasize slow, cadence-controlled delivery for terror induction.',
                  },
                ].map((d) => (
                  <div
                    key={d.char}
                    className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-foreground">{d.char}</h3>
                      <span className="text-[10px] text-primary font-mono">{d.tone}</span>
                    </div>
                    <blockquote className="rounded-lg bg-background p-3 text-xs italic text-muted-foreground border-l-2 border-primary">
                      {d.sample}
                    </blockquote>
                    <p className="text-[11px] text-muted-foreground">
                      <strong className="text-foreground">AI Polish:</strong> {d.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCENE BREAKDOWN */}
        {activeTab === 'Scene Breakdown' && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Automated Scene Breakdown Sheet
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {scenesBreakdownData.length} Scenes Indexed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground uppercase text-[10px] font-semibold">
                    <th className="py-2.5 px-3">Scene #</th>
                    <th className="py-2.5 px-3">Slugline</th>
                    <th className="py-2.5 px-3">Location & Time</th>
                    <th className="py-2.5 px-3">Cast Required</th>
                    <th className="py-2.5 px-3">Props & Special Elements</th>
                    <th className="py-2.5 px-3">Pages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {scenesBreakdownData.map((scene) => (
                    <tr key={scene.sceneNumber} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        #{scene.sceneNumber}
                      </td>
                      <td className="py-3 px-3 font-mono text-foreground font-semibold">
                        {scene.slugline}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>{scene.location}</span>
                          <span className="text-[10px] font-mono text-foreground font-semibold">
                            ({scene.timeOfDay})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {scene.characters.map((c) => (
                            <span
                              key={c}
                              className="rounded bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 text-[10px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {scene.props.map((p) => (
                            <span
                              key={p}
                              className="rounded bg-secondary/80 border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-foreground">
                        {scene.pages}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CHARACTERS */}
        {activeTab === 'Characters' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Character Ensembles & Narrative Arcs
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {charactersData.length} Profiles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {charactersData.map((char) => (
                <div
                  key={char.id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{char.name}</h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{char.role}</p>
                    </div>
                    <span className="rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {char.archetype}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {char.description}
                  </p>

                  <div className="space-y-1.5 rounded-xl border border-border/60 bg-secondary/20 p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                      Character Arc Notes:
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {char.arcNotes}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Key Traits & Signifiers:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {char.traits.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/80 bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SCHEDULE */}
        {activeTab === 'Schedule' && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Principal Photography Production Schedule</span>
              </span>
              <span className="text-xs font-mono text-muted-foreground">3 Production Days</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  day: 'Day 1: Platform & Skyline',
                  date: 'Nov 24, 2026',
                  call: '05:00 AM Call Time',
                  scenes: 'Scenes 1 & 4 (EXT Rooftop & Chasm)',
                  cast: 'Kael, Maya, Stunt Doubles',
                  notes: 'Drone camera unit on standby for dusk golden hour.',
                },
                {
                  day: 'Day 2: Underground Clinic',
                  date: 'Nov 25, 2026',
                  call: '08:00 AM Call Time',
                  scenes: 'Scene 2 (INT Rebel Lab)',
                  cast: 'Kael, Maya',
                  notes: 'Practical neon lighting & haze machines required.',
                },
                {
                  day: 'Day 3: Corridor Breach',
                  date: 'Nov 26, 2026',
                  call: '07:30 AM Call Time',
                  scenes: 'Scene 3 & 5 (Blast Corridor & Cockpit)',
                  cast: 'Kane, Syndicate Troopers, Kael',
                  notes: 'Pyrotechnic squibs and stunt rigging safety inspection.',
                },
              ].map((sch) => (
                <div
                  key={sch.day}
                  className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-foreground">{sch.day}</h3>
                    <span className="text-[10px] font-mono text-primary">{sch.date}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">{sch.call}</p>
                    <p>{sch.scenes}</p>
                    <p className="text-[11px]">Cast: {sch.cast}</p>
                  </div>
                  <div className="rounded bg-background p-2 text-[10px] text-muted-foreground border border-border/50">
                    {sch.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SHOT PLANNING */}
        {activeTab === 'Shot Planning' && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-primary" />
                <span>Director’s Camera & Lens Coverage Plan</span>
              </span>
              <span className="text-xs font-mono text-muted-foreground">Master Shot List</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  shot: 'Shot 1A • Master Establishing',
                  lens: 'Cooke Anamorphic 32mm T2.3',
                  rig: 'Technocrane 30ft on track',
                  description: 'Descends from smoggy stratosphere down to Kael perched on rain-slicked ledge.',
                },
                {
                  shot: 'Shot 2B • Emotional Close-Up',
                  lens: 'Cooke Anamorphic 75mm T2.3',
                  rig: 'Handheld with EasyRig',
                  description: 'Tight on Maya’s eyes reflecting fluctuating bioluminescent monitor graphs.',
                },
                {
                  shot: 'Shot 3C • Breach Explosion Dutch',
                  lens: 'Arri Master Prime 18mm T1.3',
                  rig: 'Hard-mounted crash housing',
                  description: 'Dutch angle low-tilt as blast doors blow outward with sparks and smoke.',
                },
                {
                  shot: 'Shot 4D • Chasm Leap Profile',
                  lens: 'Cooke Anamorphic 50mm T2.3',
                  rig: 'High-speed cable cam',
                  description: 'Follows Kael mid-air across the 60-foot gap with neon cityscape receding below.',
                },
              ].map((pl) => (
                <div
                  key={pl.shot}
                  className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-foreground">{pl.shot}</h3>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {pl.lens}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-muted-foreground">Rig: {pl.rig}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pl.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
