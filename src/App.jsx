import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, CheckCircle2, Lock, Unlock, Sparkles, BookOpen, Brain,
  Zap, RotateCcw, ChevronRight, Award, Flame, Globe, Check, X, HelpCircle
} from 'lucide-react';

const SKILL_NODES = [
  {
    id: 'tier0-phonetics',
    tier: 0,
    week: { en: 'Week 1 • Days 1–5', zh: '第1周 • 第1–5天' },
    title: { en: 'Phonetics & Sound Decoding', zh: '语音与拼读解码 (Phonetics)' },
    subtitle: { en: 'Silent Finals, CaReFuL Rule, Nasal Vowels & Liaisons', zh: '词尾不发音规则、CaReFuL法则、鼻化元音与联诵' },
    prereqs: [],
    summary: {
      en: 'French spelling is highly deterministic: once you learn 4 decoding rules, you can pronounce 95% of French words on sight without guessing.',
      zh: '法语拼读具有高度确定性（见词能读）：掌握4条核心解码法则后，无需查音标即可准确读出95%的法语单词。'
    },
    rules: {
      en: [
        'Silent Finals & CaReFuL Rule: Most final consonants (-s, -t, -d, -x, -p, -z) are silent, EXCEPT C, R, F, L (CaReFuL: parc, hiver, chef, hôtel).',
        'The -ENT Verb Trap: On 3rd-person plural verbs (ils parlent), "-ent" is 100% SILENT. "Je parle, tu parles, il parle, ils parlent" sound completely identical: [parl].',
        'Nasal Vowels: Vowel + n/m before a consonant nasalizes into 3 core sounds: AN/EN [ɑ̃], IN/AIN/UN [ɛ̃], ON [ɔ̃]. Do not touch your tongue to the roof of your mouth.',
        'Liaisons: A normally silent final consonant (-s, -x, -z, -t, -n) links onto the next word if it starts with a vowel (les amis -> [lez-ami]).'
      ],
      zh: [
        '词尾辅音与 CaReFuL 法则：绝大多数词尾辅音（-s, -t, -d, -x, -p, -z）完全不发音；唯一例外是 C, R, F, L 四个字母（记忆口诀 CaReFuL：如 parc, hiver, chef, hôtel 词尾需发音）。',
        '动词词尾 -ENT 陷阱：第三人称复数动词词尾的“-ent”（如 ils parlent）100%不发音！因此 Je parle, tu parles, il parle, ils parlent 四个词读音完全一致，均读作 [parl]。',
        '鼻化元音 (Nasal Vowels)：元音后接 n/m（且后面不再跟元音）时发鼻音，舌尖绝不能抵住上齿龈（不同于中文的 an/ang）：核心三音为 AN/EN [ɑ̃]、IN/AIN [ɛ̃]、ON [ɔ̃]。',
        '联诵 (Liaison)：原本不发音的词尾辅音（-s, -x, -z, -t, -n），遇到以元音开头的下个词时必须连读（如 les amis 读作 [lez-ami]，s 浊化为 [z]）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Silent Finals', zh: '词尾辅音不发音' },
        french: 'Le chat est grand et gros.',
        phonetic: 'luh shah eh grahn eh groh',
        meaning: { en: 'The cat is big and fat. (Final t, st, d, t, s are silent)', zh: '这只猫又大又胖。（词尾的 t, st, d, t, s 全部静音）' }
      },
      {
        category: { en: 'CaReFuL Rule', zh: 'CaReFuL 例外发音' },
        french: 'Avec mon chef à l’hôtel.',
        phonetic: 'ah-vek mohn shef ah loh-tel',
        meaning: { en: 'With my boss at the hotel. (Final C, F, L are pronounced)', zh: '和我的主管在酒店。（词尾 C, F, L 需要清晰发音）' }
      },
      {
        category: { en: 'Mandatory Liaison', zh: '强制联诵 (Liaison)' },
        french: 'Vous avez deux enfants.',
        phonetic: 'voo-zah-vay duh-zahn-fahn',
        meaning: { en: 'You have two children. (s and x link as a [z] sound)', zh: '您有两个孩子。（词尾 s 和 x 与后方元音连读发 [z] 音）' }
      },
      {
        category: { en: 'Silent -ENT Verb Ending', zh: '动词 -ENT 静音规则' },
        french: 'Ils parlent et ils mangent.',
        phonetic: 'eel parl eh eel mahnzh',
        meaning: { en: 'They speak and they eat. (-ent on verbs is ALWAYS silent)', zh: '他们说话，他们吃饭。（动词复数词尾 -ent 永远不发音）' }
      }
    ],
    flashcards: [
      { fr: 'Beaucoup de temps', en: 'A lot of time (-p and -ps are silent)', zh: '很多时间（词尾 -p 和 -ps 均不发音）', hint: 'boh-koo duh tahn' },
      { fr: 'Les autres idées', en: 'The other ideas (liaison: lez-oh-truh-zee-day)', zh: '其他的想法（双重联诵：lez-oh-truh-zee-day）', hint: 'Double liaison with -s' },
      { fr: 'Ils travaillent tard', en: 'They work late (-ent and -d are silent)', zh: '他们工作到很晚（-ent 和 -d 均不发音）', hint: 'eel trah-vahy tar' },
      { fr: 'C’est un bon vin blanc', en: 'It is a good white wine', zh: '这是一款好白葡萄酒（包含三个核心鼻化元音）', hint: 'seh-tuhn bohn vahn blahn' }
    ],
    quiz: [
      {
        id: 'q1',
        question: {
          en: 'According to the "CaReFuL" rule, in which word is the final consonant PRONOUNCED?',
          zh: '根据“CaReFuL”法则，下列哪个单词的词尾辅音是需要发音的？'
        },
        options: ['Beaucoup', 'Toujours', 'Hiver', 'Grand'],
        correctIndex: 2,
        explanation: {
          en: '"Hiver" (winter) ends in R, one of the CaReFuL letters (pronounced ee-vair). The p, s, and d in the other words are silent.',
          zh: '“Hiver”（冬天）以 R 结尾，属于 CaReFuL 四个发音辅音之一（读作 ee-vair）。其余三个词的词尾 p, s, d 均不发音。'
        }
      },
      {
        id: 'q2',
        question: {
          en: 'How do native speakers pronounce "je parle", "tu parles", and "ils parlent"?',
          zh: '母语者如何发音“je parle”、“tu parles”和“ils parlent”这三个动词形式？'
        },
        options: [
          { en: 'All three verb forms sound completely identical ([parl])', zh: '三个词的动词部分发音完全相同，都读作 [parl]' },
          { en: '"Ils parlent" pronounces "-ent" like in English "went"', zh: '“Ils parlent”需要把词尾 -ent 读出来' },
          { en: '"Tu parles" pronounces the final -s', zh: '“Tu parles”需要读出词尾的 -s' },
          { en: 'Each one has a different vowel sound', zh: '每一个词的元音发音都不同' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'Final -e, -es, and the 3rd-person plural verb ending -ent are ALL completely silent! They all sound like [parl].',
          zh: '法语第一组动词词尾 -e、-es 以及第三人称复数词尾 -ent 全部静音！四个变位听起来完全一样，全靠主语人称代词区分。'
        }
      },
      {
        id: 'q3',
        question: {
          en: 'How is "les amis" pronounced in natural French?',
          zh: '“les amis”（朋友们）在自然法语中如何连读？'
        },
        options: ['[lay ah-mee]', '[lez-ah-mee]', '[les-ah-mees]', '[luh-ah-mee]'],
        correctIndex: 1,
        explanation: {
          en: 'Because "amis" starts with a vowel, the silent -s on "les" triggers a mandatory liaison and sounds like a [z]: [lez-ah-mee].',
          zh: '因为“amis”以元音开头，前面“les”原本不发音的词尾 -s 触发强制联诵并浊化成 [z] 音，读作 [lez-ah-mee]。'
        }
      }
    ]
  },
  {
    id: 'tier1-big4',
    tier: 1,
    week: { en: 'Weeks 1–2', zh: '第1–2周' },
    title: { en: 'The Big 4 Verb Engines', zh: '四大核心动词引擎 (Être, Avoir, Aller, Faire)' },
    subtitle: { en: 'Present Tense & Idiomatic Expressions with Avoir/Faire', zh: '现在时变位及 Avoir/Faire 高频惯用表达' },
    prereqs: ['tier0-phonetics'],
    summary: {
      en: 'Être (to be), Avoir (to have), Aller (to go), and Faire (to do/make) power over 60% of spoken French and form the auxiliaries for past and future tenses.',
      zh: 'Être（是）、Avoir（有）、Aller（去）、Faire（做）构成了日常法语60%以上的造句骨架，同时也是复合过去时和最近将来时的助动词。'
    },
    rules: {
      en: [
        'Être (to be): je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.',
        'Avoir (to have): j’ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont. Used for age and physical states: J’ai 25 ans (I am 25), J’ai faim (I am hungry), J’ai besoin de (I need).',
        'Aller (to go): je vais, tu vas, il/elle/on va, nous allons, vous allez, ils/elles vont.',
        'Faire (to do/make): je fais, tu fais, il/elle/on fait, nous faisons, vous faites, ils/elles font. Used for weather and sports: Il fait froid (It is cold).'
      ],
      zh: [
        'Être (是)：je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont。（口语中常用 on 代替 nous 表示“我们”）。',
        'Avoir (有)：j’ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont。注意：法语用“我有…”表示年龄和生理感觉：J’ai 25 ans（我25岁）、J’ai faim/froid（我饿了/冷）、J’ai besoin de（我需要）。',
        'Aller (去)：je vais, tu vas, il/elle/on va, nous allons, vous allez, ils/elles vont。',
        'Faire (做/制造)：je fais, tu fais, il/elle/on fait, nous faisons, vous faites, ils/elles font。用于天气和运动：Il fait froid（天气冷）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Avoir State Trap', zh: 'Avoir 表示生理状态/年龄' },
        french: 'J’ai faim et j’ai besoin d’un café.',
        phonetic: 'zhay fahn eh zhay buh-zwahn duhn kah-fay',
        meaning: { en: 'I am hungry and I need a coffee. (Literally: I have hunger)', zh: '我饿了，而且我需要一杯咖啡。（法语忌用 Je suis faim，必须用 J’ai faim）' }
      },
      {
        category: { en: 'Spoken "On" Shortcut', zh: '口语万能代词 On (= Nous)' },
        french: 'On est prêts, on va au bureau.',
        phonetic: 'ohn eh preh, ohn vah oh boo-roh',
        meaning: { en: 'We are ready, we are going to the office. ("On" uses 3rd-person singular verb!)', zh: '我们准备好了，我们去办公室。（口语中90%用 On 代替 Nous，动词直接用单数变位！）' }
      },
      {
        category: { en: 'Faire Expressions', zh: 'Faire 高频短语' },
        french: 'Il fait beau, alors je fais du sport.',
        phonetic: 'eel feh boh, ah-lor zhuh feh doo spor',
        meaning: { en: 'The weather is nice, so I am playing sports.', zh: '天气很好，所以我做运动。' }
      }
    ],
    flashcards: [
      { fr: 'J’ai vingt-cinq ans', en: 'I am 25 years old (Uses avoir, never être)', zh: '我25岁（必须用动词 avoir“有”，不可用 être）', hint: 'zhay vahn-sank ahn' },
      { fr: 'On va voir', en: 'We will see / Let’s see', zh: '我们走着瞧 / 看看吧（On va + 动词原形）', hint: 'ohn vah vwar' },
      { fr: 'Vous faites quoi ?', en: 'What are you doing?', zh: '你们在做什么？（注意 vous faites 是不规则变位）', hint: 'voo fet kwah' },
      { fr: 'Ils ont raison', en: 'They are right (Literally: They have reason)', zh: '他们是对的（avoir raison = 有道理/正确）', hint: 'eel-zohn reh-zohn' }
    ],
    quiz: [
      {
        id: 'b1',
        question: {
          en: 'How do you correctly say "I am hungry and I am 24 years old" in French?',
          zh: '用法语正确表达“我饿了，而且我24岁”应该怎么说？'
        },
        options: [
          'Je suis faim et je suis 24 ans.',
          'J’ai faim et j’ai 24 ans.',
          'Je fais faim et j’ai 24 ans.',
          'J’ai faim et je suis 24 ans.'
        ],
        correctIndex: 1,
        explanation: {
          en: 'French uses AVOIR (to have) for age, hunger, thirst, heat, cold, fear, and being right/wrong: J’ai faim, j’ai 24 ans.',
          zh: '法语使用 AVOIR（有）来表达年龄、饥饿、口渴、冷热、害怕以及对错：J’ai faim（我有饥饿）、j’ai 24 ans（我有24年）。'
        }
      },
      {
        id: 'b2',
        question: {
          en: 'In everyday spoken French, how do native speakers usually say "We are going to work"?',
          zh: '在日常口语中，母语者最常怎么说“我们要去工作了”？'
        },
        options: [
          'On va travailler.',
          'On allons travailler.',
          'Nous va travailler.',
          'Ils vont travailler.'
        ],
        correctIndex: 0,
        explanation: {
          en: '"On" replaces "nous" in 90%+ of casual spoken French, and it always takes the 3rd-person singular verb form (il/elle/on va).',
          zh: '口语中90%以上用“On”代替“Nous”表示“我们”，且动词只需使用简单的第三人称单数变位（on va）。'
        }
      },
      {
        id: 'b3',
        question: {
          en: 'Notice the liaison difference: which sentence means "They ARE" vs "They HAVE"?',
          zh: '注意联诵发音区别：哪组分别代表“他们是”与“他们有”？'
        },
        options: [
          'Ils sont [eel-sohn] = They are | Ils ont [eel-zohn] = They have',
          'Ils ont [eel-zohn] = They are | Ils sont [eel-sohn] = They have',
          'Both sound identical in French',
          'Ils font = They are | Ils vont = They have'
        ],
        correctIndex: 0,
        explanation: {
          en: '"Ils sont" starts with an unvoiced [s] sound (They are). "Ils ont" triggers a liaison with -s before a vowel, producing a buzzed [z] sound [eel-zohn] (They have).',
          zh: '“Ils sont”读作清辅音 [eel-sohn]（他们是）；而“Ils ont”因为 ont 以元音开头，前面的 s 联诵浊化为 [z]，读作 [eel-zohn]（他们有）。'
        }
      }
    ]
  },
  {
    id: 'tier1-modals',
    tier: 1,
    week: { en: 'Weeks 2–3', zh: '第2–3周' },
    title: { en: 'Modal Hack & Infinitive Shortcuts', zh: '情态动词与“双动词”万能公式' },
    subtitle: { en: 'Pouvoir, Vouloir, Devoir + Futur Proche & Passé Récent', zh: '能/想/必须 + 最近将来时与最近过去时' },
    prereqs: ['tier1-big4'],
    summary: {
      en: 'Just like Mandarin (我想吃 / 我要去吃), French lets you conjugate ONE modal or movement verb and attach ANY raw infinitive verb right after it.',
      zh: '与中文语序高度一致（“我想去”、“我必须做”）：只需变位第一个情态动词，后面直接挂载任何动词原形（Infinitive），即可瞬间表达将来、过去和意愿。'
    },
    rules: {
      en: [
        'Vouloir (to want): je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.',
        'Pouvoir (can / to be able to): je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent.',
        'Devoir (must / have to): je dois, tu dois, il doit, nous devons, vous devez, ils doivent.',
        'Time Travel Hack: Aller + Infinitive = Near Future (Je vais partir = I am going to leave). Venir de + Infinitive = Recent Past (Je viens de finir = I just finished).'
      ],
      zh: [
        'Vouloir (想要)：je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent。（礼貌形式：Je voudrais = 我想要…）',
        'Pouvoir (能够/可以)：je peux, tu peux, il peut, nous pouvons, vous pouvez, ils peuvent。',
        'Devoir (必须/应该)：je dois, tu dois, il doit, nous devons, vous devez, ils doivent。',
        '时空穿梭捷径：Aller + 动词原形 = 最近将来时（Je vais partir = 我正要离开）；Venir de + 动词原形 = 最近过去时（Je viens de finir = 我刚刚完成）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Modal + Infinitive', zh: '情态动词 + 动词原形' },
        french: 'Je dois finir ce projet ce soir.',
        phonetic: 'zhuh dwah fee-neer suh pro-zheh suh swar',
        meaning: { en: 'I must finish this project tonight.', zh: '我今晚必须完成这个项目。（dois 变位 + finir 保持原形）' }
      },
      {
        category: { en: 'Futur Proche (Near Future)', zh: '最近将来时 (Aller + 原形)' },
        french: 'On va manger au restaurant demain.',
        phonetic: 'ohn vah mahn-zhay oh res-toh-rahn duh-mahn',
        meaning: { en: 'We are going to eat at the restaurant tomorrow.', zh: '我们明天要去餐厅吃饭。（无需学复杂将来时，直接用 va + 原形）' }
      },
      {
        category: { en: 'Passé Récent (Recent Past)', zh: '最近过去时 (Venir de + 原形)' },
        french: 'Je viens d’arriver à la gare.',
        phonetic: 'zhuh vyahn dah-ree-vay ah lah gar',
        meaning: { en: 'I just arrived at the train station.', zh: '我刚刚到达火车站。（venir de + 原形 = 刚刚做完某事）' }
      }
    ],
    flashcards: [
      { fr: 'Je peux vous aider ?', en: 'Can I help you?', zh: '我可以帮您吗？', hint: 'zhuh puh voo-zay-day' },
      { fr: 'On doit partir maintenant', en: 'We have to leave now', zh: '我们现在必须走了', hint: 'ohn dwah par-teer mahn-tuh-nahn' },
      { fr: 'Il vient de partir', en: 'He just left', zh: '他刚刚离开（Venir de + 原形）', hint: 'eel vyahn duh par-teer' },
      { fr: 'Je vais vous expliquer', en: 'I am going to explain to you', zh: '我来给您解释一下', hint: 'zhuh vay voo-zeks-plee-kay' }
    ],
    quiz: [
      {
        id: 'm1',
        question: {
          en: 'How do you say "I just finished the report" using the Recent Past shortcut?',
          zh: '如何使用“最近过去时”捷径表达“我刚刚写完报告”？'
        },
        options: [
          'Je vais finir le rapport.',
          'Je viens de finir le rapport.',
          'Je dois finir le rapport.',
          'Je veux finir le rapport.'
        ],
        correctIndex: 1,
        explanation: {
          en: '"Venir de + infinitive" expresses an action that just happened ("I just finished"). "Aller + infinitive" is for the near future.',
          zh: '“Venir de + 动词原形”专门表示“刚刚做完某事”（Je viens de finir）。而“Je vais finir”表示“我即将完成”。'
        }
      },
      {
        id: 'm2',
        question: {
          en: 'When two verbs follow each other directly (e.g., "I want to speak"), how is the second verb formatted?',
          zh: '当两个动词连用时（例如“我想说”），第二个动词该如何处理？'
        },
        options: [
          { en: 'It stays in the raw infinitive form (Je veux parler)', zh: '保持不变化的动词原形（Je veux parler）' },
          { en: 'Both verbs must be conjugated (Je veux parle)', zh: '两个动词都必须变位（Je veux parle）' },
          { en: 'Add "de" between every modal verb', zh: '必须在中间加上介词 de' },
          { en: 'Put the second verb in the past participle', zh: '第二个动词变成过去分词' }
        ],
        correctIndex: 0,
        explanation: {
          en: 'Rule of Two Verbs: When verb 1 is conjugated, verb 2 remains in the unconjugated infinitive: Je veux parler, tu peux venir, on va voir.',
          zh: '法语双动词铁律：第一个动词变位后，紧跟其后的第二个动词必须保持原形（Infinitive）：Je veux parler, tu peux venir。'
        }
      }
    ]
  },
  {
    id: 'tier1-negation',
    tier: 1,
    week: { en: 'Week 3', zh: '第3周' },
    title: { en: 'Negation Sandwich & Question Frames', zh: '否定三明治结构与三大提问公式' },
    subtitle: { en: 'Ne...pas/jamais/plus & Est-ce que / Spoken Intonation', zh: 'Ne...pas/jamais/plus 及 Est-ce que 万能疑问句' },
    prereqs: ['tier1-modals'],
    summary: {
      en: 'Wrap ne...pas around the conjugated verb to negate any sentence, and add "Est-ce que" to the front of any statement to turn it into a question without changing word order.',
      zh: '用 ne...pas 夹住已变位的动词即可否定任何句子；在陈述句句首直接加上“Est-ce que”即可将其变成疑问句，完全无需颠倒语序！'
    },
    rules: {
      en: [
        'The Negation Sandwich: Place "ne" before the conjugated verb and "pas" (not), "jamais" (never), or "plus" (no longer) after it: Je ne parle pas. (In casual speech, "ne" is often dropped: Je parle pas).',
        'Dual-Verb Negation: With modals or near future, the sandwich wraps ONLY the first conjugated verb: Je ne vais pas partir (I am not going to leave).',
        'The "Est-ce que" Question Hack: Never invert word order under pressure. Just put "Est-ce que" [es-kuh] at the start of any statement: Est-ce que tu comprends ? Or put a question word before it: Où est-ce que tu vas ?'
      ],
      zh: [
        '否定三明治结构：把“ne”放在变位动词前，把“pas”（不）、“jamais”（从不）或“plus”（不再）放在变位动词后：Je ne parle pas。（日常口语中常省略 ne，直接说 Je parle pas）。',
        '双动词否定位置：当句中有情态动词或助动词时，ne...pas 只夹住第一个变位动词：Je ne vais pas partir（我不打算离开）。',
        '“Est-ce que”提问外挂：口语中无需费脑做主谓倒装！在任何陈述句前加上“Est-ce que”[es-kuh] 即可提问：Est-ce que tu comprends ? 特殊疑问词直接放最前：Où est-ce que tu vas ?（你去哪儿？）'
      ]
    },
    patterns: [
      {
        category: { en: 'Standard vs Spoken Negation', zh: '书面否定 vs 口语省略 ne' },
        french: 'Je ne sais pas. → Je sais pas.',
        phonetic: 'zhuh nuh say pah → zhuh say pah (chais pas)',
        meaning: { en: 'I don’t know. (Spoken French drops "ne" ~85% of the time)', zh: '我不知道。（母语者日常口语中85%以上会吞掉 ne，甚至缩读成 chais pas）' }
      },
      {
        category: { en: 'No Longer / Never', zh: '不再 (ne...plus) 与 从不 (ne...jamais)' },
        french: 'Il ne travaille plus ici, il ne vient jamais.',
        phonetic: 'eel nuh trah-vahy ploo ee-see, eel nuh vyahn zhah-meh',
        meaning: { en: 'He no longer works here, he never comes. (Silent -s on plus when meaning "no more"!)', zh: '他不再在这里工作了，他从不来。（注意：表示“不再”时 plus 词尾的 s 不发音！）' }
      },
      {
        category: { en: 'Question Word + Est-ce que', zh: '疑问词 + Est-ce que 不倒装公式' },
        french: 'Quand est-ce que vous pouvez commencer ?',
        phonetic: 'kahn-tes-kuh voo poo-vay koh-mahn-say',
        meaning: { en: 'When can you start?', zh: '您什么时候可以开始？（疑问词 Quand + est-ce que + 正常陈述句语序）' }
      }
    ],
    flashcards: [
      { fr: 'Je ne comprends pas', en: 'I do not understand', zh: '我不明白', hint: 'zhuh nuh kohm-prahn pah' },
      { fr: 'Qu’est-ce que tu fais ?', en: 'What are you doing? (Que + est-ce que)', zh: '你在干什么？（Que + est-ce que 固定结构）', hint: 'kes-kuh too feh' },
      { fr: 'Je n’ai plus le temps', en: 'I no longer have the time', zh: '我再也没有时间了', hint: 'zhuh nay ploo luh tahn' },
      { fr: 'Pourquoi est-ce qu’il part ?', en: 'Why is he leaving?', zh: '他为什么要走？', hint: 'poor-kwah es-keel par' }
    ],
    quiz: [
      {
        id: 'n1',
        question: {
          en: 'Where does the negation go in a sentence with two verbs like "Je vais travailler"?',
          zh: '在含有两个动词的句子“Je vais travailler”（我要去工作）中，否定词 ne...pas 应该放在哪里？'
        },
        options: [
          'Je ne vais pas travailler.',
          'Je vais ne pas travailler.',
          'Je ne vais travailler pas.',
          'Ne je vais pas travailler.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'The negation sandwich (ne...pas) always wraps around the FIRST (conjugated) verb: Je ne vais pas travailler.',
          zh: '否定三明治（ne...pas）永远夹住第一个已变位的动词（vais），后面的动词原形放在 pas 之后：Je ne vais pas travailler。'
        }
      },
      {
        id: 'n2',
        question: {
          en: 'How do you turn "Tu habites à Kingston" into "Where do you live?" using the Est-ce que formula?',
          zh: '如何用 Est-ce que 万能公式将“Tu habites à Kingston”变成“你住在哪里？”'
        },
        options: [
          'Où est-ce que tu habites ?',
          'Est-ce que où tu habites ?',
          'Tu habites où est-ce que ?',
          'Où tu est-ce que habites ?'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Formula: [Question Word] + [est-ce que] + [Subject + Verb]. Où est-ce que tu habites ?',
          zh: '固定公式：[疑问词 Où] + [est-ce que] + [主语 + 动词陈述语序]，即 Où est-ce que tu habites ?'
        }
      }
    ]
  },
  {
    id: 'tier2-passe-compose',
    tier: 2,
    week: { en: 'Weeks 4–5', zh: '第4–5周' },
    title: { en: 'Passé Composé (Completed Past)', zh: '复合过去时 (Passé Composé • 已完成动作)' },
    subtitle: { en: 'Auxiliary Avoir/Être + Past Participle (Equivalent to Mandarin 了/过)', zh: '助动词 Avoir/Être + 过去分词（对应中文“了/过”）' },
    prereqs: ['tier1-negation'],
    summary: {
      en: 'To narrate completed past events ("I ate", "I went"), combine a present-tense helper verb (usually avoir, or être for movement/reflexive verbs) with a past participle.',
      zh: '用于叙述过去已经发生或完成的事件（相当于中文动词后的“了”或“过”）。公式为：[现在时助动词 Avoir 或 Être] + [过去分词]。'
    },
    rules: {
      en: [
        'Regular Participle Formulas: -ER verbs -> -é (parler -> parlé [par-lay]). -IR verbs -> -i (finir -> fini). -RE verbs -> -u (attendre -> attendu).',
        '85% of verbs use AVOIR as the helper: J’ai parlé (I spoke), Tu as fini (You finished), On a vu (We saw).',
        '15% Movement/State-of-Being verbs (DR & MRS VANDERTRAMP) + Reflexives use ÊTRE: Je suis allé(e) (I went), Il est parti (He left), Elle est venue (She came).',
        'Key Irregular Participles: faire -> fait, avoir -> eu, être -> été, prendre -> pris, mettre -> mis, voir -> vu, pouvoir -> pu, devoir -> dû.'
      ],
      zh: [
        '规则过去分词变形：-ER 结尾变为 -é（parler -> parlé，读音与原形完全相同！）；-IR 结尾变为 -i（finir -> fini）；-RE 结尾变为 -u（attendre -> attendu）。',
        '85%的动词使用 AVOIR 作助动词：J’ai parlé（我说了）、Tu as fini（你完成了）、On a vu（我们看见了）。',
        '15%表示位移/状态变化的动词（来去出入生死留）及自反动词使用 ÊTRE 作助动词：Je suis allé(e)（我去了）、Il est parti（他走了）、Elle est arrivée（她到了）。',
        '必背不规则过去分词：faire -> fait, avoir -> eu [ü], être -> été, prendre -> pris, mettre -> mis, voir -> vu, pouvoir -> pu, devoir -> dû。'
      ]
    },
    patterns: [
      {
        category: { en: 'Avoir + Regular Participle', zh: 'Avoir + 规则过去分词' },
        french: 'Hier, j’ai travaillé toute la journée.',
        phonetic: 'ee-yair, zhay trah-vah-yay toot lah zhoor-nay',
        meaning: { en: 'Yesterday, I worked all day.', zh: '昨天我工作了一整天。（J’ai + travaillé）' }
      },
      {
        category: { en: 'Être + Movement Verb', zh: 'Être + 位移动词 (aller/partir/venir)' },
        french: 'Je suis allé au bureau et je suis parti à cinq heures.',
        phonetic: 'zhuh swee-zah-lay oh boo-roh eh zhuh swee par-tee ah sahnk uhr',
        meaning: { en: 'I went to the office and I left at 5 o’clock.', zh: '我去了办公室，并且在五点钟离开了。（来回移动类动词必须用 être 作助动词）' }
      },
      {
        category: { en: 'Past Negation', zh: '复合过去时的否定结构' },
        french: 'Je n’ai pas compris la question.',
        phonetic: 'zhuh nay pah kohm-pree lah kes-tyohn',
        meaning: { en: 'I did not understand the question. (Ne...pas wraps the helper verb!)', zh: '我没听懂这个问题。（注意：ne...pas 只夹住助动词 ai，过去分词放在 pas 后面！）' }
      }
    ],
    flashcards: [
      { fr: 'J’ai déjà fait ça', en: 'I already did that', zh: '我已经做过那件事了（faire -> fait）', hint: 'zhay day-zhah feh sah' },
      { fr: 'On a pris le train', en: 'We took the train', zh: '我们坐了火车（prendre -> pris）', hint: 'ohn ah pree luh trahn' },
      { fr: 'Elle est arrivée hier', en: 'She arrived yesterday (Uses être)', zh: '她昨天到的（arriver 用 être，阴性加 -e）', hint: 'el eh-tah-ree-vay ee-yair' },
      { fr: 'Je n’ai rien dit', en: 'I said nothing / I didn’t say anything', zh: '我什么都没说（dire -> dit）', hint: 'zhuh nay ryahn dee' }
    ],
    quiz: [
      {
        id: 'pc1',
        question: {
          en: 'Which auxiliary verb is required to say "I went to Montreal" in the Passé Composé?',
          zh: '在复合过去时中，表达“我去了蒙特利尔”必须使用哪个助动词？'
        },
        options: [
          'Je suis allé à Montréal.',
          'J’ai allé à Montréal.',
          'Je vais allé à Montréal.',
          'J’étais allé à Montréal.'
        ],
        correctIndex: 0,
        explanation: {
          en: '"Aller" (to go) is a directional movement verb and takes ÊTRE as its auxiliary in the Passé Composé: Je suis allé(e).',
          zh: '“Aller”（去）属于核心方向性位移动词，在复合过去时中必须使用 ÊTRE 作为助动词：Je suis allé(e)。'
        }
      },
      {
        id: 'pc2',
        question: {
          en: 'How do you negate "J’ai compris" (I understood)?',
          zh: '如何将“J’ai compris”（我听懂了）变成否定句“我没听懂”？'
        },
        options: [
          'Je n’ai pas compris.',
          'Je n’ai compris pas.',
          'Je ne compris pas.',
          'Pas j’ai compris.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'In compound tenses, "ne...pas" wraps around the auxiliary verb (ai), leaving the past participle (compris) after "pas".',
          zh: '在复合时态中，“ne...pas”永远夹住助动词（ai），过去分词（compris）放在 pas 之后：Je n’ai pas compris。'
        }
      }
    ]
  },
  {
    id: 'tier2-imparfait',
    tier: 2,
    week: { en: 'Weeks 5–6', zh: '第5–6周' },
    title: { en: 'Imparfait vs. Passé Composé Binary', zh: '未完成过去时 vs. 复合过去时双剑合璧' },
    subtitle: { en: 'Background States & Past Habits vs. Interrupted Actions', zh: '背景状态/过去习惯 (-ais/-ait) vs. 突发完成事件' },
    prereqs: ['tier2-passe-compose'],
    summary: {
      en: 'Think of past storytelling as a movie: Imparfait paints the background scenery, ongoing states, and "used to" habits, while Passé Composé is the sudden plot action that happens on stage.',
      zh: '把讲过去的故事想象成拍电影：Imparfait（未完成过去时）负责渲染背景、持续状态（当时正在…）和过去习惯（以前常…）；Passé Composé 则负责切入具体发生的突发事件（突然…了）。'
    },
    rules: {
      en: [
        'The Easiest Stem in French: Take the present "nous" form, drop "-ons", and add [-ais, -ais, -ait, -ions, -iez, -aient]. Note: -ais, -ait, and -aient ALL sound identical: [eh]!',
        'Only ONE irregular verb in Imparfait: Être -> j’étais, tu étais, il/elle/on était [eh-teh], nous étions, vous étiez, ils étaient.',
        'When to use Imparfait: "C’était..." (It was...), "Il y avait..." (There was/were...), "J’avais..." (I had / I was X years old), and "Je faisais..." (I was doing / used to do).'
      ],
      zh: [
        '全法语最简单的变位规则：取现在时 nous 变位去掉 -ons 作为词根，加上词尾 [-ais, -ais, -ait, -ions, -iez, -aient]。而且单数和复数第三人称（-ais, -ait, -aient）发音100%相同，都读作 [eh]！',
        '全法语唯一的不规则词根只有 Être：j’étais, tu étais, il/elle/on était [eh-teh], nous étions, vous étiez, ils étaient。',
        '四大高频黄金句型：C’était...（那时候是…）、Il y avait...（当时有…）、J’avais...（我当时有…）、Je voulais/devais...（我当时想/本应该…）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Ongoing Background + Sudden Event', zh: '持续背景 (Imparfait) + 突发事件 (PC)' },
        french: 'Je travaillais quand il a appelé.',
        phonetic: 'zhuh trah-vah-yeh kahn-teel ah ah-puh-lay',
        meaning: { en: 'I was working (background state) when he called (completed action).', zh: '当他打电话来的时候（突发完成事件），我正在工作（持续背景状态）。' }
      },
      {
        category: { en: 'Past Description & Habits', zh: '过去描述与以前习惯 (Used to)' },
        french: 'Quand j’étais étudiant, j’habitais à Montréal.',
        phonetic: 'kahn zheh-teh ay-too-dyahn, zhah-bee-teh ah mohn-ray-ahl',
        meaning: { en: 'When I was a student, I lived (used to live) in Montreal.', zh: '当我还是学生的时候，我住在蒙特利尔。（过去持续的状态，不能用 Passé Composé）' }
      }
    ],
    flashcards: [
      { fr: 'C’était très intéressant', en: 'It was very interesting (Description)', zh: '那非常有趣（描述过去感受用 C’était）', hint: 'seh-teh treh-zahn-tay-reh-sahn' },
      { fr: 'Il y avait beaucoup de monde', en: 'There were a lot of people', zh: '当时有很多人（Il y a 的过去状态描述）', hint: 'eel yah-veh boh-koo duh mohnd' },
      { fr: 'Je voulais vous demander', en: 'I wanted to ask you (Polite/State)', zh: '我刚才想问您…（委婉表达当时的想法）', hint: 'zhuh voo-leh voo duh-mahn-day' },
      { fr: 'Il pleuvait quand je suis sorti', en: 'It was raining when I went out', zh: '我出门的时候正在下雨', hint: 'eel pluh-veh kahn zhuh swee sor-tee' }
    ],
    quiz: [
      {
        id: 'imp1',
        question: {
          en: 'Choose the right tense pair: "I was sleeping (1) when the phone rang (2)."',
          zh: '选择正确的时态组合：“我正在睡觉时（1），电话突然响了（2）。”'
        },
        options: [
          '(1) Je dormais [Imparfait] quand (2) le téléphone a sonné [Passé Composé].',
          '(1) J’ai dormi [Passé Composé] quand (2) le téléphone sonnait [Imparfait].',
          'Both verbs must be in Passé Composé.',
          'Both verbs must be in Imparfait.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Sleeping is the ongoing background action (Imparfait: je dormais), and the phone ringing is the sudden interrupting event (Passé Composé: a sonné).',
          zh: '“正在睡觉”是持续的背景状态，用未完成过去时（Je dormais）；“电话响了”是打断背景的瞬间完成动作，用复合过去时（a sonné）。'
        }
      },
      {
        id: 'imp2',
        question: {
          en: 'How do you say "When I was young,It was great" in French?',
          zh: '用法语表达“我年轻的时候，那真是太棒了”应该怎么说？'
        },
        options: [
          'Quand j’étais jeune, c’était super.',
          'Quand j’ai été jeune, ç’a été super.',
          'Quand je suis jeune, c’est super.',
          'Quand je serai jeune, ce sera super.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Being young and describing how things were are ongoing past states, so both use Imparfait: j’étais, c’était.',
          zh: '“年轻的时候”和“当时很棒”均属于过去的持续状态与背景评价，因此全部使用 Imparfait：j’étais, c’était。'
        }
      }
    ]
  },
  {
    id: 'tier2-pronouns',
    tier: 2,
    week: { en: 'Weeks 6–7', zh: '第6–7周' },
    title: { en: 'Object Pronouns & Y / En Compression', zh: '宾语代词前置与 Y / En 极致压缩' },
    subtitle: { en: 'Le, La, Les, Lui, Leur, Y, En (Pre-Verbal Syntax similar to Mandarin 把)', zh: '直接/间接宾语代词及副代词 Y/En（类比中文“把”字句前置）' },
    prereqs: ['tier2-imparfait'],
    summary: {
      en: 'French speakers hate repeating nouns. Instead of "I see the report -> I read it", French places object pronouns BEFORE the verb ("I it read" = Je le lis), similar to Mandarin 把-constructions (我把它读了).',
      zh: '法语极度排斥重复名词。不同于英语把代词放句尾，法语将代词放在变位动词之前（类似中文“把”字句：我【把它】看了 = Je le regarde；我【跟他说】= Je lui parle）。'
    },
    rules: {
      en: [
        'Direct Objects (COD - him/her/it/them): me, te, le/la (l’ before vowel), nous, vous, les. Example: Je le vois (I see him/it).',
        'Indirect Objects (COI - TO him/her/them, used with parler à, téléphoner à, donner à, dire à): lui (to him OR to her!), leur (to them). Example: Je lui parle (I speak to him/her).',
        'Pronoun Y (replaces "à/dans/chez + place/thing" = there / about it): J’y vais (I am going there), J’y pense (I think about it).',
        'Pronoun EN (replaces "de + thing" or quantities = some / of them): J’en veux deux (I want two of them), On en parle (We are talking about it).'
      ],
      zh: [
        '直接宾语代词 (COD - 代替人或物)：me, te, le/la (元音前省音为 l’), nous, vous, les。置于动词前：Je le vois（我看见他/它）。',
        '间接宾语代词 (COI - 代替 à + 人，常搭配 parler à, dire à, donner à, envoyer à)：单数不分男女一律用 lui（对他/对她），复数用 leur（对他们）。例：Je lui parle（我跟他说/她说话）。',
        '副代词 Y（代替 à/dans/sur + 地点或事物，意为“去那儿/在这方面”）：J’y vais（我去那儿）、J’y pense（我考虑这件事）。',
        '副代词 EN（代替 de + 事物 或 数字/数量词后的名词）：J’en veux deux（我想要两个[这个]）、J’en ai besoin（我需要这个，因为 avoir besoin de 含 de）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Direct vs Indirect (Le vs Lui)', zh: '直接宾语 (Le/La) vs 间接宾语 (Lui)' },
        french: 'Je le connais et je lui parle souvent.',
        phonetic: 'zhuh luh koh-neh eh zhuh lwee parl soo-vahn',
        meaning: { en: 'I know him (direct) and I speak to him/her (indirect: parler à) often.', zh: '我认识他（connaître 直接接人，用 le），并且我经常跟他/她说话（parler à 接人，用 lui）。' }
      },
      {
        category: { en: 'Power Pronoun Y & En', zh: '万能代词 Y 与 En' },
        french: 'Tu vas au bureau ? Oui, j’y vais et j’en reviens à midi.',
        phonetic: 'too vah oh boo-roh? wee, zhee vay eh zhahn ruh-vyahn ah mee-dee',
        meaning: { en: 'Are you going to the office? Yes, I’m going there (y) and coming back from there (en) at noon.', zh: '你去办公室吗？是的，我去那儿（y = à + 地点），中午从那儿回来（en = de + 地点）。' }
      }
    ],
    flashcards: [
      { fr: 'Je vous l’envoie tout de suite', en: 'I am sending it to you right away', zh: '我马上把它发给您', hint: 'zhuh voo lahn-vwah toot sweet' },
      { fr: 'Je lui ai déjà dit', en: 'I already told him/her (dire à qqn -> lui)', zh: '我已经告诉过他/她了（代词放在助动词 ai 前面！）', hint: 'zhuh lwee ay day-zhah dee' },
      { fr: 'J’en ai besoin aujourd’hui', en: 'I need it today (avoir besoin DE -> en)', zh: '我今天需要它（因为短语带 de，必须用 en 替代）', hint: 'zhahn ay buh-zwahn oh-zhoor-dwee' },
      { fr: 'On y va !', en: 'Let’s go (there)!', zh: '我们走吧！（高频口语：On + y + va）', hint: 'ohn-ee vah' }
    ],
    quiz: [
      {
        id: 'pr1',
        question: {
          en: 'How do you say "I speak to her" in French (given that the verb is "parler à quelqu’un")?',
          zh: '已知法语“跟某人说话”是“parler à quelqu’un”，那么“我跟她说话”应该怎么说？'
        },
        options: [
          'Je lui parle.',
          'Je la parle.',
          'Je parle à elle.',
          'Je leur parle.'
        ],
        correctIndex: 0,
        explanation: {
          en: '"Lui" means BOTH "to him" and "to her" for indirect objects (verbs with "à + person"). "La" is only for direct objects (Je la vois = I see her).',
          zh: '注意高频考点：间接宾语代词单数“lui”既表示“对他”也表示“对她”（男女同形）！因为 parler à 带介词 à，所以必须用 Je lui parle。'
        }
      },
      {
        id: 'pr2',
        question: {
          en: 'How do you reply "Yes, I want two of them" to "Vous voulez des cafés ?"',
          zh: '当别人问“Vous voulez des cafés ?”（您要咖啡吗？），如何地道回答“是的，我要两杯”？'
        },
        options: [
          'Oui, j’en veux deux.',
          'Oui, je veux deux.',
          'Oui, je les veux deux.',
          'Oui, j’y veux deux.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Whenever you specify a number or quantity without repeating the noun ("two [of them]"), French requires the pronoun "en" before the verb: J’en veux deux.',
          zh: '在法语中，只要保留了数字或数量词而省略了后面的名词（“我要两个[咖啡]”），就必须在动词前加上代词“en”补位：J’en veux deux。'
        }
      }
    ]
  },
  {
    id: 'tier3-conditionnel',
    tier: 3,
    week: { en: 'Weeks 8–9', zh: '第8–9周' },
    title: { en: 'Le Conditionnel & Hypothetical "Si" Clauses', zh: '条件式 (Conditionnel) 与 Si 假设句型' },
    subtitle: { en: 'Polite Requests, Advice & "If I had..., I would..."', zh: '职场委婉请求、建议与“如果…就会…”虚拟假设' },
    prereqs: ['tier2-pronouns'],
    summary: {
      en: 'The Conditional is built by gluing Future stems (usually the raw infinitive) onto Imparfait endings (-ais, -ait, -ions, -iez, -aient). It unlocks polite B1/SLE-B diplomacy and hypothetical reasoning.',
      zh: '条件式 = [将来时词根（通常是动词原形）] + [未完成过去时词尾 (-ais, -ait, -ions, -iez, -aient)]。它是达到 B1 / 加拿大政府 SLE-B 级必备的委婉沟通与假设推理工具。'
    },
    rules: {
      en: [
        'Polite Trio: Je voudrais (I would like - vouloir), Tu pourrais / Vous pourriez (Could you - pouvoir), On devrait / Il faudrait (We should / One ought to - devoir/falloir).',
        'Key Stems: être -> ser- (ce serait = it would be), avoir -> aur- (j’aurais = I would have), faire -> fer- (je ferais = I would do), aller -> ir- (j’irais = I would go).',
        'The "Si" (If) Golden Equation: [Si + Imparfait] -> [Conditionnel]. Never put Conditionnel right after "Si"! Example: Si j’avais le temps, je ferais ça (If I had time, I would do that).'
      ],
      zh: [
        '职场礼貌三剑客：Je voudrais（我想要 - 比 je veux 礼貌十倍）、Vous pourriez（您能否…）、On devrait / Il faudrait（我们应该 / 最好…）。',
        '核心不规则词根：être -> ser-（ce serait = 那将会是）、avoir -> aur-（j’aurais = 我会有）、faire -> fer-（je ferais = 我会做）、aller -> ir-（j’irais = 我会去）。',
        'Si（如果）假设黄金公式：【Si + 未完成过去时 (Imparfait)】→【主句用条件式 (Conditionnel)】。切记：Si 从句内部绝不能直接用条件式！'
      ]
    },
    patterns: [
      {
        category: { en: 'Workplace Diplomacy', zh: '职场礼貌请求与建议' },
        french: 'Est-ce que vous pourriez m’envoyer le document ? Il faudrait vérifier les données.',
        phonetic: 'es-kuh voo poo-ryay mahn-vwah-yay luh doh-koo-mahn? eel foh-dreh vay-ree-fyay lay doh-nay',
        meaning: { en: 'Could you send me the document? We ought to verify the data.', zh: '您能把那份文件发给我吗？我们最好核实一下数据。' }
      },
      {
        category: { en: 'Si + Imparfait -> Conditionnel', zh: 'Si 假设句公式' },
        french: 'Si j’avais plus de temps, j’apprendrais une autre langue.',
        phonetic: 'see zhah-veh ploo duh tahn, zhah-prahn-dreh oon oh-truh lahng',
        meaning: { en: 'If I had more time (Imparfait), I would learn (Conditionnel) another language.', zh: '如果我有更多时间（从句用 Imparfait），我就会再学一门语言（主句用 Conditionnel）。' }
      }
    ],
    flashcards: [
      { fr: 'Ça serait parfait', en: 'That would be perfect', zh: '那就太完美了（être -> serait）', hint: 'sah suh-reh par-feh' },
      { fr: 'Qu’est-ce que tu ferais à ma place ?', en: 'What would you do in my place?', zh: '如果你站在我的位置，你会怎么做？', hint: 'kes-kuh too fuh-reh ah mah plas' },
      { fr: 'On devrait commencer bientôt', en: 'We should start soon', zh: '我们应该尽快开始了', hint: 'ohn duh-vreh koh-mahn-say byahn-toh' },
      { fr: 'Si je pouvais, je viendrais', en: 'If I could, I would come', zh: '如果我能的话，我就来了（Si + Imparfait, Conditionnel）', hint: 'see zhuh poo-veh, zhuh vyahn-dreh' }
    ],
    quiz: [
      {
        id: 'cond1',
        question: {
          en: 'Complete the hypothetical sentence: "If I had the budget, I would hire another developer."',
          zh: '完成假设句：“如果我有预算，我就会再招一名开发人员。”'
        },
        options: [
          'Si j’avais le budget, j’embaucherais un autre développeur.',
          'Si j’aurais le budget, j’embaucherais un autre développeur.',
          'Si j’ai le budget, j’embaucherais un autre développeur.',
          'Si j’avais le budget, j’ai embauché un autre développeur.'
        ],
        correctIndex: 0,
        explanation: {
          en: 'French rule: "Les si n’aiment pas les -rais" (Si clauses never take the conditional -rais). Use Imparfait after Si (Si j’avais), and Conditionnel in the main clause (j’embaucherais).',
          zh: '法语经典口诀：“Si 后面绝不接 -rais（条件式）”。Si 从句必须用未完成过去时（Si j’avais），主句才用条件式（j’embaucherais）。'
        }
      }
    ]
  },
  {
    id: 'tier3-subjonctif',
    tier: 3,
    week: { en: 'Weeks 10–12', zh: '第10–12周' },
    title: { en: 'High-Yield Subjonctif & B1 Fluency Connectors', zh: '高频虚拟式 (Subjonctif) 与 B1 逻辑连接词' },
    subtitle: { en: 'Il faut que, Bien que, Pour que & Relative Clauses (Qui / Que / Dont)', zh: 'Il faut que / Bien que / Pour que 及关系代词 Qui / Que / Dont' },
    prereqs: ['tier3-conditionnel'],
    summary: {
      en: 'To pass B1 / SLE Level B oral exams, you do not need obscure grammar—you need 5 high-frequency Subjunctive triggers (necessity, goal, concession) and clean relative clauses (qui/que/dont).',
      zh: '要通过 B1 或加拿大公务员 SLE Level B 口语测试，无需死磕生僻语法——只需掌握5个最高频的虚拟式触发词（必要性、目的、让步）以及三大关系代词（qui/que/dont）。'
    },
    rules: {
      en: [
        'Regular Subjunctive Stem: Take 3rd-person plural "ils" present, drop "-ent", add [-e, -es, -e, -ions, -iez, -ent]. (Sounds just like present tense for -er verbs!).',
        'Top 6 Irregular Subjunctives to Memorize: être -> soit, avoir -> ait, faire -> fasse, aller -> aille, pouvoir -> puisse, savoir -> sache.',
        'Top Triggers: Il faut que (It is necessary that...), Pour que (So that / In order that...), Bien que (Although / Even though...), Avant que (Before...).',
        'Relative Clauses: QUI = Subject follows a verb ("le collègue qui parle"). QUE = Object follows subject+verb ("le projet que je fais"). DONT = replaces "de" ("le sujet dont on parle").'
      ],
      zh: [
        '规则虚拟式变位：取现在时复数第三人称 ils 去掉 -ent，加 [-e, -es, -e, -ions, -iez, -ent]。',
        '必背6大高频不规则虚拟式（应付90%口语场景）：être -> soit, avoir -> ait, faire -> fasse, aller -> aille, pouvoir -> puisse, savoir -> sache。',
        '四大口语必考触发结构：Il faut que...（必须…）、Pour que...（为了…）、Bien que...（虽然/尽管…）、Je veux/aimerais que...（我希望别人…）。',
        '三大关系代词（定语从句）：QUI 作主语，后面直接跟动词（le collègue qui parle 说话的同事）；QUE 作宾语，后面跟主语+动词（le projet que je fais 我做的项目）；DONT 代替带 de 的短语（le sujet dont on parle 我们谈论的话题）。'
      ]
    },
    patterns: [
      {
        category: { en: 'Necessity Trigger (Il faut que)', zh: '必要性触发词 (Il faut que + 虚拟式)' },
        french: 'Il faut que j’aille au bureau et que je fasse ce rapport.',
        phonetic: 'eel foh kuh zhay oh boo-roh eh kuh zhuh fas suh rah-por',
        meaning: { en: 'I have to go (aille) to the office and do (fasse) this report.', zh: '我必须去（aille）办公室并完成（fasse）这份报告。' }
      },
      {
        category: { en: 'Concession & Goal (Bien que / Pour que)', zh: '让步与目的 (Bien que / Pour que)' },
        french: 'Bien que ce soit difficile, je t’explique pour que tu puisses comprendre.',
        phonetic: 'byahn kuh suh swah dee-fee-seel, zhuh teks-pleek poor kuh too pwees kohm-prahn-druh',
        meaning: { en: 'Although it is (soit) difficult, I am explaining to you so that you can (puisses) understand.', zh: '尽管这很难（soit），我还是给你解释一下以便你能（puisses）理解。' }
      },
      {
        category: { en: 'Qui vs. Que vs. Dont', zh: '关系代词 Qui / Que / Dont 辨析' },
        french: 'C’est le projet dont je t’ai parlé et que nous avons fini hier.',
        phonetic: 'seh luh pro-zheh dohn zhuh tay par-lay eh kuh noo-zah-vohn fee-nee ee-yair',
        meaning: { en: 'This is the project that I told you about (parler DE -> dont) and that we finished (direct object -> que) yesterday.', zh: '这就是我跟你说过的（parler de -> dont）、并且我们昨天完成了的（直接宾语 -> que）那个项目。' }
      }
    ],
    flashcards: [
      { fr: 'Il faut qu’on fasse attention', en: 'We have to be careful (faire -> fasse)', zh: '我们必须注意（Il faut que + faire 的虚拟式 fasse）', hint: 'eel foh kohn fas ah-tahn-syohn' },
      { fr: 'Bien qu’il soit occupé', en: 'Although he is busy (être -> soit)', zh: '尽管他很忙（Bien que 强制触发虚拟式 soit）', hint: 'byahn keel swah oh-koo-pay' },
      { fr: 'Pour que tout soit clair', en: 'So that everything is clear', zh: '为了让一切清楚明了', hint: 'poor kuh too swah klair' },
      { fr: 'La personne dont j’ai besoin', en: 'The person that I need (avoir besoin DE -> dont)', zh: '我需要的那个人（因为 avoir besoin de 含 de，定语从句用 dont）', hint: 'lah pair-son dohn zhay buh-zwahn' }
    ],
    quiz: [
      {
        id: 'sub1',
        question: {
          en: 'Choose the correct verb form after "Il faut que" (It is necessary that): "Il faut que tu ___ (faire) ça."',
          zh: '在“Il faut que”（必须…）之后应填入 faire 的哪种形式：“Il faut que tu ___ ça.”'
        },
        options: ['fasses', 'fais', 'feras', 'ferais'],
        correctIndex: 0,
        explanation: {
          en: '"Il faut que" expresses necessity and always triggers the Subjonctif. The subjunctive stem of "faire" is "fass-" -> tu fasses.',
          zh: '“Il faut que”表达主观必要性，100%触发虚拟式（Subjonctif）。faire 的虚拟式变位为 que je fasse / que tu fasses / qu’il fasse。'
        }
      },
      {
        id: 'sub2',
        question: {
          en: 'Fill in the blank: "Le livre ___ j’ai besoin est sur la table." (Hint: avoir besoin DE)',
          zh: '填空：“我需要的那本书在桌子上。” Le livre ___ j’ai besoin est sur la table.（提示：avoir besoin DE）'
        },
        options: ['dont', 'que', 'qui', 'où'],
        correctIndex: 0,
        explanation: {
          en: 'Because the verb phrase is "avoir besoin DE quelque chose", the relative pronoun that replaces "de + noun" is always DONT.',
          zh: '因为核心短语“avoir besoin de”自带介词 de，在引导定语从句时必须使用专门替代“de + 名词”的关系代词 DONT。'
        }
      }
    ]
  }
];

