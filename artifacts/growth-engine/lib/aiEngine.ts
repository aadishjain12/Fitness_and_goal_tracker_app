export type QuoteCategory = 'stoic' | 'tech';

export interface Quote {
  text: string;
  author: string;
  category: QuoteCategory;
  context: string;
  application: string;
  theme: 'discipline' | 'resilience' | 'leadership' | 'focus' | 'change';
}

export interface BreathingExercise {
  title: string;
  steps: string[];
  duration: string;
  philosophy: string;
}

export interface BounceBackStrategy {
  title: string;
  steps: string[];
  stoicPrinciple: string;
}

export interface AuditReport {
  score: number;
  grade: string;
  strengths: string[];
  bugs: string[];
  patches: string[];
  summary: string;
}

const QUOTES: Quote[] = [
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    category: "stoic",
    context: "Written in Marcus Aurelius's private journal while commanding Roman legions during plague and war. He faced simultaneous external invasions and internal political betrayal — this was his mental armor.",
    application: "When nicotine cravings hit or a job rejection lands, the obstacle IS the path. Each craving you beat makes your willpower neural pathway stronger. Each rejection sharpens your pitch.",
    theme: "resilience"
  },
  {
    text: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "stoic",
    context: "Emperor of Rome, Marcus had absolute power over millions — yet he understood his true domain was only his own mind. He wrote this after losing his son to illness.",
    application: "An interviewer's harsh feedback is an outside event. Your response — studying harder, refining your story — is your power. Focus only on what you control.",
    theme: "focus"
  },
  {
    text: "It is not that we have a short time to live, but that we waste a great deal of it.",
    author: "Seneca",
    category: "stoic",
    context: "Seneca wrote this exiled on an island, watching courtiers waste years chasing approval. He later served as Nero's advisor and watched power corrupt absolutely.",
    application: "Every cigarette is 11 minutes of life. Every hour of deliberate PM study compounds like interest. The question isn't 'do you have time?' — it's 'what are you choosing to build?'",
    theme: "discipline"
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    category: "stoic",
    context: "Epictetus was born a slave. He had nothing — no freedom, no property, no rights. Yet he became one of antiquity's greatest philosophers. Identity first; action follows.",
    application: "Say it now: 'I am a Product Manager.' Then act accordingly. A PM tracks metrics, so track your habits. A PM ships, so ship your job applications today.",
    theme: "leadership"
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    category: "stoic",
    context: "Marcus led Rome during the Antonine Plague that killed 5 million. He couldn't debate philosophy — he had to govern while his world burned.",
    application: "Stop researching how to quit smoking. Just don't smoke today. Stop researching PM frameworks. Just apply today. Action, not deliberation.",
    theme: "discipline"
  },
  {
    text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    author: "Mark Zuckerberg",
    category: "tech",
    context: "Facebook's early mantra when they were a scrappy startup out of a dorm room, iterating on features in days, not months. This philosophy helped them outmaneuver MySpace.",
    application: "Apply to 3 PM roles today even if your resume isn't perfect. Ship the MVP of your personal brand. Speed of iteration beats perfection of preparation.",
    theme: "leadership"
  },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "tech",
    context: "Jobs quoted this from The Whole Earth Catalog in his 2005 Stanford commencement — days after being told he had pancreatic cancer. It was his response to mortality.",
    application: "Hunger: Apply to that senior PM role even if you're underqualified. Foolish: Tell your interviewer your ambitious 90-day vision for their product. Fortune favors the bold.",
    theme: "change"
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "tech",
    context: "Kay coined this at Xerox PARC in the 1970s while inventing the modern GUI, OOP, and laptop concept — technologies that created the world we live in.",
    application: "Don't wait for the perfect PM job to appear. Build side projects that demonstrate PM thinking. Create the track record that makes you unhireable to pass on.",
    theme: "leadership"
  },
  {
    text: "Products are built by teams, not individuals. The best PMs are multipliers.",
    author: "Julie Zhuo",
    category: "tech",
    context: "Zhuo became VP of Product Design at Facebook at 25. In 'The Making of a Manager' she documented how the best leaders make everyone around them 10x better.",
    application: "In your next interview, don't say 'I built X.' Say 'I enabled my team to build X by removing blockers and aligning on priorities.' That's PM thinking.",
    theme: "leadership"
  },
  {
    text: "You can't connect the dots looking forward; you can only connect them looking backward.",
    author: "Steve Jobs",
    category: "tech",
    context: "Jobs said this after being fired from Apple, working at NeXT and Pixar, and only then understanding that each 'failure' was preparing him to save Apple.",
    application: "That gym session builds discipline for quitting smoking. Quitting smoking builds mental resilience for PM interviews. Each habit connects to the next.",
    theme: "resilience"
  },
  {
    text: "The obstacle is the path. The crisis is the opportunity.",
    author: "Ryan Holiday",
    category: "stoic",
    context: "Holiday wrote 'The Obstacle is the Way' after studying how every great Stoic — from Marcus Aurelius to Thomas Edison — converted adversity into advantage.",
    application: "Being unemployed is your full-time research opportunity to understand PM problems deeply. Quitting cigarettes is building the willpower you need to lead teams under pressure.",
    theme: "resilience"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "tech",
    context: "Wilde said this in Victorian England, where conformity was survival. He paid the ultimate price for authenticity — and created immortal work because of it.",
    application: "Your PM interview story is unique. You quit smoking, play badminton, and are career-switching. That's a resilience narrative that 99% of candidates can't match.",
    theme: "change"
  },
  {
    text: "The goal of a startup is to find a repeatable, scalable business model.",
    author: "Steve Blank",
    category: "tech",
    context: "Blank developed Customer Development methodology after failing at 8 startups and succeeding at 4. He discovered that most startups fail by building before validating.",
    application: "Treat your career like a product. Test the hypothesis: 'Companies will hire me as a PM.' Get user feedback (interviews). Iterate your pitch. Find product-market fit.",
    theme: "leadership"
  },
  {
    text: "Do not pray for an easy life; pray for the strength to endure a difficult one.",
    author: "Bruce Lee",
    category: "stoic",
    context: "Lee transformed martial arts against violent opposition from traditional masters who wanted to fight him. He converted adversity into the philosophy of Jeet Kune Do.",
    application: "Don't wish quitting were easier. Each craving you defeat rewires your brain's reward system. The harder the quit, the stronger the discipline you're forging.",
    theme: "resilience"
  },
  {
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
    category: "stoic",
    context: "Willink commanded SEAL Team 3 in the Battle of Ramadi, Iraq's most violent city. He learned that rigid discipline in training created freedom in chaotic combat.",
    application: "Discipline in your morning routine — no cigarettes, badminton, PM study — creates the mental freedom to perform brilliantly in interviews without anxiety.",
    theme: "discipline"
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    category: "stoic",
    context: "Socrates said this at his own trial, choosing death over exile, preferring to die for truth than live comfortably in ignorance. He valued self-examination above all.",
    application: "This app is your examined life. Track your patterns. The AI auditor finds the bugs in your routine. You are the product; constant iteration is the strategy.",
    theme: "focus"
  },
];

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    title: "Stoic Flame Breath",
    steps: [
      "Inhale slowly for 4 counts. Imagine breathing in pure, cold mountain air.",
      "Hold for 4 counts. This is the moment between stimulus and response. You own this space.",
      "Exhale for 6 counts. Breathe out the craving like smoke from a fire going out.",
      "Repeat 4 times. Each cycle is a small victory.",
    ],
    duration: "~30 seconds",
    philosophy: "Marcus Aurelius practiced 'the view from above' — seeing the craving as a small, temporary thing in your vast life. This breath gives you that distance."
  },
  {
    title: "Epictetus Pause Protocol",
    steps: [
      "STOP. Name the craving: 'This is a craving. It is not me.'",
      "Breathe in for 5 counts. You are inhaling your future self.",
      "At the top, ask: 'Does a cigarette align with who I am becoming?'",
      "Exhale for 7 counts, releasing the craving's grip on your identity.",
    ],
    duration: "~30 seconds",
    philosophy: "Epictetus: 'Between stimulus and response, there is a space. In that space lies our freedom.' You just found that space."
  },
  {
    title: "Seneca's Mortality Breath",
    steps: [
      "Inhale for 4 counts and think: 'This moment is a gift I am choosing to honor.'",
      "Hold 2 counts: each cigarette takes 11 minutes. You are choosing minutes.",
      "Exhale for 8 counts, long and controlled. Feel the discipline in the length.",
      "Pause 2 counts. You survived the craving. You always survive cravings.",
    ],
    duration: "~30 seconds",
    philosophy: "Seneca: 'Omnia, Lucili, aliena sunt, tempus tantum nostrum est.' — Everything is alien to us, Lucilius; time alone is ours. Protect it."
  },
  {
    title: "The Warrior's Reset",
    steps: [
      "Tense every muscle in your body for 3 seconds. Feel the physical power you already have.",
      "Release completely with a long exhale (6 counts). The craving releases too.",
      "Breathe normally for 4 counts. Scan your body — the craving has weakened.",
      "Smile. Your body just experienced a micro-victory. Compound it.",
    ],
    duration: "~30 seconds",
    philosophy: "Jocko Willink: Physical discipline creates mental dominance. You just used your body to reclaim your mind."
  },
  {
    title: "The Distraction Technique",
    steps: [
      "Name 5 things you can see right now. Describe each one in detail.",
      "Name 4 things you can physically touch. Reach out and touch each one.",
      "Name 3 things you can hear right now. Really listen.",
      "Take 2 deep breaths. The craving peak (20 seconds) has passed.",
    ],
    duration: "~30 seconds",
    philosophy: "Cravings peak within 20 seconds and then subside — whether you smoke or not. Your cognitive bandwidth defeats biochemistry."
  },
];

