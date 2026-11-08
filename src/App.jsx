import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Volume2,
  Trophy,
  Flame,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  Layers,
  Award,
  Clock,
  Zap,
  Compass,
  Brain,
  ChevronRight,
  RefreshCw,
  GraduationCap,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================================================
// SKILL TREE CURRICULUM DATA (12 NODES ACROSS 4 TIERS / 90 DAYS)
// ============================================================================
const SKILL_NODES = [
  // --------------------------------------------------------------------------
  // TIER 0: ROOT - PHONETICS & SOUND DECODING (WEEK 1)
  // --------------------------------------------------------------------------
  {
    id: 'phonetics-core',
    tier: 0,
    col: 2, // Centered
    title: 'Phonetics & Sound Decoding',
    subtitle: 'Silent Finals, CaReFuL Rule, Nasal Vowels & Liaisons',
    weeks: 'Week 1 (Days 1–5)',
    studyTime: '45m Lesson • 15m Drill',
    xp: 150,
    cefr: 'A1 Foundation',
    prereqs: [],
    summary:
      'Stop reading French with English phonetics. Master the 4 deterministic sound rules so your inner voice pronounces words accurately and decodes native speech.',
    mentalModel: [
      {
        heading: '1. The "CaReFuL" Final Consonant Rule',
        body: 'In French, almost all final consonants (s, t, d, x, p, z, g) are completely SILENT at the end of a word. The major exceptions are the consonants in the word CaReFuL (C, R, F, L), which are usually pronounced (e.g., avec, finir, neuf, hôtel).'
      },
      {
        heading: '2. The 3 Core Nasal Vowels',
        body: 'When a vowel is followed by N or M at the end of a syllable, don’t touch your tongue to the roof of your mouth. Let air resonate in your nose: ON/OM (bon), AN/EN (temps, sans), and IN/AIN/UN (vin, pain).'
      },
      {
        heading: '3. Liaisons (Word Linking)',
        body: 'A normally silent final consonant wakes up and attaches to the next word if that next word starts with a vowel sound: "les amis" is pronounced "lez-ami", and "vous avez" sounds like "vou-z-avez".'
      }
    ],
    proTip:
      'Notice how "parle", "parles", and "parlent" (I speak, you speak, they speak) all sound 100% identical in spoken French: [parl]. Look and listen for the pronoun in front!',
    patterns: [
      {
        category: 'Silent Finals',
        french: 'Le chat est grand et gros.',
        phonetic: 'luh sha eh grahn eh groh',
        english: 'The cat is big and fat. (Final t, t, d, t, s are all silent)'
      },
      {
        category: 'CaReFuL Rule',
        french: 'Avec mon chef à l’hôtel.',
        phonetic: 'ah-vek mohn shef ah loh-tel',
        english: 'With my boss at the hotel. (Final C, F, L are pronounced)'
      },
      {
        category: 'Mandatory Liaison',
        french: 'Vous avez deux enfants.',
        phonetic: 'voo-zah-vay duh-zahn-fahn',
        english: 'You have two children. (S and X link as a [z] sound)'
      },
      {
        category: 'Nasal Contrast',
        french: 'Un bon vin blanc en France.',
        phonetic: 'uhn bohn vahn blahn ahn frahns',
        english: 'A good white wine in France.'
      },
      {
        category: 'Silent -ENT Verb Ending',
        french: 'Ils parlent et ils mangent.',
        phonetic: 'eel parl eh eel mahnzh',
        english: 'They speak and they eat. (-ent on 3rd person verbs is ALWAYS silent)'
      }
    ],
    flashcards: [
      { fr: 'Beaucoup de temps', en: 'A lot of time (p and ps are silent)', hint: 'boh-koo duh tahn' },
      { fr: 'Les autres idées', en: 'The other ideas (liaison: lez-oh-trez-ee-day)', hint: 'Watch the double liaison' },
      { fr: 'Ils travaillent tard', en: 'They work late (-ent and -d are silent)', hint: 'eel trah-vahy tar' },
      { fr: 'C’est un bon restaurant', en: 'It is a good restaurant (liaison: seh-tuhn)', hint: 'Nasal on + an' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'According to the "CaReFuL" rule, in which of these words is the final consonant PRONOUNCED?',
        options: ['Beaucoup', 'Toujours', 'Hiver', 'Grand'],
        correctIndex: 2,
        explanation: '"Hiver" (winter) ends in R, one of the CaReFuL letters (pronounced ee-vair). The p in beaucoup, s in toujours, and d in grand are silent.'
      },
      {
        id: 'q2',
        question: 'How do native speakers pronounce the verb forms "je parle", "tu parles", and "ils parlent"?',
        options: [
          'All three verb forms sound completely identical ([parl])',
          '"Ils parlent" has a pronounced "-ent" like in the English word "rent"',
          '"Tu parles" pronounces the final S',
          'Each one has a different vowel sound'
        ],
        correctIndex: 0,
        explanation: 'Critical French hack: Final -e, -es, and 3rd-person plural verb ending -ent are ALL completely silent! They all sound like [parl].'
      },
      {
        id: 'q3',
        question: 'In the phrase "Nous avons un ami" (We have a friend), where does a liaison occur?',
        options: [
          'Only at the very end of the sentence',
          'Between "Nous" + "avons" ([noo-zah-vohn]) and "un" + "ami" ([uhn-nah-mee])',
          'Nowhere; French avoids linking words',
          'Only on the letter m'
        ],
        correctIndex: 1,
        explanation: 'Mandatory liaisons occur between subject pronoun + vowel verb ("Nous_avons") and determiner + vowel noun ("un_ami").'
      },
      {
        id: 'q4',
        question: 'Which English sound best approximates the French combination "CH" (as in "chat" or "chercher")?',
        options: [
          '"CH" as in English "cheese"',
          '"SH" as in English "shoe"',
          '"K" as in English "character"',
          'A silent breath'
        ],
        correctIndex: 1,
        explanation: 'French "ch" is always soft like English "sh" (chat = [sha]). It never has the initial "t" stop of English "chair".'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TIER 1: SYNTAX & LEXICAL CORE (WEEKS 1–3)
  // --------------------------------------------------------------------------
  {
    id: 'big-4-verbs',
    tier: 1,
    col: 0,
    title: 'The Big 4 Verb Engines',
    subtitle: 'Être, Avoir, Aller, Faire + Regular -ER Matrix',
    weeks: 'Weeks 1–2',
    studyTime: '60m Lesson • 20m Drill',
    xp: 200,
    cefr: 'A1 Core',
    prereqs: ['phonetics-core'],
    summary:
      'These 4 irregular verbs power over 45% of all spoken French sentences and serve as the auxiliary scaffolding for past and future tenses.',
    mentalModel: [
      {
        heading: '1. Why the "Big 4" Are Non-Negotiable',
        body: 'Être (to be), Avoir (to have), Aller (to go), and Faire (to do/make) are not just vocabulary—they are grammatical machinery. "Aller" builds the near future, while "Avoir" and "Être" build the past tense.'
      },
      {
        heading: '2. Avoir Expressions Where English Uses "To Be"',
        body: 'In French, you don’t "be" hungry, thirsty, cold, right, wrong, or a certain age—you HAVE hunger, thirst, cold, or years: J’ai faim (I am hungry), J’ai 30 ans (I am 30), Tu as raison (You are right).'
      },
      {
        heading: '3. Regular -ER Verbs (80% of all French verbs)',
        body: 'Drop -er (parler -> parl-) and add: -e, -es, -e, -ons, -ez, -ent. Remember from Tier 0: the singular forms and "ils/elles" all sound identical aloud!'
      }
    ],
    proTip:
      'In casual and everyday spoken French, people use "on" (we/one) instead of "nous" 95% of the time! "On" uses the exact same easy 3rd-person singular conjugation as "il/elle" (e.g., "On va au bureau" = We are going to the office).',
    patterns: [
      {
        category: 'ÊTRE (to be)',
        french: 'Je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils sont',
        phonetic: 'zhuh swee, tu eh, eel eh, noo sohm, voo-zet, eel sohn',
        english: 'I am, you are, he/she/we are, we are (formal), you are, they are'
      },
      {
        category: 'AVOIR (to have)',
        french: 'J’ai, tu as, il/elle/on a, nous avons, vous avez, ils ont',
        phonetic: 'zhay, tu ah, eel ah, noo-zah-vohn, voo-zah-vay, eel-zohn',
        english: 'I have, you have, he/she/we have, we have, you have, they have'
      },
      {
        category: 'ALLER (to go)',
        french: 'Je vais, tu vas, il/elle/on va, nous allons, vous allez, ils vont',
        phonetic: 'zhuh vay, tu vah, eel vah, noo-zah-lohn, voo-zah-lay, eel vohn',
        english: 'I go, you go, he/she/we go, we go, you go, they go'
      },
      {
        category: 'FAIRE (to do/make)',
        french: 'Je fais, tu fais, il/elle/on fait, nous faisons, vous faites, ils font',
        phonetic: 'zhuh feh, tu feh, eel feh, noo fuh-zohn, voo fet, eel fohn',
        english: 'I do/make, you do, he/she/we do, we do, you do, they do'
      },
      {
        category: 'Idiom: Avoir besoin de',
        french: 'J’ai besoin d’aide aujourd’hui.',
        phonetic: 'zhay buh-zwahn ded oh-zhoor-dwee',
        english: 'I need help today. (Literally: I have need of help)'
      }
    ],
    flashcards: [
      { fr: 'On va au travail maintenant.', en: 'We are going to work now.', hint: 'Uses "on" + aller' },
      { fr: 'Tu as tout à fait raison.', en: 'You are completely right.', hint: 'Uses "avoir raison"' },
      { fr: 'Qu’est-ce que vous faites ?', en: 'What are you doing?', hint: 'Vous + faire' },
      { fr: 'Ils ont besoin de parler.', en: 'They need to speak.', hint: 'Ils ont (liaison: eel-zohn)' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How do you say "I am hungry and I am 28 years old" in natural French?',
        options: [
          'Je suis faim et je suis 28 ans.',
          'J’ai faim et j’ai 28 ans.',
          'Je fais faim et j’ai 28 ans.',
          'J’ai faim et je suis 28.'
        ],
        correctIndex: 1,
        explanation: 'Both physical sensations (faim, soif, froid, chaud) and age take AVOIR (to have) in French, never être!'
      },
      {
        id: 'q2',
        question: 'Which sentence correctly uses "on" to mean "We are making a decision"?',
        options: [
          'On faisons une décision.',
          'On prennent une décision.',
          'On fait / On prend une décision.',
          'On êtes une décision.'
        ],
        correctIndex: 2,
        explanation: '"On" means "we" in spoken French, and it ALWAYS takes the 3rd-person singular (il/elle) verb form: il fait -> on fait.'
      },
      {
        id: 'q3',
        question: 'Be careful with sound: what is the difference between "Ils sont" and "Ils ont"?',
        options: [
          '"Ils sont" (they are) has a sharp [s] sound; "Ils ont" (they have) has a buzzing [z] liaison sound.',
          'They are pronounced identically.',
          '"Ils sont" means they have; "Ils ont" means they go.',
          'The T is pronounced at the end of both.'
        ],
        correctIndex: 0,
        explanation: 'Crucial ear training: "Ils sont" = [eel sohn] (they are, from être). "Ils ont" = [eel zohn] (they have, from avoir, with a z-liaison).'
      },
      {
        id: 'q4',
        question: 'Complete the sentence: "Vous ______ (faire) du bon travail."',
        options: ['faisez', 'faites', 'faisons', 'font'],
        correctIndex: 1,
        explanation: '"Faire" is one of the very few verbs where the "vous" form does not end in -ez: "vous faites" (like "vous êtes" and "vous dites").'
      }
    ]
  },

  {
    id: 'modal-shortcuts',
    tier: 1,
    col: 1,
    title: 'Modal Shortcuts & Near Future',
    subtitle: 'Vouloir, Pouvoir, Devoir + Infinitive Hacks',
    weeks: 'Week 2',
    studyTime: '50m Lesson • 15m Drill',
    xp: 200,
    cefr: 'A1+ Accelerator',
    prereqs: ['phonetics-core'],
    summary:
      'Unlock the ultimate Week-2 fluency cheat code: conjugate one modal or movement verb and stack ANY unconjugated infinitive right after it.',
    mentalModel: [
      {
        heading: '1. The Double-Verb Stacking Formula',
        body: 'In French, when two verbs sit back-to-back, ONLY the first verb is conjugated; the second stays in the raw dictionary Infinitive form (-er, -ir, -re). Example: Je peux comprendre (I can understand).'
      },
      {
        heading: '2. Instant Future (Futur Proche) with Aller + Infinitive',
        body: 'Before worrying about formal future endings, native speakers express 85% of spoken future plans using Aller (present) + Infinitive: "Je vais appeler le client" (I am going to call the client).'
      },
      {
        heading: '3. Instant Recent Past (Passé Récent) with Venir de + Infinitive',
        body: 'To say you "just" did something 2 minutes ago, use Venir (je viens, tu viens, il vient) + de + Infinitive: "Je viens de finir le rapport" (I just finished the report).'
      }
    ],
    proTip:
      'Whenever you forget how to conjugate a tricky verb in the middle of a conversation, wrap it inside a modal or "aller"! Even if you forget the past or future of "résoudre" (to solve), you can effortlessly say "Je vais résoudre ça" or "Je dois résoudre ça".',
    patterns: [
      {
        category: 'POUVOIR (can / to be able)',
        french: 'Je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent',
        phonetic: 'zhuh puh, tu puh, eel puh, noo poo-vohn, voo poo-vay, eel puhv',
        english: 'Je peux vous aider. (I can help you.)'
      },
      {
        category: 'VOULOIR (to want)',
        french: 'Je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent',
        phonetic: 'zhuh vuh, tu vuh, eel vuh, noo voo-lohn, voo voo-lay, eel vuhl',
        english: 'On veut partir tôt. (We want to leave early.)'
      },
      {
        category: 'DEVOIR (must / have to)',
        french: 'Je dois, tu dois, il doit, nous devons, vous devez, ils doivent',
        phonetic: 'zhuh dwah, tu dwah, eel dwah, noo duh-vohn, voo duh-vay, eel dwahv',
        english: 'Je dois travailler demain. (I have to work tomorrow.)'
      },
      {
        category: 'Futur Proche (Near Future)',
        french: 'Nous allons commencer la réunion.',
        phonetic: 'noo-zah-lohn koh-mahn-say lah ray-oo-nyohn',
        english: 'We are going to start the meeting.'
      },
      {
        category: 'Passé Récent (Just did)',
        french: 'Il vient d’arriver au bureau.',
        phonetic: 'eel vyahn dah-ree-vay oh boo-roh',
        english: 'He just arrived at the office.'
      }
    ],
    flashcards: [
      { fr: 'Je vais vous envoyer le document.', en: 'I am going to send you the document.', hint: 'Aller + infinitive' },
      { fr: 'Est-ce que tu peux m’expliquer ça ?', en: 'Can you explain that to me?', hint: 'Pouvoir + infinitive' },
      { fr: 'On doit trouver une solution.', en: 'We must / have to find a solution.', hint: 'Devoir + infinitive' },
      { fr: 'Je viens de recevoir votre message.', en: 'I just received your message.', hint: 'Venir de + infinitive' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How do you translate "We are going to finish the project tonight" using the Futur Proche?',
        options: [
          'On va finit le projet ce soir.',
          'On va finir le projet ce soir.',
          'On allons finir le projet ce soir.',
          'On fait finir le projet ce soir.'
        ],
        correctIndex: 1,
        explanation: 'Formula: Subject (On) + conjugated Aller (va) + raw Infinitive (finir).'
      },
      {
        id: 'q2',
        question: 'Which sentence accurately says "I just spoke with the director"?',
        options: [
          'Je vais parler avec le directeur.',
          'Je viens parler avec le directeur.',
          'Je viens de parler avec le directeur.',
          'Je dois de parler avec le directeur.'
        ],
        correctIndex: 2,
        explanation: '"Venir de + infinitive" means to have just done something. Don’t forget the "de" bridge!'
      },
      {
        id: 'q3',
        question: 'Select the correct 3rd-person plural ("ils") form of devoir (they must):',
        options: ['Ils doivent', 'Ils doiventent', 'Ils devons', 'Ils peuvent'],
        correctIndex: 0,
        explanation: 'Je dois / Tu dois / Il doit -> Ils doivent (pronounced [eel dwahv]).'
      },
      {
        id: 'q4',
        question: 'What is wrong with the sentence "Je veux comprends le français"?',
        options: [
          'Nothing, it is grammatically correct.',
          'The second verb must be in the infinitive ("comprendre") because the first verb ("veux") is already conjugated.',
          '"Veux" cannot be used with "je".',
          '"Le français" should come before the verb.'
        ],
        correctIndex: 1,
        explanation: 'Golden Rule: Two conjugated verbs cannot sit next to each other. Conjugate #1 (Je veux) + Infinitive #2 (comprendre).'
      }
    ]
  },

  {
    id: 'negation-questions',
    tier: 1,
    col: 2,
    title: 'Negation & Question Frames',
    subtitle: 'Ne...pas Sandwich, Ne...jamais & The 3 Question Tiers',
    weeks: 'Weeks 2–3',
    studyTime: '45m Lesson • 15m Drill',
    xp: 200,
    cefr: 'A1/A2 Syntax',
    prereqs: ['phonetics-core'],
    summary:
      'Learn how to negate any tense (including stacked verbs) and ask effortless questions without getting tangled in formal subject-verb inversions.',
    mentalModel: [
      {
        heading: '1. The Negation Sandwich (ne ... pas)',
        body: 'Wrap "ne" (or "n’" before a vowel) and "pas" around the CONJUGATED verb—never around the infinitive that follows! Example: "Je ne vais pas partir" (I am not going to leave).'
      },
      {
        heading: '2. Upgrading "Pas" for Precision',
        body: 'Swap out "pas" for high-leverage negative words in the exact same slot: ne...jamais (never), ne...plus (no longer/not anymore), ne...rien (nothing), ne...personne (nobody).'
      },
      {
        heading: '3. The "Est-ce que" Universal Question Shield',
        body: 'Instead of inverting verbs ("Parlez-vous ?"), simply snap "Est-ce que" [es-kuh] onto the front of ANY statement to turn it into a natural, polite question: "Est-ce que vous travaillez ici ?"'
      }
    ],
    proTip:
      'In "ne...plus" (no longer/anymore), the final S of "plus" is completely SILENT: "Je n’ai plus de café" [zhuh nay ploo duh kah-fay]. Also, after ANY negation, articles un/une/du/de la/des collapse into "de" (e.g., "Je n’ai pas de voiture").',
    patterns: [
      {
        category: 'Standard Negation',
        french: 'Je ne comprends pas la question.',
        phonetic: 'zhuh nuh kohn-prahn pah lah kes-tyohn',
        english: 'I do not understand the question.'
      },
      {
        category: 'Double-Verb Negation',
        french: 'Nous n’allons pas accepter cette offre.',
        phonetic: 'noo nah-lohn pah ak-sep-tay set oh-fruh',
        english: 'We are not going to accept this offer. (Sandwich wraps "allons")'
      },
      {
        category: 'Negative + "DE" Rule',
        french: 'J’ai une idée. → Je n’ai pas d’idée.',
        phonetic: 'zhay oon ee-day -> zhuh nay pah dee-day',
        english: 'I have an idea. -> I don’t have any idea. (une becomes de/d’)'
      },
      {
        category: 'Question words + Est-ce que',
        french: 'Où est-ce que tu habites ? / Quand est-ce qu’on part ?',
        phonetic: 'oo es-kuh tu ah-beet / kahn-tes-kohn par',
        english: 'Where do you live? / When are we leaving?'
      },
      {
        category: 'Qu’est-ce que vs. Qu’est-ce qui',
        french: 'Qu’est-ce que tu fais ? vs. Qu’est-ce qui se passe ?',
        phonetic: 'kes-kuh tu feh vs. kes-kee suh pahs',
        english: 'What are you doing? (object) vs. What is happening? (subject)'
      }
    ],
    flashcards: [
      { fr: 'Je ne travaille plus ici.', en: 'I don’t work here anymore.', hint: 'ne...plus (silent s)' },
      { fr: 'Pourquoi est-ce que vous dites ça ?', en: 'Why do you say that?', hint: 'Pourquoi + est-ce que' },
      { fr: 'Elle ne veut jamais attendre.', en: 'She never wants to wait.', hint: 'Negation wraps conjugated verb' },
      { fr: 'Il n’y a pas de problème.', en: 'There is no problem.', hint: 'pas + de' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Where does the negation go in "I cannot come tomorrow" (Pouvoir + venir)?',
        options: [
          'Je peux ne pas venir demain.',
          'Je ne peux venir pas demain.',
          'Je ne peux pas venir demain.',
          'Ne je peux pas venir demain.'
        ],
        correctIndex: 2,
        explanation: 'The ne...pas sandwich always wraps tightly around the first (conjugated) verb: "Je [ne peux pas] venir".'
      },
      {
        id: 'q2',
        question: 'How does "J’ai des questions" (I have some questions) change in the negative?',
        options: [
          'Je n’ai pas des questions.',
          'Je n’ai pas de questions.',
          'Je n’ai de pas questions.',
          'Je n’ai pas les questions.'
        ],
        correctIndex: 1,
        explanation: 'After a negative verb (except with être), un, une, du, de la, and des all turn into "de" (or d’): "pas de questions".'
      },
      {
        id: 'q3',
        question: 'How do you ask "What is happening?" in natural French?',
        options: [
          'Qu’est-ce que se passe ?',
          'Qu’est-ce qui se passe ?',
          'Quel se passe ?',
          'Pourquoi se passe ?'
        ],
        correctIndex: 1,
        explanation: 'When "What" is the SUBJECT of the verb (What is happening?), use "Qu’est-ce qui". When "What" is the object (Qu’est-ce que tu vois ?), use "Qu’est-ce que".'
      },
      {
        id: 'q4',
        question: 'What does "Il ne fume plus" mean?',
        options: [
          'He smokes more.',
          'He never smoked.',
          'He doesn’t smoke anymore / no longer smokes.',
          'He smokes a lot.'
        ],
        correctIndex: 2,
        explanation: '"Ne ... plus" means "no longer / not anymore".'
      }
    ]
  },

  {
    id: 'cognates-connectors',
    tier: 1,
    col: 3,
    title: 'Cognates & Discourse Connectors',
    subtitle: 'Unlocking 3,000+ Words & Logical Bridges',
    weeks: 'Week 3',
    studyTime: '40m Lesson • 15m Drill',
    xp: 200,
    cefr: 'A2 Vocabulary Hack',
    prereqs: ['phonetics-core'],
    summary:
      'Because of the 1066 Norman Conquest, English shares ~35% of its advanced vocabulary with French. Combine cognates with logical connectors to sound articulate immediately.',
    mentalModel: [
      {
        heading: '1. Systematic Suffix Conversion',
        body: 'Thousands of English words convert 1-to-1 into French: -tion stays -tion (always feminine: la nation, la solution), -ty becomes -té (la priorité, l’université), -ly becomes -ment (exactement, rapidement), and -ic becomes -ique (économique, logique).'
      },
      {
        heading: '2. Watch Out for the Top 5 "Faux Amis" (False Friends)',
        body: 'Memorize the few high-frequency traps: "actuellement" means currently (NOT actually -> en fait), "attendre" means to wait (NOT attend -> assister à), and "demander" means to ask (NOT demand -> exiger).'
      },
      {
        heading: '3. High-Leverage Discourse Connectors',
        body: 'Language evaluators (like SLE and DELF) grade you heavily on "cohesion". Link simple clauses using: parce que (because), donc (so/therefore), pourtant / cependant (however), en fait (actually/in fact), and d’ailleurs (besides/by the way).'
      }
    ],
    proTip:
      'Every single French noun ending in "-tion" or "-sion" is FEMININE (la situation, une décision, la réunion). You never have to guess the gender on any of these 1,500+ words!',
    patterns: [
      {
        category: '-TION / -SION (Always Feminine)',
        french: 'C’est une excellente opportunité pour l’organisation.',
        phonetic: 'seh-toon ek-seh-lahnt oh-por-too-nee-tay poor lor-gah-nee-zah-syohn',
        english: 'It is an excellent opportunity for the organization.'
      },
      {
        category: 'False Friend Trap #1',
        french: 'En fait, je travaille actuellement sur ce projet.',
        phonetic: 'ahn feh, zhuh trah-vahy ak-twel-mahn soor suh proh-zheh',
        english: 'Actually (en fait), I am currently (actuellement) working on this project.'
      },
      {
        category: 'False Friend Trap #2',
        french: 'J’attends mon collègue pour assister à la conférence.',
        phonetic: 'zhah-tahn mohn koh-leg poor ah-sees-tay ah lah kohn-fay-rahns',
        english: 'I am waiting for my colleague to attend the conference.'
      },
      {
        category: 'Cause & Contrast Connectors',
        french: 'Puisque tu es là, on peut commencer ; cependant, il reste peu de temps.',
        phonetic: 'pwees-kuh tu eh lah, ohn puh koh-mahn-say; suh-pahn-dahn, eel rest puh duh tahn',
        english: 'Since you are here, we can start; however, there is little time left.'
      }
    ],
    flashcards: [
      { fr: 'En fait, c’est tout à fait logique.', en: 'Actually / In fact, it is completely logical.', hint: 'En fait = actually' },
      { fr: 'J’attends une réponse importante.', en: 'I am waiting for an important answer.', hint: 'Attendre = to wait for' },
      { fr: 'Actuellement, la situation est stable.', en: 'Currently, the situation is stable.', hint: 'Actuellement = currently' },
      { fr: 'Je vais assister à la réunion donc je dois partir.', en: 'I am going to attend the meeting so I must leave.', hint: 'Assister à = attend' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does the French sentence "J’attends la réunion actuellement" mean in English?',
        options: [
          'I am actually attending the meeting.',
          'I am currently waiting for the meeting.',
          'I am demanding the meeting right now.',
          'I attended the meeting yesterday.'
        ],
        correctIndex: 1,
        explanation: 'Double false friend! "Attendre" = to wait for (NOT attend), and "actuellement" = currently (NOT actually).'
      },
      {
        id: 'q2',
        question: 'What is the grammatical gender of French nouns ending in "-tion" (e.g., information, solution, condition)?',
        options: [
          'Always masculine (le)',
          '100% Feminine (la / une)',
          '50/50 split between masculine and feminine',
          'Plural only'
        ],
        correctIndex: 1,
        explanation: 'Every "-tion" and "-sion" noun in French is feminine: la solution, une information, la question.'
      },
      {
        id: 'q3',
        question: 'How do you say "Actually / In fact" when correcting a misconception?',
        options: ['Actuellement', 'En fait', 'Éventuellement', 'Simplement'],
        correctIndex: 1,
        explanation: '"En fait" means "In fact / Actually". ("Éventuellement" is another false friend meaning "possibly/if need be", not eventually!)'
      },
      {
        id: 'q4',
        question: 'Which connector best fills the blank: "Il pleut, ______ nous allons rester à la maison" (It is raining, therefore/so we are going to stay home)?',
        options: ['pourtant', 'donc', 'bien que', 'sans'],
        correctIndex: 1,
        explanation: '"Donc" means "so / therefore". ("Pourtant" means yet/however).'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TIER 2: TEMPORAL & PRONOMINAL COMPRESSION (WEEKS 4–7)
  // --------------------------------------------------------------------------
  {
    id: 'passe-compose',
    tier: 2,
    col: 0,
    title: 'Passé Composé (Completed Past)',
    subtitle: 'Auxiliary Avoir vs. Être & Past Participle Patterns',
    weeks: 'Weeks 4–5',
    studyTime: '60m Lesson • 20m Drill',
    xp: 250,
    cefr: 'A2 Narrative',
    prereqs: ['big-4-verbs', 'negation-questions'],
    summary:
      'Narrate any completed past event using the 2-part formula: Present-tense Auxiliary (Avoir or Être) + Past Participle.',
    mentalModel: [
      {
        heading: '1. The 2-Part Formula: Auxiliary + Past Participle',
        body: 'In French, "I spoke" and "I have spoken" are the exact same tense: "J’ai parlé". Regular participles are predictable: -ER -> -é (parlé), -IR -> -i (fini), -RE -> -u (vendu, attendu).'
      },
      {
        heading: '2. 85% Avoir vs. 15% Être (Movement & Reflexive Verbs)',
        body: 'Most verbs use AVOIR as their helper ("J’ai mangé"). Only ~17 intransitive "coming/going/state-change" verbs (DR MRS VANDERTRAMP: aller, venir, arriver, partir, entrer, sortir, rester, tomber, naître, mourir) plus all reflexive verbs ("se lever") use ÊTRE ("Je suis allé(e)").'
      },
      {
        heading: '3. High-Frequency Irregular Participles Grouped by Sound',
        body: 'Group them by ending sound: [-u] avoir -> eu, pouvoir -> pu, vouloir -> voulu, devoir -> dû, savoir -> su, voir -> vu, lire -> lu. [-is/-it] prendre -> pris, mettre -> mis, faire -> fait, dire -> dit. Plus être -> été.'
      }
    ],
    proTip:
      'When negating the Passé Composé, the "ne...pas" sandwich still wraps ONLY the auxiliary verb—never the participle! Say "Je n’ai pas compris" (I didn’t understand) or "Elle n’est pas venue" (She didn’t come).',
    patterns: [
      {
        category: 'Standard Avoir Past',
        french: 'J’ai fini le rapport et j’ai envoyé le courriel.',
        phonetic: 'zhay fee-nee luh rah-por eh zhay ahn-vwah-yay luh koo-ryel',
        english: 'I finished the report and I sent the email.'
      },
      {
        category: 'Être Movement Past',
        french: 'Elle est allée à Montréal et elle est partie hier.',
        phonetic: 'el eh-tah-lay ah mohn-ray-al eh el eh par-tee yehr',
        english: 'She went to Montreal and she left yesterday. (Participle agrees with Elle: +e)'
      },
      {
        category: 'Big Irregular Participles',
        french: 'J’ai fait, j’ai pris, j’ai mis, j’ai eu, j’ai été, j’ai pu.',
        phonetic: 'zhay feh, zhay pree, zhay mee, zhay oo, zhay ay-tay, zhay poo',
        english: 'I did/made, I took, I put, I had, I was/have been, I was able to.'
      },
      {
        category: 'Negated Past',
        french: 'Nous n’avons pas encore pris de décision.',
        phonetic: 'noo nah-vohn pah-zahn-kor pree duh day-see-zyohn',
        english: 'We haven’t made a decision yet.'
      }
    ],
    flashcards: [
      { fr: 'Je suis arrivé(e) ce matin.', en: 'I arrived this morning.', hint: 'Arriver takes être' },
      { fr: 'Est-ce que tu as vu mon message ?', en: 'Did you see my message?', hint: 'voir -> vu' },
      { fr: 'On n’a pas eu le temps.', en: 'We didn’t have the time.', hint: 'avoir -> eu' },
      { fr: 'Ils ont pris une bonne décision.', en: 'They made (took) a good decision.', hint: 'prendre -> pris' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How do you say "I went to the office this morning"?',
        options: [
          'J’ai allé au bureau ce matin.',
          'Je suis allé(e) au bureau ce matin.',
          'J’allais au bureau ce matin.',
          'Je vais allé au bureau ce matin.'
        ],
        correctIndex: 1,
        explanation: '"Aller" is a core DR MRS VANDERTRAMP movement verb, so it MUST use ÊTRE as its auxiliary: "Je suis allé(e)".'
      },
      {
        id: 'q2',
        question: 'Where does "ne...pas" go when negating "J’ai compris" (I understood)?',
        options: [
          'Je n’ai compris pas.',
          'Je ne compris pas.',
          'Je n’ai pas compris.',
          'Ne j’ai pas compris.'
        ],
        correctIndex: 2,
        explanation: 'Negation always wraps the conjugated helper verb ("ai"), leaving the past participle ("compris") outside: "Je n’ai pas compris".'
      },
      {
        id: 'q3',
        question: 'Match the irregular verbs "faire, prendre, avoir" to their correct past participles:',
        options: [
          'faisé, prendu, avu',
          'fait, pris, eu',
          'fait, prendis, été',
          'feré, pris, ont'
        ],
        correctIndex: 1,
        explanation: 'Faire -> fait ("j’ai fait"), Prendre -> pris ("j’ai pris"), Avoir -> eu ("j’ai eu").'
      },
      {
        id: 'q4',
        question: 'How do you translate "I have been very busy" into French?',
        options: [
          'Je suis été très occupé.',
          'J’ai été très occupé.',
          'J’avais été très occupé.',
          'J’ai eu très occupé.'
        ],
        correctIndex: 1,
        explanation: 'Counter-intuitive trap for English speakers: The verb ÊTRE uses AVOIR as its helper in the Passé Composé! "J’ai été" = I was / I have been.'
      }
    ]
  },

  {
    id: 'imparfait-binary',
    tier: 2,
    col: 1,
    title: 'Imparfait vs. Passé Composé',
    subtitle: 'Background Scenery & Habits vs. Action Snapshots',
    weeks: 'Weeks 5–6',
    studyTime: '55m Lesson • 20m Drill',
    xp: 250,
    cefr: 'A2+/B1 Storytelling',
    prereqs: ['passe-compose', 'modal-shortcuts'],
    summary:
      'Master the #1 B1/SLE storytelling test: knowing when to paint the ongoing background stage (Imparfait) versus firing a discrete plot event (Passé Composé).',
    mentalModel: [
      {
        heading: '1. Video Camera (Imparfait) vs. Photo Snapshot (Passé Composé)',
        body: 'Think of a movie scene: Imparfait is the continuous background video—how things were, what was already happening ("I was working", "It was raining"), or old habits ("I used to live in Ottawa"). Passé Composé is the sudden action that interrupts or advances the plot ("when the phone rang").'
      },
      {
        heading: '2. The 100% Regular Imparfait Stem Formula',
        body: 'Take the "nous" present tense form, drop "-ons" (nous parlons -> parl-, nous finissons -> finiss-, nous avons -> av-, nous faisons -> fais-), and add: -ais, -ais, -ait, -ions, -iez, -aient. The ONLY irregular stem in the entire language is Être -> ét- (j’étais, c’était).'
      },
      {
        heading: '3. The Golden 4 Descriptive Frames',
        body: 'For states of mind, weather, time, and background explanations in the past, default to Imparfait: C’était (It was), Il y avait (There was/were), J’avais (I had), Je voulais / Je pensais (I wanted / I thought).'
      }
    ],
    proTip:
      'Just like the present tense, the endings "-ais", "-ais", "-ait", and "-aient" all sound 100% IDENTICAL aloud: [eh]! Once you know "j’étais" [zheh-teh], you automatically know the sound of tu étais, il était, and ils étaient.',
    patterns: [
      {
        category: 'Interruption Frame',
        french: 'Je travaillais quand le directeur a appelé.',
        phonetic: 'zhuh trah-vah-yeh kahn luh dee-rek-tuhr ah ah-puh-lay',
        english: 'I was working (ongoing background: Imparfait) when the director called (event: P.C.).'
      },
      {
        category: 'The Big 4 in Imparfait',
        french: 'C’était super, il y avait du monde, j’avais le temps, je voulais rester.',
        phonetic: 'seh-teh soo-pehr, eel yah-veh doo mohnd, zhah-veh luh tahn, zhuh voo-leh res-tay',
        english: 'It was great, there were people, I had time, I wanted to stay.'
      },
      {
        category: 'Past Habit ("Used to")',
        french: 'Avant, j’habitais à Toronto et je prenais le train tous les jours.',
        phonetic: 'ah-vahn, zhah-bee-teh ah toh-rohn-toh eh zhuh pruh-neh luh trahn too lay zhoor',
        english: 'Before, I used to live in Toronto and I took the train every day.'
      }
    ],
    flashcards: [
      { fr: 'C’était vraiment intéressant.', en: 'It was really interesting.', hint: 'Description = Imparfait (c’était)' },
      { fr: 'Il pleuvait quand je suis sorti.', en: 'It was raining when I went out.', hint: 'Background weather + sudden action' },
      { fr: 'Je pensais que tu étais en vacances.', en: 'I thought you were on vacation.', hint: 'Mental state = Imparfait' },
      { fr: 'Avant, on faisait ça différemment.', en: 'Before, we used to do that differently.', hint: 'Past habit = Imparfait' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Choose the right tenses: "Yesterday I was reading (1) when my friend arrived (2)."',
        options: [
          '(1) J’ai lu / (2) mon ami arrivait',
          '(1) Je lisais / (2) mon ami est arrivé',
          '(1) Je lisais / (2) mon ami arrivait',
          '(1) J’ai lu / (2) mon ami est arrivé'
        ],
        correctIndex: 1,
        explanation: '"Was reading" is the ongoing background action in progress (Imparfait: Je lisais), interrupted by a completed event (Passé Composé: est arrivé).'
      },
      {
        id: 'q2',
        question: 'Which verb is the ONLY verb in French with an irregular stem in the Imparfait?',
        options: ['Avoir', 'Aller', 'Faire', 'Être (stem: ét-)'],
        correctIndex: 3,
        explanation: 'Every verb except Être derives its Imparfait stem directly from its "nous" present form (nous avons -> av-). Only Être uses "ét-" (j’étais).'
      },
      {
        id: 'q3',
        question: 'How do you say "There were a lot of questions during the meeting"?',
        options: [
          'Il a eu beaucoup de questions pendant la réunion.',
          'Il y avait beaucoup de questions pendant la réunion.',
          'Il était beaucoup de questions pendant la réunion.',
          'Il y avaient beaucoup de questions.'
        ],
        correctIndex: 1,
        explanation: '"Il y a" (there is/are) becomes "Il y avait" in the Imparfait to describe background conditions.'
      },
      {
        id: 'q4',
        question: 'How are "je parlais", "tu parlais", "il parlait", and "ils parlaient" pronounced?',
        options: [
          'All four endings (-ais, -ais, -ait, -aient) are pronounced identically as [par-leh].',
          '"Ils parlaient" pronounces the "-ent" at the end.',
          'The S and T are pronounced.',
          'Each has a distinct vowel.'
        ],
        correctIndex: 0,
        explanation: 'Spoken French efficiency: -ais, -ait, and -aient sound 100% identical ([eh]).'
      }
    ]
  },

  {
    id: 'object-pronouns',
    tier: 2,
    col: 2,
    title: 'Direct & Indirect Object Pronouns',
    subtitle: 'Le, La, Les vs. Lui, Leur & Pre-Verbal Placement',
    weeks: 'Week 6',
    studyTime: '55m Lesson • 20m Drill',
    xp: 250,
    cefr: 'B1 Compression',
    prereqs: ['passe-compose', 'negation-questions'],
    summary:
      'Stop repeating nouns like a textbook robot. Compress sentences like a native by placing object pronouns directly BEFORE the verb.',
    mentalModel: [
      {
        heading: '1. Reverse Word Order: Pronouns Go BEFORE the Verb',
        body: 'In English, pronouns go after the verb ("I see him"). In French, they jump directly in front of the verb ("Je le vois"). If there is a two-verb modal/future stack, the pronoun attaches right in front of the INFINITIVE it belongs to ("Je vais le voir" = I’m going to see him).'
      },
      {
        heading: '2. Direct (le, la, les) vs. Indirect "To a Person" (lui, leur)',
        body: 'If there is no "à" before the object (voir quelqu’un, aider quelqu’un), use Direct Object Pronouns: le (him/it), la (her/it), les (them). If the verb takes "à + person" (parler à, téléphoner à, envoyer à, dire à, donner à), use Indirect: lui (to him OR to her!) and leur (to them).'
      },
      {
        heading: '3. Me, Te, Nous, Vous Double-Duty',
        body: 'Good news: me (me/to me), te (you/to you), nous (us/to us), and vous (you/to you) are identical whether direct or indirect! Only the 3rd person splits into le/la/les vs. lui/leur.'
      }
    ],
    proTip:
      'Huge French trap for English speakers: "Regarder" (to look at), "Écouter" (to listen to), "Chercher" (to look for), and "Attendre" (to wait for) have NO preposition in French—so they take DIRECT pronouns (Je le regarde, Je l’écoute, Je les attends). Conversely, "Téléphoner à" and "Répondre à" take INDIRECT "lui/leur" (Je lui téléphone = I call him/her)!',
    patterns: [
      {
        category: 'Direct Object (le / la / l’ / les)',
        french: 'Tu vois le rapport ? → Oui, je le vois. / Je ne le vois pas.',
        phonetic: 'tu vwah luh rah-por -> wee, zhuh luh vwah / zhuh nuh luh vwah pah',
        english: 'Do you see the report? -> Yes, I see it. / I don’t see it.'
      },
      {
        category: 'Indirect Object (lui = to him OR to her)',
        french: 'Je parle à Marie. → Je lui parle. / Je vais lui parler.',
        phonetic: 'zhuh parl ah mah-ree -> zhuh lwee parl / zhuh vay lwee par-lay',
        english: 'I speak to Marie. -> I speak to her. / I am going to speak to her.'
      },
      {
        category: 'Indirect Plural (leur = to them)',
        french: 'J’ai envoyé le fichier aux clients. → Je leur ai envoyé le fichier.',
        phonetic: 'zhay ahn-vwah-yay luh fee-shyay oh klee-yahn -> zhuh luhr eh ahn-vwah-yay...',
        english: 'I sent the file to the clients. -> I sent them the file. (Never put an S on the pronoun leur!)'
      }
    ],
    flashcards: [
      { fr: 'Je vais vous rappeler demain.', en: 'I am going to call you back tomorrow.', hint: 'Pronoun sits before the infinitive' },
      { fr: 'Je lui ai déjà répondu.', en: 'I already answered him / her.', hint: 'Répondre à quelqu’un -> lui' },
      { fr: 'Est-ce que tu les connais ?', en: 'Do you know them?', hint: 'Connaître takes direct object (les)' },
      { fr: 'On ne le comprend pas.', en: 'We don’t understand him / it.', hint: 'ne [pronoun + verb] pas' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'How do you say "I am going to call her tomorrow" using "téléphoner à"?',
        options: [
          'Je vais la téléphoner demain.',
          'Je vais téléphoner elle demain.',
          'Je vais lui téléphoner demain.',
          'Je lui vais téléphoner demain.'
        ],
        correctIndex: 2,
        explanation: 'Two rules in action: 1) "Téléphoner à quelqu’un" takes an indirect object, and "lui" means both "to him" AND "to her". 2) With Aller + Infinitive, the pronoun goes right before the infinitive ("vais lui téléphoner").'
      },
      {
        id: 'q2',
        question: 'Replace "les documents" in "J’ai lu les documents" (I read the documents):',
        options: [
          'J’ai les lu.',
          'Je les ai lus.',
          'Je leur ai lu.',
          'J’ai lu les.'
        ],
        correctIndex: 1,
        explanation: 'In the Passé Composé, the object pronoun goes BEFORE the auxiliary verb ("Je les ai lus"). Bonus: direct objects preceding avoir trigger past participle agreement (+s)!'
      },
      {
        id: 'q3',
        question: 'Translate "I am listening to him" into French:',
        options: [
          'Je lui écoute.',
          'J’écoute à lui.',
          'Je l’écoute.',
          'Je le écoute.'
        ],
        correctIndex: 2,
        explanation: '"Écouter" already means "to listen to" (no "à"), so it takes the direct object pronoun "le", which contracts to "l’" before the vowel in écoute: "Je l’écoute".'
      },
      {
        id: 'q4',
        question: 'How do you say "I gave them my number" (donner à quelqu’un)?',
        options: [
          'Je les ai donné mon numéro.',
          'Je leurs ai donné mon numéro.',
          'Je leur ai donné mon numéro.',
          'J’ai donné leur mon numéro.'
        ],
        correctIndex: 2,
        explanation: '"Donner à" takes the indirect plural pronoun "leur" (to them). Note: As a verb pronoun, "leur" NEVER takes an -s!'
      }
    ]
  },

  {
    id: 'y-and-en',
    tier: 2,
    col: 3,
    title: 'Power Pronouns: "Y" and "En"',
    subtitle: 'Spatial ("There") & Quantitative ("Of It / Some") Compression',
    weeks: 'Week 7',
    studyTime: '50m Lesson • 15m Drill',
    xp: 250,
    cefr: 'B1 Native Flow',
    prereqs: ['object-pronouns', 'cognates-connectors'],
    summary:
      'English often drops words like "there" or "of them" ("Are you going? Yes, I’m going" / "Do you have any? I have two"). French REQUIRES "y" and "en" to fill those slots.',
    mentalModel: [
      {
        heading: '1. "Y" = "There" or "À + Thing/Idea"',
        body: '"Y" replaces any location ("à Paris", "au bureau", "dans la salle") OR any non-person object introduced by "à" (penser à un projet -> J’y pense = I’m thinking about it). Never use "y" for people!'
      },
      {
        heading: '2. "EN" = "Some / Any / Of It" (Replaces DE + Noun)',
        body: '"En" replaces any noun preceded by partitive articles (du, de la, des), quantities/numbers (un, deux, beaucoup de), or verbs followed by "de" (parler de, avoir besoin de). Example: "Tu as besoin d’aide ? Oui, j’en ai besoin" (Yes, I need it / have need of it).'
      },
      {
        heading: '3. Essential Fixed Idioms with Y and En',
        body: 'Master these daily phrases: "Allons-y !" (Let’s go!), "J’y vais" (I’m heading out / going there), "Je m’en vais" (I’m leaving), "Ne t’en fais pas" (Don’t worry about it), and "Il y en a" (There is/are some).'
      }
    ],
    proTip:
      'In English, we can stop after a number: "How many brothers do you have? — I have two." In French, you CANNOT leave a number or quantity hanging without "en": "J’en ai deux" (I have two of them)!',
    patterns: [
      {
        category: 'Y for Locations ("There")',
        french: 'Tu vas au bureau aujourd’hui ? → Oui, j’y vais maintenant.',
        phonetic: 'tu vah oh boo-roh oh-zhoor-dwee -> wee, zhee vay mahn-tuh-nahn',
        english: 'Are you going to the office today? -> Yes, I am going there now.'
      },
      {
        category: 'Y for "À + Idea"',
        french: 'Je réfléchis à votre proposition. → J’y réfléchis.',
        phonetic: 'zhuh ray-flay-shee ah voh-truh proh-poh-zee-syohn -> zhee ray-flay-shee',
        english: 'I am thinking about your proposal. -> I am thinking about it.'
      },
      {
        category: 'EN for Quantities & Numbers',
        french: 'Vous avez des questions ? → Oui, j’en ai trois. / Non, je n’en ai pas.',
        phonetic: 'voo-zah-vay day kes-tyohn -> wee, zhahn eh trwah / nohn, zhuh nahn eh pah',
        english: 'Do you have any questions? -> Yes, I have three (of them). / No, I don’t have any.'
      },
      {
        category: 'EN for "DE" Verbs (parler de, avoir besoin de)',
        french: 'On a déjà parlé de ce problème. → On en a déjà parlé.',
        phonetic: 'ohn ah day-zhah par-lay duh suh proh-blem -> ohn ahn ah day-zhah par-lay',
        english: 'We already spoke about this problem. -> We already spoke about it.'
      }
    ],
    flashcards: [
      { fr: 'J’y pense souvent.', en: 'I think about it often.', hint: 'Penser à quelque chose -> y' },
      { fr: 'On en parle demain ?', en: 'Shall we talk about it tomorrow?', hint: 'Parler de quelque chose -> en' },
      { fr: 'J’en ai vraiment besoin.', en: 'I really need it.', hint: 'Avoir besoin de -> en' },
      { fr: 'Il n’y en a plus.', en: 'There isn’t any left / There are no more of them.', hint: 'Il y a + en + ne...plus' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Someone asks: "Tu as combien de frères ?" (How many brothers do you have?). How do you answer "I have two"?',
        options: [
          'J’ai deux.',
          'Je les ai deux.',
          'J’en ai deux.',
          'J’y ai deux.'
        ],
        correctIndex: 2,
        explanation: 'Whenever you state a number or quantity without repeating the noun, French requires "en" (of them): "J’en ai deux".'
      },
      {
        id: 'q2',
        question: 'Why does "Je pense à ce projet" compress to "J’y pense", while "Je parle de ce projet" compresses to "J’en parle"?',
        options: [
          '"Y" replaces "à + thing/location", whereas "En" replaces "de + thing".',
          '"Y" is only for the past tense.',
          '"En" is only used for people.',
          'They are completely interchangeable.'
        ],
        correctIndex: 0,
        explanation: 'Core rule: À + thing = Y (penser à -> j’y pense). DE + thing = EN (parler de / avoir besoin de -> j’en parle / j’en ai besoin).'
      },
      {
        id: 'q3',
        question: 'How do you say "Are you going to the meeting? Yes, I am going (there)"?',
        options: [
          'Oui, je vais.',
          'Oui, je la vais.',
          'Oui, j’y vais.',
          'Oui, j’en vais.'
        ],
        correctIndex: 2,
        explanation: 'In French, "aller" cannot stand alone without a destination; if the destination is implied ("there"), you must say "J’y vais".'
      },
      {
        id: 'q4',
        question: 'What does the ultra-common phrase "Il n’y en a plus" mean?',
        options: [
          'There is a lot more there.',
          'There isn’t any left / There are no more of them.',
          'He doesn’t go there anymore.',
          'We don’t need it.'
        ],
        correctIndex: 1,
        explanation: 'Il y a (there is) + en (of it/them) + ne...plus (no longer/no more) = "There aren’t any left."'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TIER 3: NUANCE, SUBJUNCTIVE & ORAL FLUENCY ENGINE (WEEKS 8–12)
  // --------------------------------------------------------------------------
  {
    id: 'conditionnel',
    tier: 3,
    col: 1,
    title: 'Le Conditionnel & Si Clauses',
    subtitle: 'Diplomatic Politeness, Advice & Hypotheticals',
    weeks: 'Weeks 8–9',
    studyTime: '60m Lesson • 20m Drill',
    xp: 300,
    cefr: 'B1/SLE-B Diplomacy',
    prereqs: ['imparfait-binary', 'object-pronouns'],
    summary:
      'Essential for workplace diplomacy, polite requests, and B1/SLE-B hypothetical questions ("What would you do if...").',
    mentalModel: [
      {
        heading: '1. Future Stem + Imparfait Endings = Conditionnel',
        body: 'The Conditional ("would") is a hybrid tense: take the Future stem (which for regular verbs is just the full Infinitive like parler-, finir-) and glue on the Imparfait endings you already know (-ais, -ais, -ait, -ions, -iez, -aient)!'
      },
      {
        heading: '2. The Top 6 Irregular Stems (Shared by Future & Conditional)',
        body: 'Memorize these 6 high-yield stems once and you unlock both Future AND Conditional: être -> ser- (ce serait = it would be), avoir -> aur- (j’aurais = I would have), aller -> ir- (j’irais), faire -> fer- (je ferais), pouvoir -> pourr- (je pourrais = I could), vouloir -> voudr- (je voudrais = I would like), devoir -> devr- (tu devrais = you should).'
      },
      {
        heading: '3. The Golden Hypothetical Formula: SI + Imparfait -> Conditionnel',
        body: 'To say "If I had time, I would travel", French strictly forbids putting the Conditional right after "Si" (If). Instead, use: [Si + Imparfait], [Conditionnel]: "Si j’avais le temps, je voyagerais" ("Si" never eats "-rais"!).'
      }
    ],
    proTip:
      'Memory rhyme for exams and interviews: "Les SI n’aiment pas les -RAIS" (The word "Si" never takes a conditional -rais verb right after it). Always pair "Si + Imparfait" with a "Conditionnel" result clause!',
    patterns: [
      {
        category: 'Diplomatic Workplace Trio',
        french: 'Je voudrais proposer une idée. Pourriez-vous m’aider ? On devrait vérifier.',
        phonetic: 'zhuh voo-dreh proh-poh-zay oon ee-day. poo-ryay voo may-day. ohn duh-vreh vay-ree-fyay',
        english: 'I would like to propose an idea. Could you help me? We should check.'
      },
      {
        category: 'The "Si + Imparfait -> Conditionnel" Engine',
        french: 'Si j’étais à votre place, je prendrais cette opportunité.',
        phonetic: 'see zheh-teh ah voh-truh plahs, zhuh prahn-dreh set oh-por-too-nee-tay',
        english: 'If I were in your place, I would take this opportunity.'
      },
      {
        category: 'Ce serait / Il faudrait',
        french: 'Ce serait préférable, mais il faudrait plus de budget.',
        phonetic: 'suh suh-reh pray-fay-rah-bluh, meh eel foh-dreh ploo duh bood-zheh',
        english: 'It would be preferable, but it would require (take) more budget.'
      }
    ],
    flashcards: [
      { fr: 'Est-ce que tu pourrais m’envoyer le lien ?', en: 'Could you send me the link?', hint: 'Pouvoir in conditional (pourrais)' },
      { fr: 'On devrait organiser une réunion.', en: 'We should organize a meeting.', hint: 'Devoir in conditional = should' },
      { fr: 'Si j’avais le choix, je ferais la même chose.', en: 'If I had the choice, I would do the same thing.', hint: 'Si + Imparfait -> Conditionnel' },
      { fr: 'Ce serait une excellente solution.', en: 'That would be an excellent solution.', hint: 'Être -> ser- + -ait' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Complete the hypothetical sentence: "If I had more time, I would learn Spanish" (Si _____ plus de temps, j’apprendrais l’espagnol).',
        options: [
          'Si j’aurais',
          'Si j’avais',
          'Si j’ai eu',
          'Si je voudrais'
        ],
        correctIndex: 1,
        explanation: 'Remember: "Les SI n’aiment pas les -RAIS!" In a hypothetical "If" clause, you must use the Imparfait ("Si j’avais") followed by the Conditionnel ("j’apprendrais").'
      },
      {
        id: 'q2',
        question: 'How do you translate "We should talk about it" using "on"?',
        options: [
          'On doit en parler.',
          'On devrait en parler.',
          'On voudrait en parler.',
          'On pourrait y parler.'
        ],
        correctIndex: 1,
        explanation: 'The verb "devoir" (must) softens to "should" when placed in the Conditional: "On devrait" (We should).'
      },
      {
        id: 'q3',
        question: 'What does "Ce serait parfait" mean?',
        options: [
          'It was perfect.',
          'It will be perfect.',
          'That/It would be perfect.',
          'It is perfect.'
        ],
        correctIndex: 2,
        explanation: '"Ser-" is the future/conditional stem of Être. With the "-ait" ending, "Ce serait" means "That/It would be".'
      },
      {
        id: 'q4',
        question: 'What is the difference in pronunciation and meaning between "Je ferai" and "Je ferais"?',
        options: [
          '"Je ferai" (no S) means "I will do"; "Je ferais" (with S) means "I would do" (and they sound nearly identical in modern French!).',
          '"Je ferai" is past tense.',
          'The S in "Je ferais" is pronounced loudly.',
          'They come from the verb finir.'
        ],
        correctIndex: 0,
        explanation: '1st-person Future (-ai) means "I will", while 1st-person Conditional (-ais) means "I would". Context and "si" clauses make the meaning unmistakable!'
      }
    ]
  },

  {
    id: 'subjonctif',
    tier: 3,
    col: 2,
    title: 'High-Frequency Subjonctif',
    subtitle: 'Necessity (Il faut que), Emotion, Doubt & Will Triggers',
    weeks: 'Weeks 9–10',
    studyTime: '60m Lesson • 20m Drill',
    xp: 300,
    cefr: 'B1/B2 Distinction',
    prereqs: ['imparfait-binary', 'y-and-en'],
    summary:
      'Don’t fear the Subjunctive! Master the 6 triggers and 7 irregular verbs that make up 90% of real-world subjunctive usage.',
    mentalModel: [
      {
        heading: '1. What Triggers the Subjunctive? (Subject 1 + QUE + Subject 2)',
        body: 'The Subjunctive mood appears after "que" when Subject 1 expresses Necessity, Will/Desire, Emotion, or Doubt toward Subject 2 (WEIRDO). If there is only ONE subject, avoid the subjunctive completely with an infinitive! Compare: "Il faut partir" (general) vs. "Il faut que tu partes" (specific subject after que).'
      },
      {
        heading: '2. Regular Subjunctive Stem = "Ils" Present Stem',
        body: 'Take the "ils" present form, drop "-ent", and add -e, -es, -e, -ions, -iez, -ent. Notice that for ALL regular -ER verbs, the singular and "ils" subjunctive forms are 100% identical to the regular present tense! You only hear the difference on irregular verbs.'
      },
      {
        heading: '3. The Top 6 Irregular Subjunctives You Actually Hear',
        body: 'Lock in these 6 forms and you will sound effortlessly educated: être -> que je sois / qu’il soit; avoir -> que j’aie / qu’il ait; faire -> que je fasse; aller -> que j’aille; pouvoir -> que je puisse; savoir -> que je sache.'
      }
    ],
    proTip:
      'Notice how "bien que" (although/even though), "pour que" (so that/in order that), and "avant que" (before) ALWAYS trigger the subjunctive! Sticking "Bien que ce soit difficile..." (Although it is difficult...) into an oral exam instantly signals B1+/B2 mastery.',
    patterns: [
      {
        category: 'Trigger #1: Necessity (Il faut que)',
        french: 'Il faut que j’aille au bureau et que je fasse ce rapport.',
        phonetic: 'eel foh kuh zhay oh boo-roh eh kuh zhuh fahs suh rah-por',
        english: 'I have to go to the office and do this report. (aller -> aille, faire -> fasse)'
      },
      {
        category: 'Trigger #2: Will / Desire (Vouloir / Préférer que)',
        french: 'Je veux que vous soyez prêt avant la réunion.',
        phonetic: 'zhuh vuh kuh voo swah-yay preh ah-vahn lah ray-oo-nyohn',
        english: 'I want you to be ready before the meeting. (être -> soyez)'
      },
      {
        category: 'Trigger #3: Emotion (Être content / désolé que)',
        french: 'Je suis content qu’il ait pu venir aujourd’hui.',
        phonetic: 'zhuh swee kohn-tahn keel eh poo vuh-neer oh-zhoor-dwee',
        english: 'I am happy that he was able to come today. (avoir -> ait)'
      },
      {
        category: 'Trigger #4: Concession & Purpose (Bien que / Pour que)',
        french: 'Bien que ce soit complexe, je l’explique pour que tout le monde comprenne.',
        phonetic: 'byahn kuh suh swah kohn-pleks, zhuh leks-pleek poor kuh too luh mohnd kohn-pren',
        english: 'Although it is complex, I explain it so that everyone understands.'
      }
    ],
    flashcards: [
      { fr: 'Il faut que tu fasses attention.', en: 'You must pay attention.', hint: 'Il faut que + faire (fasses)' },
      { fr: 'Bien que ce soit compliqué...', en: 'Although it is complicated...', hint: 'Bien que + être (soit)' },
      { fr: 'Je ne pense pas qu’il puisse venir.', en: 'I don’t think he can come.', hint: 'Negative opinion + pouvoir (puisse)' },
      { fr: 'Il est important que nous ayons une stratégie.', en: 'It is important that we have a strategy.', hint: 'avoir -> ayons' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Complete the sentence: "Il faut que nous _______ (faire) un effort."',
        options: [
          'faisons',
          'ferons',
          'fassions',
          'faites'
        ],
        correctIndex: 2,
        explanation: '"Il faut que" is the #1 Subjunctive trigger in French. The subjunctive stem of "faire" is "fass-" -> que nous fassions.'
      },
      {
        id: 'q2',
        question: 'How do you say "Although it is late, I am still working" using "Bien que"?',
        options: [
          'Bien que c’est tard, je travaille encore.',
          'Bien que ce soit tard, je travaille encore.',
          'Bien que ce serait tard, je travaille encore.',
          'Bien qu’il a tard, je travaille encore.'
        ],
        correctIndex: 1,
        explanation: '"Bien que" (although) always triggers the Subjunctive: c’est -> ce soit.'
      },
      {
        id: 'q3',
        question: 'Why does "Je pense qu’il est là" use the normal indicative ("est"), while "Je ne pense pas qu’il soit là" uses the subjunctive ("soit")?',
        options: [
          'Affirmative "Je pense que" expresses certainty/belief (Indicative), while negative "Je ne pense pas que" introduces doubt (Subjunctive).',
          'All negative sentences in French use the subjunctive.',
          'It is a spelling error.',
          '"Soit" is the future tense.'
        ],
        correctIndex: 0,
        explanation: 'Classic French nuance: Affirmative opinion verbs (je pense que, je crois que) take the normal Indicative; when negated (je ne pense pas que), they express doubt and flip to the Subjunctive!'
      },
      {
        id: 'q4',
        question: 'Which option correctly translates "I want you to go there" (Vouloir que + tu + y aller)?',
        options: [
          'Je veux toi y aller.',
          'Je veux que tu y vas.',
          'Je veux que tu y ailles.',
          'Je veux que tu y iras.'
        ],
        correctIndex: 2,
        explanation: 'English uses an infinitive ("I want you to go"), but French requires "Subject 1 + vouloir que + Subject 2 + Subjunctive": "Je veux que tu y ailles".'
      }
    ]
  },

  {
    id: 'spoken-compression',
    tier: 3,
    col: 3,
    title: 'Oral Compression & Relative Clauses',
    subtitle: 'Street vs. Standard French + Qui, Que, Dont, Où',
    weeks: 'Weeks 11–12',
    studyTime: '60m Lesson • 25m Drill',
    xp: 350,
    cefr: 'B1/SLE-B Mastery',
    prereqs: ['conditionnel', 'subjonctif'],
    summary:
      'Bridge the gap between written French and real-speed native audio while welding complex thoughts together with relative pronouns.',
    mentalModel: [
      {
        heading: '1. Why Fast Spoken French Sounds Different (Oral Compression)',
        body: 'In natural conversation, native speakers drop ~30% of written syllables: 1) The "ne" in negation disappears 95% of the time ("Je ne sais pas" -> "Je sais pas" -> [chay pah]); 2) "Tu" contracts before vowels ("Tu es" -> "T’es", "Tu as" -> "T’as"); 3) "Il y a" compresses to [ya] ("Y’a pas de souci").'
      },
      {
        heading: '2. Welding Sentences with QUI (Subject) vs. QUE (Object)',
        body: 'Both "qui" and "que" can mean "who, which, or that". Look at the word immediately AFTER the blank: if it’s a VERB, use QUI ("La personne qui parle"). If it’s a SUBJECT + VERB, use QUE ("La personne que je connais").'
      },
      {
        heading: '3. DONT (The "DE" Relative Pronoun) & CE QUI / CE QUE ("What")',
        body: 'Whenever a verb or noun uses "de" (parler de, avoir besoin de), replace "que" with DONT ("Le projet dont je parle", "Ce dont j’ai besoin"). And use "Ce qui" (subject) / "Ce que" (object) to mean "what / the thing that" in the middle of a sentence ("Je comprends ce que tu dis").'
      }
    ],
    proTip:
      'Instant grammar check for QUI vs. QUE: "QUE" drops its E before a vowel ("le film qu’il regarde"), whereas "QUI" NEVER drops its I ("la collègue qui écoute")!',
    patterns: [
      {
        category: 'Spoken vs. Written Decoding',
        french: 'Écrit : « Je ne sais pas ce qu’il y a. » → Oral : « Chais pas c’qu’y a. »',
        phonetic: 'zhuh nuh say pah suh keel yah -> shay pah skyah',
        english: 'I don’t know what’s going on / what there is.'
      },
      {
        category: 'Spoken "Tu" Contractions',
        french: 'Écrit : « Tu es prêt ? Tu as vu ça ? » → Oral : « T’es prêt ? T’as vu ça ? »',
        phonetic: 'teh preh / tah voo sah',
        english: 'Are you ready? Did you see that?'
      },
      {
        category: 'QUI (Followed by Verb) vs. QUE (Followed by Subject)',
        french: 'Le rapport qui est sur la table est le rapport que j’ai écrit.',
        phonetic: 'luh rah-por kee eh soor lah tah-bluh eh luh rah-por kuh zhay ay-kree',
        english: 'The report that is on the table is the report that I wrote.'
      },
      {
        category: 'DONT (Replaces "de") & CE QUE ("What")',
        french: 'C’est exactement ce dont j’ai besoin et ce que je cherchais.',
        phonetic: 'seh-tegz-ak-tuh-mahn suh dohn zhay buh-zwahn eh suh kuh zhuh shehr-sheh',
        english: 'That is exactly what I need (avoir besoin de) and what I was looking for.'
      }
    ],
    flashcards: [
      { fr: 'Je comprends tout à fait ce que vous voulez dire.', en: 'I completely understand what you mean.', hint: 'ce que + subject + verb' },
      { fr: 'C’est l’outil dont on a besoin.', en: 'It is the tool (that) we need.', hint: 'avoir besoin DE -> dont' },
      { fr: 'Voilà ce qui est important.', en: 'Here is what is important.', hint: 'ce qui + verb' },
      { fr: 'T’as pas vu le courriel qu’il a envoyé ?', en: 'Didn’t you see the email he sent? (Spoken register)', hint: 'T’as pas = Tu n’as pas' }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'When a native French speaker says [chay pah] ("Chais pas") in casual conversation, what are they saying in standard French?',
        options: [
          'Je n’ai pas de chat.',
          'Je ne sais pas (I don’t know).',
          'Chez moi.',
          'C’est pas vrai.'
        ],
        correctIndex: 1,
        explanation: 'In fast spoken French, "Je ne sais pas" drops the "ne" -> "Je sais pas" -> and "Je sais" blends into [chay]: "Chais pas".'
      },
      {
        id: 'q2',
        question: 'Fill in the blanks: "Le client _____ a appelé ce matin est le client _____ nous avons rencontré hier."',
        options: [
          'que / qui',
          'qui / que',
          'dont / qui',
          'qui / qui'
        ],
        correctIndex: 1,
        explanation: 'First blank is followed directly by a verb ("a appelé") -> Subject pronoun QUI. Second blank is followed by a subject + verb ("nous avons rencontré") -> Object pronoun QUE.'
      },
      {
        id: 'q3',
        question: 'Why must we say "C’est le projet DONT je parle" instead of "C’est le projet que je parle"?',
        options: [
          'Because "projet" is masculine.',
          'Because the verb is "parler DE quelque chose", and DONT replaces "de + relative clause".',
          'Because "dont" is used for the past tense.',
          'Because "parler" is an -ER verb.'
        ],
        correctIndex: 1,
        explanation: 'Whenever the verb or expression requires "DE" (parler de, avoir besoin de, être fier de), you must use DONT!'
      },
      {
        id: 'q4',
        question: 'Translate "Tell me what is happening and what you want":',
        options: [
          'Dis-moi que se passe et qui tu veux.',
          'Dis-moi ce qui se passe et ce que tu veux.',
          'Dis-moi qu’est-ce qui se passe et qu’est-ce que tu veux.',
          'Dis-moi ce que se passe et ce qui tu veux.'
        ],
        correctIndex: 1,
        explanation: 'In the middle of a sentence, "what" (the thing that) is "ce qui" before a verb ("ce qui se passe") and "ce que" before a subject ("ce que tu veux").'
      }
    ]
  }
];

const TIER_METADATA = [
  {
    tier: 0,
    title: 'Tier 0 • Root Decoding (Week 1)',
    subtitle: 'Rewire your ear and inner pronunciation engine before memorizing syntax.',
    badge: 'Days 1–5'
  },
  {
    tier: 1,
    title: 'Tier 1 • Syntax & Lexical Core (Weeks 1–3)',
    subtitle: 'Build 80% of functional present, near-future, and question sentences with high-frequency verbs and cognates.',
    badge: 'Weeks 1–3'
  },
  {
    tier: 2,
    title: 'Tier 2 • Temporal & Pronominal Compression (Weeks 4–7)',
    subtitle: 'Narrate past events accurately and compress repetitive nouns into sleek pre-verbal pronouns.',
    badge: 'Weeks 4–7'
  },
  {
    tier: 3,
    title: 'Tier 3 • B1 / SLE-B Nuance & Fluency Engine (Weeks 8–12)',
    subtitle: 'Master workplace diplomacy, hypotheticals, high-yield subjunctive triggers, and fast oral decoding.',
    badge: 'Weeks 8–12'
  }
];

// ============================================================================
// HELPER: WEB SPEECH API FRENCH PRONUNCIATION
// ============================================================================
function speakFrench(text, rate = 0.92) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    // Clean visual arrows or labels if present
    const cleanText = text
      .replace(/Écrit\s*:\s*/gi, '')
      .replace(/Oral\s*:\s*/gi, '')
      .replace(/→/g, ', ')
      .replace(/«|»/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice =
      voices.find((v) => v.lang === 'fr-FR' && v.name.toLowerCase().includes('natural')) ||
      voices.find((v) => v.lang === 'fr-FR' || v.lang === 'fr_FR') ||
      voices.find((v) => v.lang && v.lang.startsWith('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Persisted mastery state
  const [completedNodes, setCompletedNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('fr90_completed_nodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [nodeScores, setNodeScores] = useState(() => {
    try {
      const saved = localStorage.getItem('fr90_node_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedNodeId, setSelectedNodeId] = useState('phonetics-core');
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'flashcards' | 'quiz'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'tree' | 'arena'
  const [sandboxUnlocked, setSandboxUnlocked] = useState(true);
  const [panelPulse, setPanelPulse] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);

  const lessonPanelRef = useRef(null);

  // Lesson Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [hideEnglishInTable, setHideEnglishInTable] = useState(false);

  // Node Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Global Rapid-Fire Arena state
  const [arenaQuestions, setArenaQuestions] = useState([]);
  const [arenaIndex, setArenaIndex] = useState(0);
  const [arenaSelected, setArenaSelected] = useState(null);
  const [arenaScore, setArenaScore] = useState(0);
  const [arenaFinished, setArenaFinished] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('fr90_completed_nodes', JSON.stringify(completedNodes));
      localStorage.setItem('fr90_node_scores', JSON.stringify(nodeScores));
    } catch (e) {
      // Ignore storage quota errors
    }
  }, [completedNodes, nodeScores]);

  // Trigger audio with visual speaking state feedback
  const handleSpeak = (text) => {
    setSpeakingText(text);
    speakFrench(text);
    setTimeout(() => {
      setSpeakingText((prev) => (prev === text ? null : prev));
    }, 1800);
  };

  // Reset per-node interactive states when switching nodes & provide unmistakable visual feedback
  const selectNode = (id, tab = 'lesson') => {
    setSelectedNodeId(id);
    setActiveTab(tab);
    setCardIndex(0);
    setCardFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setViewMode('split');

    // Trigger unmistakable visual pulse on the lesson panel
    setPanelPulse(true);
    setTimeout(() => setPanelPulse(false), 750);

    // If on smaller viewport (<1024px where columns stack), open the dedicated modal OR smooth scroll
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileModalOpen(true);
    } else if (lessonPanelRef.current) {
      lessonPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const selectedNode = useMemo(
    () => SKILL_NODES.find((n) => n.id === selectedNodeId) || SKILL_NODES[0],
    [selectedNodeId]
  );

  // Check if a node's prerequisites are met (or if sandbox mode is enabled)
  const isNodeUnlocked = (node) => {
    if (sandboxUnlocked) return true;
    if (!node.prereqs || node.prereqs.length === 0) return true;
    return node.prereqs.every((p) => completedNodes.includes(p));
  };

  // XP & Rank calculations
  const totalXP = useMemo(() => {
    return completedNodes.reduce((acc, id) => {
      const node = SKILL_NODES.find((n) => n.id === id);
      return acc + (node ? node.xp : 0);
    }, 0);
  }, [completedNodes]);

  const maxXP = useMemo(() => SKILL_NODES.reduce((acc, n) => acc + n.xp, 0), []);
  const masteryPercent = Math.round((completedNodes.length / SKILL_NODES.length) * 100);

  const currentRank = useMemo(() => {
    const count = completedNodes.length;
    if (count === 0) return { code: 'A0', label: 'Novice Decoder', color: 'text-slate-400' };
    if (count <= 3) return { code: 'A1', label: 'Syntax Builder', color: 'text-sky-400' };
    if (count <= 7) return { code: 'A2', label: 'Narrative Operator', color: 'text-indigo-400' };
    if (count <= 10) return { code: 'B1-', label: 'Independent Speaker', color: 'text-purple-400' };
    return { code: 'B1 / SLE-B', label: '90-Day Proficient', color: 'text-emerald-400' };
  }, [completedNodes]);

  // Handle Quiz Submission for current node
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const total = selectedNode.quiz.length;
    let correct = 0;
    selectedNode.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct += 1;
    });
    const pct = Math.round((correct / total) * 100);

    setNodeScores((prev) => ({
      ...prev,
      [selectedNode.id]: Math.max(prev[selectedNode.id] || 0, pct)
    }));

    if (pct >= 75 && !completedNodes.includes(selectedNode.id)) {
      setCompletedNodes((prev) => [...prev, selectedNode.id]);
    }
  };

  const currentQuizStats = useMemo(() => {
    const total = selectedNode.quiz.length;
    let correct = 0;
    selectedNode.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct += 1;
    });
    const pct = Math.round((correct / total) * 100);
    return { correct, total, pct, passed: pct >= 75 };
  }, [selectedNode, quizAnswers]);

  // Start Global Rapid-Fire Quiz Arena
  const startArena = (onlyCompleted = false) => {
    const sourceNodes =
      onlyCompleted && completedNodes.length > 0
        ? SKILL_NODES.filter((n) => completedNodes.includes(n.id))
        : SKILL_NODES;

    const allQ = [];
    sourceNodes.forEach((node) => {
      node.quiz.forEach((q) => {
        allQ.push({
          ...q,
          nodeId: node.id,
          nodeTitle: node.title,
          cefr: node.cefr
        });
      });
    });

    // Shuffle and pick 10 questions
    const shuffled = [...allQ].sort(() => Math.random() - 0.5).slice(0, 10);
    setArenaQuestions(shuffled);
    setArenaIndex(0);
    setArenaSelected(null);
    setArenaScore(0);
    setArenaFinished(false);
    setViewMode('arena');
  };

  const handleArenaAnswer = (optionIdx) => {
    if (arenaSelected !== null) return;
    setArenaSelected(optionIdx);
    if (optionIdx === arenaQuestions[arenaIndex].correctIndex) {
      setArenaScore((s) => s + 1);
    }
  };

  const nextArenaQuestion = () => {
    if (arenaIndex + 1 < arenaQuestions.length) {
      setArenaIndex((i) => i + 1);
      setArenaSelected(null);
    } else {
      setArenaFinished(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* ===================================================================
          TOP COMMAND BAR: PROGRESS, XP, CEFR RANK & VIEW CONTROLS
      =================================================================== */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-lg tracking-tighter">
              FR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white">
                  90-Day French Skill Tree
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  CEFR B1 / SLE-B Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive Systems-Engineering Roadmap • Click any node to study & quiz
              </p>
            </div>
          </div>

          {/* Metrics & Gamified Status */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            {/* Progress Bar */}
            <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">Nodes Mastered</span>
                  <span className="font-semibold text-white">
                    {completedNodes.length}/{SKILL_NODES.length} ({masteryPercent}%)
                  </span>
                </div>
                <div className="w-28 sm:w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${masteryPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* XP Counter */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Zap className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <div className="text-slate-400">Total XP</div>
                <div className="font-bold text-amber-300">
                  {totalXP.toLocaleString()} <span className="text-slate-500 font-normal">/ {maxXP}</span>
                </div>
              </div>
            </div>

            {/* CEFR Rank Badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <div className="text-slate-400">Current Level</div>
                <div className={`font-bold ${currentRank.color}`}>
                  {currentRank.code} • {currentRank.label}
                </div>
              </div>
            </div>

            {/* View Switcher Buttons */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'split'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tree + Lesson</span>
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'tree'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Full Map</span>
              </button>
              <button
                onClick={() => startArena(false)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  viewMode === 'arena'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Rapid Drill</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          MAIN WORKSPACE: SPLIT VIEW, FULL TREE MAP, OR RAPID-FIRE ARENA
      =================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {viewMode === 'arena' ? (
          /* ===============================================================
             GLOBAL RAPID-FIRE QUIZ ARENA
          =============================================================== */
          <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">90-Day Rapid-Fire Fluency Drill</h2>
                  <p className="text-xs text-slate-400">
                    10 randomized syntax, phonetic & translation challenges across the skill tree
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewMode('split')}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800"
              >
                Back to Tree
              </button>
            </div>

            {arenaFinished ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Drill Complete: {arenaScore} / {arenaQuestions.length}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {arenaScore >= 8
                      ? 'Outstanding recall! Your B1 / SLE-B grammatical reflexes are locking in.'
                      : 'Solid reps! Review the explanations on missed nodes to sharpen your accuracy.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startArena(false)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New 10-Question Mix
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
                  >
                    Return to Skill Tree
                  </button>
                </div>
              </div>
            ) : arenaQuestions.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 font-medium">
                    Node: {arenaQuestions[arenaIndex].nodeTitle} ({arenaQuestions[arenaIndex].cefr})
                  </span>
                  <span>
                    Question <strong className="text-white">{arenaIndex + 1}</strong> of{' '}
                    {arenaQuestions.length} • Score: <strong className="text-emerald-400">{arenaScore}</strong>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {arenaQuestions[arenaIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {arenaQuestions[arenaIndex].options.map((opt, idx) => {
                    const isPicked = arenaSelected === idx;
                    const isRight = idx === arenaQuestions[arenaIndex].correctIndex;
                    let btnStyle =
                      'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-200';
                    if (arenaSelected !== null) {
                      if (isRight) {
                        btnStyle =
                          'border-emerald-500/60 bg-emerald-500/15 text-emerald-200 font-medium';
                      } else if (isPicked) {
                        btnStyle = 'border-rose-500/60 bg-rose-500/15 text-rose-200';
                      } else {
                        btnStyle = 'border-slate-800/50 bg-slate-950/30 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleArenaAnswer(idx)}
                        disabled={arenaSelected !== null}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 text-sm ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {arenaSelected !== null && isRight && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {arenaSelected !== null && isPicked && !isRight && (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {arenaSelected !== null && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
                    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      First-Principles Breakdown
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {arenaQuestions[arenaIndex].explanation}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={nextArenaQuestion}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <span>
                          {arenaIndex + 1 < arenaQuestions.length ? 'Next Question' : 'See Final Score'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          /* ===============================================================
             SKILL TREE + INTERACTIVE LESSON / QUIZ SPLIT WORKSPACE
          =============================================================== */
          <div
            className={`grid gap-6 items-start ${
              viewMode === 'tree' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
            }`}
          >
            {/* LEFT COLUMN: THE RPG SKILL TREE */}
            <div
              className={`${
                viewMode === 'tree' ? 'col-span-1' : 'lg:col-span-5 xl:col-span-5'
              } bg-slate-900/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>90-Day Curriculum Skill Tree</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any Tier or Node below to open its interactive lesson, audio & quiz
                  </p>
                </div>

                {/* Reset / Unlock Demo Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSandboxUnlocked((s) => !s)}
                    title="Toggle Sandbox Mode to freely inspect any node"
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
                      sandboxUnlocked
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {sandboxUnlocked ? 'All Nodes Open' : 'Strict Prereqs'}
                  </button>
                  {completedNodes.length > 0 && (
                    <button
                      onClick={() => {
                        setCompletedNodes([]);
                        setNodeScores({});
                      }}
                      title="Reset progress"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mb-5 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Mastered (Quiz ≥75%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
                  Active / Unlocked
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  Click Any Card for Lesson & Quiz
                </span>
              </div>

              {/* Tiers Iteration */}
              <div className="space-y-6 relative">
                {TIER_METADATA.map((tierInfo, tIdx) => {
                  const tierNodes = SKILL_NODES.filter((n) => n.tier === tierInfo.tier);
                  const isTierSelected = tierNodes.some((n) => n.id === selectedNodeId);
                  return (
                    <div key={tierInfo.tier} className="relative">
                      {/* Vertical connector between tiers */}
                      {tIdx > 0 && (
                        <div className="flex justify-center -mt-4 mb-2">
                          <div className="w-0.5 h-5 bg-gradient-to-b from-indigo-500/50 to-emerald-500/50" />
                        </div>
                      )}

                      <div
                        className={`rounded-xl bg-slate-950/80 border p-3.5 transition-all ${
                          isTierSelected
                            ? 'border-indigo-500/60 shadow-md shadow-indigo-500/10'
                            : 'border-slate-800/80'
                        }`}
                      >
                        {/* Clickable Tier Header so clicking "Tier 0 • Root Decoding" directly opens the first node in that tier */}
                        <div
                          onClick={() => selectNode(tierNodes[0].id, 'lesson')}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              selectNode(tierNodes[0].id, 'lesson');
                            }
                          }}
                          className="flex items-center justify-between gap-2 mb-3 cursor-pointer group/tier hover:bg-slate-900/80 -mx-2 -mt-1.5 px-2 py-1.5 rounded-lg transition"
                        >
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 group-hover/tier:text-indigo-300 flex items-center gap-1.5">
                              <span>{tierInfo.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-75 group-hover/tier:translate-x-0.5 transition-transform" />
                            </span>
                            <p className="text-[11px] text-slate-400">{tierInfo.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 shrink-0 group-hover/tier:border-indigo-500/40">
                            {tierInfo.badge}
                          </span>
                        </div>

                        <div
                          className={`grid gap-2.5 ${
                            tierNodes.length === 1
                              ? 'grid-cols-1'
                              : viewMode === 'tree'
                              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                              : 'grid-cols-1 sm:grid-cols-2'
                          }`}
                        >
                          {tierNodes.map((node) => {
                            const isCompleted = completedNodes.includes(node.id);
                            const isUnlocked = isNodeUnlocked(node);
                            const isSelected = selectedNodeId === node.id;
                            const bestScore = nodeScores[node.id];

                            let cardClass =
                              'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';
                            if (isCompleted) {
                              cardClass =
                                'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400 text-emerald-100';
                            } else if (isUnlocked) {
                              cardClass =
                                'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400 text-slate-100';
                            }

                            if (isSelected) {
                              cardClass +=
                                ' ring-2 ring-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20';
                            }

                            return (
                              <div
                                key={node.id}
                                onClick={() => selectNode(node.id, 'lesson')}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    selectNode(node.id, 'lesson');
                                  }
                                }}
                                className={`group cursor-pointer text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${cardClass}`}
                              >
                                <div className="flex items-start justify-between gap-2 w-full">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                        isCompleted
                                          ? 'bg-emerald-500 text-slate-950'
                                          : isUnlocked
                                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                          : 'bg-slate-800 text-slate-500'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      ) : isUnlocked ? (
                                        <Sparkles className="w-3.5 h-3.5" />
                                      ) : (
                                        <Lock className="w-3 h-3" />
                                      )}
                                    </div>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                      {node.weeks}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {isSelected && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white animate-pulse">
                                        ACTIVE
                                      </span>
                                    )}
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-950/90 text-amber-300 border border-slate-800">
                                      +{node.xp} XP
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <div className="font-bold text-xs sm:text-sm leading-snug group-hover:text-white transition">
                                    {node.title}
                                  </div>
                                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                                    {node.subtitle}
                                  </div>
                                </div>

                                {/* Explicit Interactive Action Bar inside every Node Card */}
                                <div className="flex items-center justify-between gap-1.5 w-full pt-2 border-t border-slate-800/80 text-[11px]">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectNode(node.id, 'lesson');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600/25 hover:bg-indigo-600 text-indigo-200 hover:text-white font-semibold transition flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Lesson</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectNode(node.id, 'quiz');
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold transition flex items-center gap-1"
                                  >
                                    <Award className="w-3 h-3" />
                                    <span>
                                      {bestScore !== undefined ? `Quiz (${bestScore}%)` : 'Take Quiz'}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE NODE LESSON, FLASHCARDS & QUIZ */}
            {viewMode === 'split' && (
              <div
                ref={lessonPanelRef}
                className={`lg:col-span-7 xl:col-span-7 bg-slate-900/80 border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                  panelPulse
                    ? 'border-indigo-400 ring-4 ring-indigo-500/30 scale-[1.005]'
                    : 'border-slate-800'
                }`}
              >
                {/* Node Header Banner */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {selectedNode.weeks}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {selectedNode.studyTime}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {selectedNode.xp} XP
                      </span>
                    </div>

                    {completedNodes.includes(selectedNode.id) ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Node Mastered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
                        Pass Quiz (75%+) to Complete
                      </span>
                    )}
                  </div>

                  {/* Quick Node Switcher Pill Bar so user can also jump between nodes inside the Lesson header */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 mb-2 no-scrollbar">
                    {SKILL_NODES.map((n, idx) => (
                      <button
                        key={n.id}
                        onClick={() => selectNode(n.id, activeTab)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition ${
                          n.id === selectedNode.id
                            ? 'bg-indigo-600 text-white shadow'
                            : completedNodes.includes(n.id)
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50'
                            : 'bg-slate-800/90 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {idx + 1}. {n.title.split(':')[0].slice(0, 18)}
                      </button>
                    ))}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedNode.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
                    {selectedNode.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {selectedNode.summary}
                  </p>

                  {/* Mode Sub-Navigation Tabs (1. Lesson -> 2. Flashcards -> 3. Mastery Quiz) */}
                  <div className="grid grid-cols-3 gap-2 mt-5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setActiveTab('lesson')}
                      className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                        activeTab === 'lesson'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>1. Core Lesson</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('flashcards')}
                      className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                        activeTab === 'flashcards'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Brain className="w-4 h-4" />
                      <span>2. Recall Cards ({selectedNode.flashcards.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 ${
                        activeTab === 'quiz'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>3. Node Quiz ({selectedNode.quiz.length})</span>
                    </button>
                  </div>
                </div>

                {/* ===========================================================
                    TAB 1: CORE LESSON & INTERACTIVE AUDIO PATTERNS
                =========================================================== */}
                {activeTab === 'lesson' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* First-Principles Mental Models */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        First-Principles Mental Model
                      </h3>
                      <div className="grid gap-3">
                        {selectedNode.mentalModel.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1.5"
                          >
                            <div className="font-bold text-sm text-white">{item.heading}</div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {item.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* High-Yield Pro Tip Box */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                        <strong className="text-amber-300 font-semibold block mb-0.5">
                          90-Day Accelerator Hack:
                        </strong>
                        {selectedNode.proTip}
                      </div>
                    </div>

                    {/* Interactive Pattern & Audio Reference Table */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Interactive Sound & Syntax Matrix (Click Speaker for French Audio)
                        </h3>
                        <button
                          onClick={() => setHideEnglishInTable((h) => !h)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition"
                        >
                          {hideEnglishInTable ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-indigo-400" />
                              Show English
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                              Hide English to Test Self
                            </>
                          )}
                        </button>
                      </div>

                      <div className="divide-y divide-slate-800/80 rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden">
                        {selectedNode.patterns.map((row, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSpeak(row.french)}
                            className="p-3.5 sm:p-4 hover:bg-slate-900/60 cursor-pointer transition flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1 flex-1">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                                {row.category}
                              </span>
                              <div className="font-bold text-sm sm:text-base text-white pt-0.5">
                                {row.french}
                              </div>
                              <div className="text-xs font-mono text-emerald-400/90">
                                [{row.phonetic}]
                              </div>
                              <div
                                className={`text-xs sm:text-sm text-slate-400 pt-0.5 transition ${
                                  hideEnglishInTable ? 'blur-sm select-none hover:blur-none' : ''
                                }`}
                              >
                                {row.english}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(row.french);
                              }}
                              title="Listen in French"
                              className={`px-3 py-2 rounded-xl border transition shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                                speakingText === row.french
                                  ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                                  : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/30'
                              }`}
                            >
                              <Volume2 className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {speakingText === row.french ? 'Playing...' : 'Listen'}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action to Move to Warmup Cards or Quiz */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                      <button
                        onClick={() => setActiveTab('flashcards')}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
                      >
                        <Brain className="w-4 h-4 text-indigo-400" />
                        <span>Practice Recall Flashcards</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                      >
                        <span>Take Node Mastery Quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ===========================================================
                    TAB 2: ACTIVE RECALL FLASHCARDS WARMUP
                =========================================================== */}
                {activeTab === 'flashcards' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Active Recall Sentence Warmup
                        </h3>
                        <p className="text-xs text-slate-400">
                          Say the French aloud before flipping the card, then verify with audio.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300">
                        Card {cardIndex + 1} of {selectedNode.flashcards.length}
                      </span>
                    </div>

                    {/* Interactive Flip Card */}
                    <div
                      onClick={() => setCardFlipped((f) => !f)}
                      className="cursor-pointer select-none rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/30 p-8 sm:p-10 text-center space-y-4 shadow-inner transition hover:border-indigo-400/60"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
                        {cardFlipped ? 'French Target Sentence' : 'Translate / Recall in French'}
                      </div>

                      <div className="text-lg sm:text-2xl font-bold text-white leading-snug">
                        {cardFlipped
                          ? selectedNode.flashcards[cardIndex].fr
                          : selectedNode.flashcards[cardIndex].en}
                      </div>

                      <div className="text-xs text-slate-400">
                        Hint: <span className="text-amber-300">{selectedNode.flashcards[cardIndex].hint}</span>
                      </div>

                      {cardFlipped && (
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(selectedNode.flashcards[cardIndex].fr);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow"
                          >
                            <Volume2 className="w-4 h-4" />
                            Listen to Pronunciation
                          </button>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 pt-2">
                        Click card to flip ({cardFlipped ? 'Showing French' : 'Showing English'})
                      </div>
                    </div>

                    {/* Card Controls */}
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => {
                          setCardFlipped(false);
                          setCardIndex((i) =>
                            i === 0 ? selectedNode.flashcards.length - 1 : i - 1
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Previous Card
                      </button>

                      <button
                        onClick={() => setCardFlipped((f) => !f)}
                        className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30"
                      >
                        Flip Card
                      </button>

                      <button
                        onClick={() => {
                          setCardFlipped(false);
                          setCardIndex((i) => (i + 1) % selectedNode.flashcards.length);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Next Card
                      </button>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
                      >
                        <span>Ready for Node Quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ===========================================================
                    TAB 3: NODE MASTERY QUIZ (UNLOCKS NEXT NODES & XP)
                =========================================================== */}
                {activeTab === 'quiz' && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Quiz Results Banner if Submitted */}
                    {quizSubmitted && (
                      <div
                        className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
                          currentQuizStats.passed
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
                            : 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              currentQuizStats.passed
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {currentQuizStats.pct}%
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white">
                              {currentQuizStats.passed
                                ? `Node Mastered! (+${selectedNode.xp} XP Unlocked)`
                                : 'Almost There! (75% Required to Master Node)'}
                            </h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              You scored {currentQuizStats.correct} out of {currentQuizStats.total}. Review the grammatical explanations below.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700"
                          >
                            Retry Quiz
                          </button>
                          {currentQuizStats.passed && (
                            <button
                              onClick={() => {
                                const idx = SKILL_NODES.findIndex((n) => n.id === selectedNode.id);
                                if (idx + 1 < SKILL_NODES.length) {
                                  selectNode(SKILL_NODES[idx + 1].id, 'lesson');
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                            >
                              <span>Next Node</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-5">
                      {selectedNode.quiz.map((q, qIdx) => {
                        const picked = quizAnswers[qIdx];
                        return (
                          <div
                            key={q.id}
                            className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                Question {qIdx + 1} of {selectedNode.quiz.length}
                              </span>
                              {quizSubmitted && (
                                <span
                                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    picked === q.correctIndex
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-rose-500/20 text-rose-300'
                                  }`}
                                >
                                  {picked === q.correctIndex ? 'Correct' : 'Needs Review'}
                                </span>
                              )}
                            </div>

                            <div className="font-semibold text-sm sm:text-base text-white">
                              {q.question}
                            </div>

                            <div className="grid gap-2 pt-1">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = picked === oIdx;
                                const isCorrect = q.correctIndex === oIdx;

                                let optionClass =
                                  'border-slate-800 bg-slate-900/70 hover:border-slate-700 text-slate-200';
                                if (!quizSubmitted && isSelected) {
                                  optionClass =
                                    'border-indigo-500 bg-indigo-500/20 text-white font-medium';
                                } else if (quizSubmitted) {
                                  if (isCorrect) {
                                    optionClass =
                                      'border-emerald-500/70 bg-emerald-500/15 text-emerald-200 font-medium';
                                  } else if (isSelected && !isCorrect) {
                                    optionClass =
                                      'border-rose-500/70 bg-rose-500/15 text-rose-200';
                                  } else {
                                    optionClass =
                                      'border-slate-800/50 bg-slate-950/40 text-slate-500';
                                  }
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    disabled={quizSubmitted}
                                    onClick={() =>
                                      setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                    }
                                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionClass}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    )}
                                    {quizSubmitted && isSelected && !isCorrect && (
                                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                                <strong className="text-indigo-300">Why: </strong>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit Quiz Button */}
                    {!quizSubmitted && (
                      <div className="pt-2 flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-400">
                          Answered {Object.keys(quizAnswers).length} of {selectedNode.quiz.length} questions
                        </span>
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < selectedNode.quiz.length}
                          className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                            Object.keys(quizAnswers).length === selectedNode.quiz.length
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit Answers & Verify Mastery</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================================
            MOBILE / COMPACT SCREEN LESSON DRAWER OVERLAY
            Ensures clicking Tier 0 or any node on smaller screens pops open
            the lesson immediately instead of requiring manual scrolling!
        ================================================================= */}
        {mobileModalOpen && viewMode === 'split' && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto shadow-2xl flex flex-col">
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {selectedNode.weeks}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                    {selectedNode.title}
                  </span>
                </div>
                <button
                  onClick={() => setMobileModalOpen(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold ${
                      activeTab === 'lesson' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    1. Lesson
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold ${
                      activeTab === 'flashcards' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    2. Cards
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold ${
                      activeTab === 'quiz' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    3. Quiz
                  </button>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  {selectedNode.summary}
                </p>

                <button
                  onClick={() => {
                    setMobileModalOpen(false);
                    if (lessonPanelRef.current) {
                      lessonPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                >
                  <span>View Full Interactive Studio Below</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}