const TIER_META = [
  {
    tier: 0,
    title: { en: 'Tier 0 • Root Phonetic Decoding', zh: '第0层 • 语音与拼读解码根基' },
    desc: { en: 'Week 1: Stop reading French with English/Pinyin rules', zh: '第1周：告别盲猜，掌握法语见词读音底层算法' }
  },
  {
    tier: 1,
    title: { en: 'Tier 1 • Present Core & Modal Shortcuts', zh: '第1层 • 核心现在时与双动词捷径' },
    desc: { en: 'Weeks 1–3: Express 80% of daily thoughts using 7 verbs + infinitives', zh: '第1–3周：用7个核心动词+原形搞定80%日常表达' }
  },
  {
    tier: 2,
    title: { en: 'Tier 2 • Past Narration & Pronoun Compression', zh: '第2层 • 过去时叙事与代词前置压缩' },
    desc: { en: 'Weeks 4–7: Tell stories in the past and speak without repeating nouns', zh: '第4–7周：区分两大过去时，掌握法语“把”字句代词前置' }
  },
  {
    tier: 3,
    title: { en: 'Tier 3 • B1 / SLE-B Nuance & Subjunctive Engine', zh: '第3层 • B1 / SLE-B 职场委婉语与虚拟式引擎' },
    desc: { en: 'Weeks 8–12: Hypotheticals, polite diplomacy, and complex clauses', zh: '第8–12周：条件式假设、礼貌外交辞令与虚拟式高分句型' }
  }
];

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('fr_tree_lang') || 'zh');
  const [completedNodes, setCompletedNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('fr_tree_completed_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [sandboxMode, setSandboxMode] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(SKILL_NODES[0].id);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'flashcards' | 'quiz'
  const [flippedCards, setFlippedCards] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [panelPulse, setPanelPulse] = useState(false);
  const studioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fr_tree_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('fr_tree_completed_v2', JSON.stringify(completedNodes));
  }, [completedNodes]);

  const t = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  const activeNode = SKILL_NODES.find((n) => n.id === selectedNodeId) || SKILL_NODES[0];

  const isNodeUnlocked = (node) => {
    if (sandboxMode || node.prereqs.length === 0) return true;
    return node.prereqs.every((p) => completedNodes.includes(p));
  };

  const speakFrench = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectNode = (node, tab = 'lesson') => {
    if (!isNodeUnlocked(node)) return;
    setSelectedNodeId(node.id);
    setActiveTab(tab);
    setFlippedCards({});
    setQuizAnswers({});
    setQuizSubmitted(false);
    setPanelPulse(true);
    setTimeout(() => setPanelPulse(false), 600);
    if (studioRef.current && window.innerWidth < 1024) {
      studioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleNodeComplete = (nodeId) => {
    setCompletedNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const allCorrect = activeNode.quiz.every((q, idx) => quizAnswers[idx] === q.correctIndex);
    if (allCorrect && !completedNodes.includes(activeNode.id)) {
      setCompletedNodes((prev) => [...prev, activeNode.id]);
    }
  };

  const progressPct = Math.round((completedNodes.length / SKILL_NODES.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {lang === 'zh' ? '90天法语速成技能树 (CEFR B1 / SLE-B)' : '90-Day French Proficiency Skill Tree'}
              </h1>
              <p className="text-xs text-slate-400">
                {lang === 'zh'
                  ? '第一性原理语法引擎 • 英语/中文双语对比 • 原生法语发音与通关测验'
                  : 'First-Principles Syntax Engine • Native Audio • Interactive Mastery Quizzes'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'zh' ? '切换: 中文 / EN' : 'Lang: EN / 中文'}
            </button>

            {/* Sandbox Unlock Toggle */}
            <button
              onClick={() => setSandboxMode((s) => !s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                sandboxMode
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {sandboxMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {lang === 'zh'
                ? sandboxMode
                  ? '自由模式：全部解锁'
                  : '闯关模式：按序解锁'
                : sandboxMode
                ? 'Sandbox: All Unlocked'
                : 'Strict Progression'}
            </button>

            {/* Progress Counter */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                {completedNodes.length}/{SKILL_NODES.length} ({progressPct}%)
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Interactive Skill Tree Map (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {TIER_META.map((tierObj) => {
            const tierNodes = SKILL_NODES.filter((n) => n.tier === tierObj.tier);
            return (
              <div
                key={tierObj.tier}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4 shadow-sm"
              >
                <div
                  onClick={() => tierNodes[0] && handleSelectNode(tierNodes[0], 'lesson')}
                  className="mb-3 pb-2 border-b border-slate-800/80 cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-sm font-bold text-indigo-400 group-hover:text-indigo-300 transition">
                      {t(tierObj.title)}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{t(tierObj.desc)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                </div>

                <div className="space-y-2.5">
                  {tierNodes.map((node) => {
                    const unlocked = isNodeUnlocked(node);
                    const completed = completedNodes.includes(node.id);
                    const selected = selectedNodeId === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => handleSelectNode(node, 'lesson')}
                        className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                          selected
                            ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : completed
                            ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                            : unlocked
                            ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/60 border-slate-900 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-0.5">
                              {t(node.week)}
                            </span>
                            <h3 className="text-sm font-bold text-white leading-snug">
                              {t(node.title)}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">{t(node.subtitle)}</p>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : unlocked ? (
                              <Sparkles
                                className={`w-4 h-4 ${
                                  selected ? 'text-indigo-400' : 'text-slate-600'
                                }`}
                              />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectNode(node, 'lesson');
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                          >
                            {lang === 'zh' ? '📖 课程讲解' : '📖 Lesson'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectNode(node, 'flashcards');
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                          >
                            {lang === 'zh' ? '🃏 闪卡记忆' : '🃏 Cards'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectNode(node, 'quiz');
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-600/80 hover:bg-indigo-500 text-white transition cursor-pointer"
                          >
                            {lang === 'zh' ? '⚡ 测验闯关' : '⚡ Take Quiz'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Active Lesson, Flashcards & Quiz Studio (7 cols) */}
        <div
          ref={studioRef}
          className={`lg:col-span-7 lg:sticky lg:top-20 rounded-2xl border bg-slate-900/70 p-5 sm:p-6 transition-all ${
            panelPulse
              ? 'border-indigo-400 ring-2 ring-indigo-500/30'
              : 'border-slate-800'
          }`}
        >
          {/* Node Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t(activeNode.week)}
                </span>
                {completedNodes.includes(activeNode.id) && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {lang === 'zh' ? '已掌握' : 'Mastered'}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                {t(activeNode.title)}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{t(activeNode.subtitle)}</p>
            </div>

            <button
              onClick={() => toggleNodeComplete(activeNode.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                completedNodes.includes(activeNode.id)
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completedNodes.includes(activeNode.id)
                ? lang === 'zh'
                  ? '已完成 (点击取消)'
                  : 'Completed'
                : lang === 'zh'
                ? '标记为已掌握'
                : 'Mark Complete'}
            </button>
          </div>

          {/* Studio Mode Tabs */}
          <div className="grid grid-cols-3 gap-2 my-4 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'lesson'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {lang === 'zh' ? '1. 核心语法与发音' : '1. Core Lesson'}
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Brain className="w-4 h-4" />
              {lang === 'zh' ? '2. 主动回忆闪卡' : '2. Flashcards'}
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              {lang === 'zh' ? '3. 闯关测验' : '3. Mastery Quiz'}
            </button>
          </div>

          {/* TAB 1: LESSON CONTENT */}
          {activeTab === 'lesson' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-sm text-indigo-100 leading-relaxed">
                <span className="font-bold text-indigo-300 mr-1.5">
                  {lang === 'zh' ? '💡 核心心法：' : '💡 Core Mental Model:'}
                </span>
                {t(activeNode.summary)}
              </div>

              {/* Grammar Rules */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  {lang === 'zh' ? '底层语法规则与中英法对比' : 'First-Principles Rules'}
                </h3>
                <ul className="space-y-2">
                  {(activeNode.rules[lang] || activeNode.rules.en).map((rule, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-slate-200 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sound & Syntax Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'zh'
                      ? '发音与造句矩阵 (点击喇叭听母语发音)'
                      : 'Sound & Syntax Matrix (Click Speaker for Audio)'}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {activeNode.patterns.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-indigo-400 uppercase">
                          {t(p.category)}
                        </span>
                        <p className="text-base font-bold text-white">{p.french}</p>
                        <p className="text-xs font-mono text-amber-300/90">
                          [{p.phonetic}]
                        </p>
                        <p className="text-xs text-slate-300">{t(p.meaning)}</p>
                      </div>
                      <button
                        onClick={() => speakFrench(p.french)}
                        title="Listen in French"
                        className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  {lang === 'zh' ? '进入本节通关测验' : 'Start Node Quiz'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                {lang === 'zh'
                  ? '点击卡片翻转查看中文/英文解析，点击右上角喇叭图标听法语原声：'
                  : 'Click any card to flip between French and meaning, or click the speaker icon for native pronunciation:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeNode.flashcards.map((card, i) => {
                  const isFlipped = !!flippedCards[i];
                  return (
                    <div
                      key={i}
                      onClick={() =>
                        setFlippedCards((prev) => ({ ...prev, [i]: !prev[i] }))
                      }
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-indigo-500/50 transition cursor-pointer min-h-[130px] flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase text-slate-500">
                          {isFlipped
                            ? lang === 'zh'
                              ? '中文 / 英文释义'
                              : 'Meaning & Breakdown'
                            : lang === 'zh'
                            ? '法语原句 (点击翻转)'
                            : 'French (Click to Flip)'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakFrench(card.fr);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 transition cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="my-2">
                        {!isFlipped ? (
                          <>
                            <p className="text-lg font-bold text-white">{card.fr}</p>
                            <p className="text-xs font-mono text-amber-300/80 mt-1">
                              [{card.hint}]
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-emerald-300">
                              {lang === 'zh' ? card.zh : card.en}
                            </p>
                            {lang === 'zh' && (
                              <p className="text-xs text-slate-400 mt-1">{card.en}</p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="text-[11px] text-indigo-400 flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        {lang === 'zh' ? '点击卡片翻转' : 'Tap to flip'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              {activeNode.quiz.map((q, qIdx) => {
                const userSelected = quizAnswers[qIdx];
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                  >
                    <p className="text-sm font-bold text-white">
                      {qIdx + 1}. {t(q.question)}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userSelected === oIdx;
                        const isCorrect = q.correctIndex === oIdx;

                        let btnStyle =
                          'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle =
                              'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          }
                        } else if (isSelected) {
                          btnStyle =
                            'bg-indigo-950/80 border-indigo-500 text-indigo-200';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                            }
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{t(opt)}</span>
                            {quizSubmitted && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <X className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <span className="font-bold text-indigo-400 mr-1">
                          {lang === 'zh' ? '解析：' : 'Explanation:'}
                        </span>
                        {t(q.explanation)}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition cursor-pointer"
                  >
                    {lang === 'zh' ? '提交答案并查看解析' : 'Submit Quiz Answers'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {lang === 'zh' ? '重做本节测验' : 'Retry Quiz'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}