const BOUNCE_BACK_STRATEGIES: Record<string, BounceBackStrategy> = {
  sick: {
    title: "The Resilience Rebrand",
    steps: [
      "Log this day as 'Recovery Mode' — not a failure. A true athlete rests strategically.",
      "Do 10 minutes of light stretching or walking as active recovery.",
      "Plan your comeback session: write the exact date, time, and drill you'll do.",
      "Study one PM concept while you recover — your mind never rests.",
    ],
    stoicPrinciple: "Marcus Aurelius: 'The impediment to action advances action.' Illness is data about your limits. Respect limits now to exceed them later."
  },
  busy: {
    title: "The Minimum Viable Session",
    steps: [
      "Tomorrow: wake 20 minutes earlier. Even 20 minutes of badminton maintains momentum.",
      "This week: schedule your next 3 sessions in your calendar RIGHT NOW as non-negotiables.",
      "For today: do 50 jumping jacks. Maintain the neural pattern of movement.",
      "Ask yourself: 'What am I actually busy doing, and does it serve my 6-month goal?'",
    ],
    stoicPrinciple: "Seneca: 'It is not that we have a short time to live, but that we waste a great deal of it.' Schedule ruthlessly."
  },
  tired: {
    title: "The Energy Audit",
    steps: [
      "Track your sleep tonight with intent. Target 7.5 hours (5 x 90-min sleep cycles).",
      "Identify your energy drain: what activity today cost you the most mental energy?",
      "Tomorrow morning: reduce caffeine by 1 unit and replace with water. Hydration is performance.",
      "This weekend: play badminton in the morning before decision fatigue sets in.",
    ],
    stoicPrinciple: "Epictetus taught that we must work with our nature, not against it. Respecting your body's need for rest is discipline, not weakness."
  },
  motivation: {
    title: "The Identity Anchor",
    steps: [
      "Read your longest streak in this app. That person exists in you — you built it.",
      "Write: 'I am a badminton player' 5 times. Identity precedes action.",
      "Find ONE badminton video on YouTube. Watch 2 minutes. Feel the pull.",
      "Commit to tomorrow — just showing up. 5 minutes of play counts.",
    ],
    stoicPrinciple: "Marcus Aurelius: 'Confine yourself to the present.' You don't need motivation for the whole journey — just for tomorrow at 7 AM."
  },
  default: {
    title: "The Stoic Reset",
    steps: [
      "Acknowledge: 'I missed a day. This doesn't define my streak — my response does.'",
      "Tomorrow: show up at your court 10 minutes early. Preparation is commitment.",
      "Text a playing partner right now. Accountability is your external willpower.",
      "Review your 'why' — write in 3 sentences why badminton matters to your bigger goals.",
    ],
    stoicPrinciple: "Ryan Holiday: 'The obstacle is the path.' The missed session, responded to correctly, can create more discipline than 10 completed ones."
  }
};

