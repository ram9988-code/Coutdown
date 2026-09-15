import { Ionicons } from '@expo/vector-icons';

export type PersonalityCategory = 'Stoic' | 'Innovator' | 'Polymath' | 'Philosopher' | 'Strategist';

export interface PersonalityQuoteQuest {
  id: string;
  name: string;
  era: string;
  role: string;
  category: PersonalityCategory;
  avatarIcon: keyof typeof Ionicons.glyphMap;
  quote: string;
  source: string;
  questTitle: string;
  questSubtitle: string;
  questIcon: keyof typeof Ionicons.glyphMap;
}

export const FAMOUS_PERSONALITIES_DATA: PersonalityQuoteQuest[] = [
  // 1. Marcus Aurelius
  {
    id: 'marcus-aurelius-1',
    name: 'Marcus Aurelius',
    era: '121 – 180 AD',
    role: 'Roman Emperor & Stoic Philosopher',
    category: 'Stoic',
    avatarIcon: 'shield-outline',
    quote: 'You could leave life right now. Let that determine what you do and say and think.',
    source: 'Meditations, Book II',
    questTitle: 'Morning Memento Mori Audit',
    questSubtitle: 'Spend 5 mins visualizing life’s finitude to remove trivial anxiety',
    questIcon: 'leaf-outline',
  },
  {
    id: 'marcus-aurelius-2',
    name: 'Marcus Aurelius',
    era: '121 – 180 AD',
    role: 'Roman Emperor & Stoic Philosopher',
    category: 'Stoic',
    avatarIcon: 'shield-outline',
    quote: 'At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work — as a human being.',
    source: 'Meditations, Book V',
    questTitle: 'Dawn Awakening Without Snooze',
    questSubtitle: 'Wake instantly at first alarm and begin primary duty',
    questIcon: 'sunny-outline',
  },

  // 2. Seneca
  {
    id: 'seneca-1',
    name: 'Seneca the Younger',
    era: '4 BC – 65 AD',
    role: 'Stoic Philosopher & Statesman',
    category: 'Stoic',
    avatarIcon: 'book-outline',
    quote: 'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough if you know how to use it.',
    source: 'On the Brevity of Life',
    questTitle: 'Evening Retrospective Audit',
    questSubtitle: 'Examine every hour of today: what was wasted, what was mastered?',
    questIcon: 'moon-outline',
  },
  {
    id: 'seneca-2',
    name: 'Seneca the Younger',
    era: '4 BC – 65 AD',
    role: 'Stoic Philosopher & Statesman',
    category: 'Stoic',
    avatarIcon: 'book-outline',
    quote: 'We suffer more often in imagination than in reality.',
    source: 'Letters from a Stoic',
    questTitle: 'Premeditatio Malorum Drill',
    questSubtitle: 'Confront the worst-case scenario calmly and prepare the remedy',
    questIcon: 'shield-checkmark-outline',
  },

  // 3. Epictetus
  {
    id: 'epictetus-1',
    name: 'Epictetus',
    era: '50 – 135 AD',
    role: 'Greek Stoic Philosopher',
    category: 'Stoic',
    avatarIcon: 'flame-outline',
    quote: 'How long are you going to wait before you demand the best for yourself?',
    source: 'Enchiridion',
    questTitle: 'Dichotomy of Control Practice',
    questSubtitle: 'Categorize today’s worries into: in my control vs outside my control',
    questIcon: 'options-outline',
  },

  // 4. Leonardo da Vinci
  {
    id: 'da-vinci-1',
    name: 'Leonardo da Vinci',
    era: '1452 – 1519',
    role: 'Italian Renaissance Polymath',
    category: 'Polymath',
    avatarIcon: 'color-palette-outline',
    quote: 'Time stays long enough for anyone who will use it. Iron rusts from disuse; water loses its purity from stagnation.',
    source: 'Notebooks of Leonardo',
    questTitle: 'Codex Curiosity Sketch/Log',
    questSubtitle: 'Note down 3 things observed today that you never noticed before',
    questIcon: 'eye-outline',
  },
  {
    id: 'da-vinci-2',
    name: 'Leonardo da Vinci',
    era: '1452 – 1519',
    role: 'Italian Renaissance Polymath',
    category: 'Polymath',
    avatarIcon: 'color-palette-outline',
    quote: 'It had long since come to my attention that people of accomplishment rarely sat back and let things happen to them. They went out and happened to things.',
    source: 'Codex Atlanticus',
    questTitle: 'Proactive Maker Block (60m)',
    questSubtitle: 'Build or create something tangible with zero passive consumption',
    questIcon: 'construct-outline',
  },

  // 5. Nikola Tesla
  {
    id: 'tesla-1',
    name: 'Nikola Tesla',
    era: '1856 – 1943',
    role: 'Inventor & Electrical Pioneer',
    category: 'Innovator',
    avatarIcon: 'flash-outline',
    quote: 'Be alone, that is the secret of invention; be alone, that is when ideas are born.',
    source: 'My Inventions',
    questTitle: '2-Mile Silent Walking Thought',
    questSubtitle: 'Walk outdoors alone with no headphones, phone, or distractions',
    questIcon: 'walk-outline',
  },

  // 6. Albert Einstein
  {
    id: 'einstein-1',
    name: 'Albert Einstein',
    era: '1879 – 1955',
    role: 'Theoretical Physicist & Nobel Laureate',
    category: 'Innovator',
    avatarIcon: 'planet-outline',
    quote: 'The distinction between the past, present and future is only a stubbornly persistent illusion.',
    source: 'Letter to Michele Besso',
    questTitle: 'Gedankenexperiment (Thought Experiment)',
    questSubtitle: 'Dedicate 30 mins to pure conceptual reasoning without answering emails',
    questIcon: 'bulb-outline',
  },

  // 7. Steve Jobs
  {
    id: 'jobs-1',
    name: 'Steve Jobs',
    era: '1955 – 2011',
    role: 'Co-Founder of Apple & Visionary',
    category: 'Innovator',
    avatarIcon: 'hardware-chip-outline',
    quote: 'Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma.',
    source: 'Stanford Commencement Address',
    questTitle: 'Mirror Accountability Question',
    questSubtitle: 'Look in mirror: If today were the last day of my life, would I do what I am about to do?',
    questIcon: 'sparkles-outline',
  },

  // 8. Bruce Lee
  {
    id: 'bruce-lee-1',
    name: 'Bruce Lee',
    era: '1940 – 1973',
    role: 'Martial Artist & Philosopher',
    category: 'Philosopher',
    avatarIcon: 'fitness-outline',
    quote: 'If you love life, don’t waste time, for time is what life is made up of. It’s not the daily increase but daily decrease. Hack away at the unessential.',
    source: 'Tao of Jeet Kune Do',
    questTitle: 'Ruthless Elimination of 1 Distraction',
    questSubtitle: 'Cut out one app, habit, or low-value activity for the entire day',
    questIcon: 'cut-outline',
  },

  // 9. Viktor Frankl
  {
    id: 'frankl-1',
    name: 'Viktor Frankl',
    era: '1905 – 1997',
    role: 'Neurologist, Psychiatrist & Author',
    category: 'Philosopher',
    avatarIcon: 'heart-outline',
    quote: 'Everything can be taken from a man but one thing: the last of the human freedoms — to choose one’s attitude in any given set of circumstances.',
    source: 'Man’s Search for Meaning',
    questTitle: 'Responsibility & Meaning Pause',
    questSubtitle: 'Respond to the most frustrating moment today with deliberate grace',
    questIcon: 'compass-outline',
  },

  // 10. Benjamin Franklin
  {
    id: 'franklin-1',
    name: 'Benjamin Franklin',
    era: '1706 – 1790',
    role: 'Polymath & Founding Father',
    category: 'Polymath',
    avatarIcon: 'newspaper-outline',
    quote: 'Dost thou love life? Then do not squander time, for that is the stuff life is made of.',
    source: 'Poor Richard’s Almanack',
    questTitle: 'Franklin Daily Virtue Tracking',
    questSubtitle: 'Focus on 1 specific virtue today (e.g. Silence, Order, Frugality, Industry)',
    questIcon: 'ribbon-outline',
  },

  // 11. Miyamoto Musashi
  {
    id: 'musashi-1',
    name: 'Miyamoto Musashi',
    era: '1584 – 1645',
    role: 'Legendary Swordsman & Strategist',
    category: 'Strategist',
    avatarIcon: 'trophy-outline',
    quote: 'Think lightly of yourself and deeply of the world. Do nothing which is of no use.',
    source: 'The Dokkodo (The Path of Aloneness)',
    questTitle: 'Single-Minded Execution Standard',
    questSubtitle: 'Perform your primary task today with 100% presence without multitasking',
    questIcon: 'barbell-outline',
  },

  // 12. Mahatma Gandhi
  {
    id: 'gandhi-1',
    name: 'Mahatma Gandhi',
    era: '1869 – 1948',
    role: 'Leader & Nonviolence Philosopher',
    category: 'Philosopher',
    avatarIcon: 'globe-outline',
    quote: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    source: 'Collected Speeches',
    questTitle: 'Intellectual Nourishment (30m)',
    questSubtitle: 'Read enduring wisdom or non-fiction study for 30 minutes uninterrupted',
    questIcon: 'book-outline',
  },

  // 13. Sun Tzu
  {
    id: 'sun-tzu-1',
    name: 'Sun Tzu',
    era: '544 – 496 BC',
    role: 'Military Strategist & General',
    category: 'Strategist',
    avatarIcon: 'flag-outline',
    quote: 'In the midst of chaos, there is also opportunity. The victorious strategist only seeks battle after the victory has been won.',
    source: 'The Art of War',
    questTitle: 'Evening Next-Day Battle Plan',
    questSubtitle: 'List your top 3 non-negotiable objectives for tomorrow before sleeping',
    questIcon: 'list-outline',
  },

  // 14. Friedrich Nietzsche
  {
    id: 'nietzsche-1',
    name: 'Friedrich Nietzsche',
    era: '1844 – 1900',
    role: 'Philosopher & Cultural Thinker',
    category: 'Philosopher',
    avatarIcon: 'flame-outline',
    quote: 'My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity.',
    source: 'Ecce Homo',
    questTitle: 'Amor Fati Acceptance Ritual',
    questSubtitle: 'Embrace any setback today as necessary fuel for mental resilience',
    questIcon: 'bonfire-outline',
  },

  // 15. Marie Curie
  {
    id: 'curie-1',
    name: 'Marie Curie',
    era: '1867 – 1934',
    role: 'Physicist & Double Nobel Laureate',
    category: 'Innovator',
    avatarIcon: 'flask-outline',
    quote: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    source: 'Paris Academy of Sciences',
    questTitle: 'Deep Study Block (45m)',
    questSubtitle: 'Demystify one complex problem or skill with pure focused rigor',
    questIcon: 'school-outline',
  },

  // 16. Theodore Roosevelt
  {
    id: 'roosevelt-1',
    name: 'Theodore Roosevelt',
    era: '1858 – 1919',
    role: '26th US President & Explorer',
    category: 'Strategist',
    avatarIcon: 'medal-outline',
    quote: 'It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.',
    source: 'Citizenship in a Republic (The Man in the Arena)',
    questTitle: 'Enter The Arena Action',
    questSubtitle: 'Take one bold initiative today you have been postponing out of fear of criticism',
    questIcon: 'golf-outline',
  },

  // 17. Confucius
  {
    id: 'confucius-1',
    name: 'Confucius',
    era: '551 – 479 BC',
    role: 'Teacher & Moral Philosopher',
    category: 'Philosopher',
    avatarIcon: 'library-outline',
    quote: 'We have two lives, and the second begins when we realize we only have one.',
    source: 'The Analects',
    questTitle: 'Present-Moment Awakening',
    questSubtitle: 'Treat this very day as the first day of your second, conscious life',
    questIcon: 'infinite-outline',
  },

  // 18. Winston Churchill
  {
    id: 'churchill-1',
    name: 'Winston Churchill',
    era: '1874 – 1965',
    role: 'British Prime Minister & Nobel Laureate',
    category: 'Strategist',
    avatarIcon: 'time-outline',
    quote: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    source: 'Parliamentary Address',
    questTitle: 'Unbroken Momentum Standard',
    questSubtitle: 'Persist through fatigue to finish today’s core task to completion',
    questIcon: 'trending-up-outline',
  },

  // 19. Lao Tzu
  {
    id: 'lao-tzu-1',
    name: 'Lao Tzu',
    era: '6th Century BC',
    role: 'Founder of Philosophical Taoism',
    category: 'Philosopher',
    avatarIcon: 'water-outline',
    quote: 'Nature does not hurry, yet everything is accomplished. A journey of a thousand miles begins with a single step.',
    source: 'Tao Te Ching',
    questTitle: 'Micro-Step Action',
    questSubtitle: 'Take one tiny, undeniable step toward your greatest 5-year ambition',
    questIcon: 'footsteps-outline',
  },

  // 20. Alan Turing
  {
    id: 'turing-1',
    name: 'Alan Turing',
    era: '1912 – 1954',
    role: 'Father of Modern Computing & Cryptanalyst',
    category: 'Innovator',
    avatarIcon: 'code-working-outline',
    quote: 'Sometimes it is the people no one can imagine anything of who do the things no one can imagine.',
    source: 'Bletchley Park Papers',
    questTitle: 'First-Principles Problem Solving',
    questSubtitle: 'Break down a tricky obstacle today to its absolute fundamental truths',
    questIcon: 'git-network-outline',
  },

  // 21. Maya Angelou
  {
    id: 'angelou-1',
    name: 'Maya Angelou',
    era: '1928 – 2014',
    role: 'Poet, Memoirist & Civil Rights Leader',
    category: 'Philosopher',
    avatarIcon: 'heart-half-outline',
    quote: 'My mission in life is not merely to survive, but to thrive; and to do so with some passion, some compassion, some humor, and some style.',
    source: 'I Know Why the Caged Bird Sings',
    questTitle: 'Daily Grace & Empathy Stand',
    questSubtitle: 'Offer encouragement or genuine appreciation to someone in your orbit',
    questIcon: 'people-outline',
  },

  // 22. Rumi
  {
    id: 'rumi-1',
    name: 'Jalal al-Din Muhammad Rumi',
    era: '1207 – 1273',
    role: 'Mystic Poet & Scholar',
    category: 'Philosopher',
    avatarIcon: 'sparkles-outline',
    quote: 'Stop acting so small. You are the universe in joyful motion. Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    source: 'Masnavi',
    questTitle: 'Internal Mastery Check',
    questSubtitle: 'Focus energy 100% on self-discipline rather than critiquing others',
    questIcon: 'person-outline',
  },

  // 23. Aristotle
  {
    id: 'aristotle-1',
    name: 'Aristotle',
    era: '384 – 322 BC',
    role: 'Ancient Greek Philosopher & Polymath',
    category: 'Polymath',
    avatarIcon: 'school-outline',
    quote: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    source: 'Nicomachean Ethics',
    questTitle: 'Daily Standard Execution',
    questSubtitle: 'Execute all habits without cutting corners, honoring the standard',
    questIcon: 'checkmark-circle-outline',
  },

  // 24. Oliver Burkeman
  {
    id: 'burkeman-1',
    name: 'Oliver Burkeman',
    era: '1975 – Present',
    role: 'Author & Journalist',
    category: 'Philosopher',
    avatarIcon: 'hourglass-outline',
    quote: 'The average human lifespan is absurdly, terrifyingly, insultingly short: just over four thousand weeks.',
    source: 'Four Thousand Weeks: Time Management for Mortals',
    questTitle: '4,000 Weeks Priority Check',
    questSubtitle: 'Decide what you will deliberately NOT care about today',
    questIcon: 'close-circle-outline',
  },
];