export function getDailyQuote(): Quote {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const stoicQuotes = QUOTES.filter(q => q.category === 'stoic');
  const techQuotes = QUOTES.filter(q => q.category === 'tech');
  const usesStoic = dayOfYear % 2 === 0;
  const pool = usesStoic ? stoicQuotes : techQuotes;
  return pool[dayOfYear % pool.length];
}

export function getRandomBreathingExercise(): BreathingExercise {
  const idx = Math.floor(Math.random() * BREATHING_EXERCISES.length);
  return BREATHING_EXERCISES[idx];
}

export function getBounceBackStrategy(reason: string): BounceBackStrategy {
  const key = reason.toLowerCase();
  if (key.includes('sick') || key.includes('ill') || key.includes('unwell')) return BOUNCE_BACK_STRATEGIES.sick;
  if (key.includes('busy') || key.includes('work') || key.includes('time')) return BOUNCE_BACK_STRATEGIES.busy;
  if (key.includes('tired') || key.includes('fatigue') || key.includes('sleep')) return BOUNCE_BACK_STRATEGIES.tired;
  if (key.includes('motiv') || key.includes('lazy') || key.includes('mood')) return BOUNCE_BACK_STRATEGIES.motivation;
  return BOUNCE_BACK_STRATEGIES.default;
}

export function generateProductivityAudit(data: {
  badmintonLogs: { date: string; completed: boolean; reason?: string }[];
  smokeFreeStart: string | null;
  jobApps: { company: string; status: string; date: string }[];
  tasks: { title: string; completed: boolean; createdAt: string }[];
}): AuditReport {
  let score = 0;
  const strengths: string[] = [];
  const bugs: string[] = [];
  const patches: string[] = [];

  const now = new Date();
  const last7 = data.badmintonLogs.filter(l => {
    const d = new Date(l.date);
    return (now.getTime() - d.getTime()) < 7 * 86400000;
  });
  const completedLast7 = last7.filter(l => l.completed).length;
  const badmintonRate = last7.length > 0 ? completedLast7 / last7.length : 0;

  if (badmintonRate >= 0.7) { score += 25; strengths.push('Badminton consistency is strong (70%+ sessions this week).'); }
  else if (badmintonRate >= 0.4) { score += 12; bugs.push('Badminton sessions are inconsistent this week — below 50% completion.'); }
  else { score += 0; bugs.push('CRITICAL: Badminton sessions have nearly collapsed. Only ' + Math.round(badmintonRate * 100) + '% completion rate.'); }

  const missedDays = data.badmintonLogs.filter(l => !l.completed);
  const dayOfWeekCounts: Record<string, number> = {};
  missedDays.forEach(l => {
    const day = new Date(l.date).toLocaleDateString('en', { weekday: 'long' });
    dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1;
  });
  const worstDay = Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0];
  if (worstDay && worstDay[1] >= 2) {
    bugs.push(`You consistently miss badminton on ${worstDay[0]}s (${worstDay[1]} times). Reschedule that day's sessions.`);
    patches.push(`Move your ${worstDay[0]} badminton session to a different time or day. Check what conflicts with it.`);
  }

  if (data.smokeFreeStart) {
    const days = Math.floor((now.getTime() - new Date(data.smokeFreeStart).getTime()) / 86400000);
    if (days >= 30) { score += 35; strengths.push(`Incredible: ${days} days smoke-free. Your lung capacity is measurably improving.`); }
    else if (days >= 7) { score += 25; strengths.push(`${days} days smoke-free. The acute withdrawal phase is largely over. Keep going.`); }
    else if (days >= 1) { score += 15; strengths.push(`${days} day(s) smoke-free. Your body is already beginning to heal.`); }
    else { score += 0; bugs.push('Cigarette cessation has not been tracked. Set your quit date now.'); patches.push('Log your smoke-free start date in the Cessation tracker.'); }
  } else {
    score += 0;
    bugs.push('No smoke-free start date set. This is a priority metric for your health.');
  }

  const activeApps = data.jobApps.filter(j => j.status !== 'rejected');
  const inInterview = data.jobApps.filter(j => j.status === 'interview');
  const offers = data.jobApps.filter(j => j.status === 'offer');
  if (offers.length > 0) { score += 25; strengths.push(`You have ${offers.length} offer(s)! Execute your negotiation strategy.`); }
  else if (inInterview.length > 0) { score += 20; strengths.push(`${inInterview.length} active interview(s). Focus your prep here.`); }
  else if (activeApps.length >= 3) { score += 15; strengths.push(`${activeApps.length} active applications in pipeline.`); }
  else { score += 5; bugs.push('Pipeline is thin. Apply to at least 3 new PM roles this week.'); patches.push('Use the 5x5 strategy: apply to 5 roles every 5 days to maintain a healthy pipeline.'); }

  const completedTasks = data.tasks.filter(t => t.completed).length;
  const taskRate = data.tasks.length > 0 ? completedTasks / data.tasks.length : 0;
  if (taskRate >= 0.7) { score += 15; strengths.push('Task completion rate is excellent (70%+).'); }
  else if (taskRate >= 0.4) { score += 8; bugs.push('Task completion rate is moderate. Review and remove tasks that don\'t serve your goals.'); }
  else { score += 0; bugs.push('Task completion is low. Over-commitment is a bug. Remove low-priority tasks.'); patches.push('Apply the PM prioritization matrix: Impact vs. Effort. Cut anything low-impact, high-effort.'); }

  if (patches.length === 0) patches.push('Your system is running well. Focus on increasing quality of each session, not quantity.');

  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B+';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C+';
  else if (score >= 40) grade = 'C';
  else if (score >= 30) grade = 'D';

  const summary = score >= 70
    ? `Your life-system is performing well. Score: ${score}/100. The AI auditor found ${bugs.length} optimization opportunities.`
    : `Your life-system has ${bugs.length} critical bugs. Score: ${score}/100. Apply the patches below to get back on track.`;

  return { score, grade, strengths, bugs, patches, summary };
}

export interface MicroAlternative {
  title: string;
  duration: string;
  instruction: string;
  principle: string;
}

const MICRO_ALTERNATIVES_BADMINTON: MicroAlternative[] = [
  {
    title: '2-Min Footwork Drill',
    duration: '2 minutes',
    instruction: 'Stand up. Move left-right 10 times, then front-back 10 times in badminton ready stance. Shuffle feet, bend knees.',
    principle: 'The neural pathway for movement does not require a court — just your motor cortex firing the same pattern.',
  },
  {
    title: 'Shadow Swing Sequence',
    duration: '2 minutes',
    instruction: 'Grab any object or just mime it. Do 20 forehand clears, 20 backhand clears, 15 smashes at full extension.',
    principle: 'Elite athletes visualize and shadow-drill during rest days. You are training the same motor neurons.',
  },
  {
    title: 'Reaction Timer',
    duration: '2 minutes',
    instruction: 'Set a 10-second interval timer. React as if receiving a shuttle: step into position and swing on each beep.',
    principle: 'Agility is a daily practice. Two minutes of reactive movement is infinitely better than zero.',
  },
  {
    title: 'Wrist & Core Activation',
    duration: '2 minutes',
    instruction: '30 wrist circles each direction, 15 plank shoulder taps, 10 slow-motion jump squats. Full athletic posture.',
    principle: 'Badminton injuries happen to neglected supporting muscles. Today, you reinforce the system.',
  },
  {
    title: 'Visualization Session',
    duration: '2 minutes',
    instruction: 'Close eyes. In vivid detail, replay your best rally or imagine a perfect match. Feel the racket, hear the shuttle.',
    principle: 'Neuroscience confirms: the brain cannot distinguish vivid mental rehearsal from physical execution.',
  },
];

export function getMicroAlternative(habit: string = 'badminton'): MicroAlternative {
  const pool = MICRO_ALTERNATIVES_BADMINTON;
  const idx = Math.floor(Date.now() / 3600000) % pool.length;
  return pool[idx];
}

const PM_QUESTIONS: Record<string, string[][]> = {
  default: [
    ['How would you prioritize features on a 0-to-1 product with no existing data?', 'Walk me through your go-to metrics framework for measuring product-market fit.', 'A senior engineer disagrees with your roadmap decision. How do you resolve it?'],
    ['Describe a time you killed a feature you championed. What did you learn?', 'How do you write a PRD for a feature you are uncertain about?', 'What does a great discovery process look like to you?'],
    ["How do you say no to a stakeholder request without damaging the relationship?", "Walk me through how you would design an onboarding flow for this company's core product.", "What's the one metric you would use to define success for this role in the first 90 days?"],
  ],
};

const COMPANY_HINTS: Record<string, string[][]> = {
  google: [
    ["How would you improve Google Maps' monetization without degrading user trust?", 'Google has a history of killing products. How would you decide when to sunset a feature?', "Walk me through how you'd design a new Google Workspace feature for hybrid teams."],
  ],
  meta: [
    ['How would you define and measure the value of a Reels recommendation for Meta?', 'Facebook Groups are declining. What is your 3-year strategy to reverse it?', 'How do you balance advertiser revenue goals with user privacy at Meta?'],
  ],
  amazon: [
    ['Write a press release and FAQ for a new Amazon logistics feature.', 'How would you improve the Amazon Prime value proposition for Gen Z users?', 'Walk me through a customer-obsession example from your past work.'],
  ],
  microsoft: [
    ['How would you integrate Copilot into a Microsoft Teams workflow for frontline workers?', 'What metrics would you track for a Microsoft 365 B2B feature launch?', 'How do you manage a product across a platform with 1B+ users and legacy constraints?'],
  ],
};

export function getMockInterviewQuestions(company: string): string[] {
  const key = company.toLowerCase().trim();
  let pool: string[][] = [];
  for (const [k, v] of Object.entries(COMPANY_HINTS)) {
    if (key.includes(k)) { pool = v; break; }
  }
  if (!pool.length) pool = PM_QUESTIONS.default;
  const set = pool[Math.floor(Date.now() / 3600000) % pool.length];
  return set;
}

export function getKanbanTaskOfDay(company: string, position?: string): string {
  const tasks = [
    `Research ${company}'s current product roadmap and identify 2 gaps you would address as PM.`,
    `Write your 30-60-90 day plan for the ${position || 'PM'} role at ${company}. Be specific about metrics.`,
    `Identify 3 of ${company}'s competitors and prepare a competitive analysis slide.`,
    `Practice your PM case study answer for ${company}'s product. Time yourself to 10 minutes.`,
    `Research ${company}'s recent engineering blog posts to understand their tech philosophy.`,
    `Write 5 clarifying questions you would ask in ${company}'s PM interview.`,
    `Prepare your 'Tell me about a product you improved' story specifically tailored to ${company}'s domain.`,
    `Mock interview yourself: answer 'Why ${company}?' in 2 minutes. Record and review.`,
    `Map ${company}'s user journey for their core product. Identify friction points.`,
    `Prepare metrics for how you would measure success for ${company}'s main product feature.`,
  ];
  const idx = Math.floor(Date.now() / 86400000) % tasks.length;
  return tasks[idx];
}
