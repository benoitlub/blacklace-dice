export interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hint: string; // one-line "how to embody"
  color: string;
  durationOptions: number[]; // in minutes
}

export interface PsychoProfile {
  id: string;
  name: string;
  emoji: string;
  archetype: string;
  essence: string;
  traits: string[];
  color: string;
  durationOptions: number[];
}

export const CHARACTERS: Character[] = [
  {
    id: "paisible",
    name: "Paisible",
    emoji: "🕊️",
    description: "Calme profond. Rien ne te presse.",
    hint: "Ralentis chaque geste. Parle doucement. Respire avant de répondre.",
    color: "#93c5fd",
    durationOptions: [2, 3, 5]
  },
  {
    id: "enerve",
    name: "Énervé",
    emoji: "🌋",
    description: "Impatient, vif, électrique.",
    hint: "Exprime tes frustrations clairement. Sois direct, sans filtre.",
    color: "#ef4444",
    durationOptions: [1, 2, 3]
  },
  {
    id: "curieux",
    name: "Curieux",
    emoji: "🔍",
    description: "Tout est terrain d'enquête.",
    hint: "Pose des questions. Observe chaque détail. Demande pourquoi.",
    color: "#f59e0b",
    durationOptions: [2, 3, 5]
  },
  {
    id: "mysterieux",
    name: "Mystérieux",
    emoji: "🌑",
    description: "Peu de mots. Présence intense.",
    hint: "Ne réponds pas directement. Laisse les silences exister. Regard fixe.",
    color: "#8b5cf6",
    durationOptions: [2, 3, 5]
  },
  {
    id: "enthousiaste",
    name: "Enthousiaste",
    emoji: "⚡",
    description: "Énergie maximale. Tout t'excite.",
    hint: "Célèbre chaque petite chose. Souris. Montre ton élan.",
    color: "#10b981",
    durationOptions: [2, 3, 5]
  },
  {
    id: "melancolique",
    name: "Mélancolique",
    emoji: "🌧️",
    description: "Lent, pensif, un brin nostalgique.",
    hint: "Contemple. Laisse les pensées s'alourdir. Aucune urgence.",
    color: "#64748b",
    durationOptions: [2, 3, 5]
  },
  {
    id: "espiegle",
    name: "Espiègle",
    emoji: "😈",
    description: "Léger, taquin, imprévisible.",
    hint: "Cherche à surprendre. Ris facilement. Joue avec les règles.",
    color: "#f97316",
    durationOptions: [1, 2, 3]
  },
  {
    id: "serieux",
    name: "Sérieux",
    emoji: "📐",
    description: "Aucune distraction. Précision totale.",
    hint: "Chaque mot compte. Reste rigoureux. Élimine le superflu.",
    color: "#94a3b8",
    durationOptions: [3, 5, 10]
  },
  {
    id: "reveur",
    name: "Rêveur",
    emoji: "☁️",
    description: "Dans ta tête. Lent à atterrir.",
    hint: "Laisse ton esprit vagabonder. Réponds après un silence. Perds-toi.",
    color: "#c084fc",
    durationOptions: [2, 3, 5]
  },
  {
    id: "audacieux",
    name: "Audacieux",
    emoji: "🦁",
    description: "Prend les devants. Ne doute pas.",
    hint: "Parle en premier. Affirme. Assume chaque décision sans excuse.",
    color: "#dc2626",
    durationOptions: [2, 3, 5]
  },
  {
    id: "contemplatif",
    name: "Contemplatif",
    emoji: "🔭",
    description: "Observe plus qu'il n'agit.",
    hint: "Recule. Écoute tout. Ne réagis qu'après avoir tout absorbé.",
    color: "#0ea5e9",
    durationOptions: [3, 5, 10]
  },
  {
    id: "sauvage",
    name: "Sauvage",
    emoji: "🐺",
    description: "Instinctif. Suit ses premières impulsions.",
    hint: "Ne pense pas. Fais. Écoute le corps, pas la tête.",
    color: "#84cc16",
    durationOptions: [1, 2, 3]
  },
  // ── FEUCH EXTRAS — états extrêmes / chaotiques ────────────────────────────
  {
    id: "dingue",
    name: "Complètement Dingue",
    emoji: "🤪",
    description: "Déchaîné. Zéro filtre. Maximum volume.",
    hint: "Exagère tout. Réactions outsizées. Ris de rien. Fais n'importe quoi.",
    color: "#ec4899",
    durationOptions: [1, 2, 3]
  },
  {
    id: "hypnotise",
    name: "Hypnotisé",
    emoji: "🌀",
    description: "En transe douce. Le monde est lent et étrange.",
    hint: "Parle lentement. Regarde les gens trop longtemps. Répète les mots des autres.",
    color: "#7c3aed",
    durationOptions: [2, 3, 5]
  },
  {
    id: "supervillain",
    name: "Super-Méchant",
    emoji: "💀",
    description: "Ton plan est en marche. Tu domines tout.",
    hint: "Monologue intérieur de domination mondiale. Ris méchamment. Sois condescendant mais élégant.",
    color: "#111827",
    durationOptions: [1, 2, 3]
  },
  {
    id: "philosophe_ivre",
    name: "Philosophe Ivre",
    emoji: "🍷",
    description: "Des questions profondes. Une cohérence douteuse.",
    hint: "Pose des questions existentielles sur des trucs banals. Cite des gens que tu inventes.",
    color: "#b45309",
    durationOptions: [2, 3, 5]
  },
  {
    id: "glitch",
    name: "En Glitch",
    emoji: "📡",
    description: "Ton cerveau freeze. Tu bégaies de l'âme.",
    hint: "Commence des phrases et ne les termine pas. Change de sujet au milieu. Regarde dans le vide.",
    color: "#06b6d4",
    durationOptions: [1, 2, 3]
  },
  {
    id: "prophete",
    name: "Le Prophète",
    emoji: "🔮",
    description: "Tu vois ce que les autres ne voient pas encore.",
    hint: "Parle en métaphores. Annonce des choses vagues mais intenses. Sois dramatique.",
    color: "#a78bfa",
    durationOptions: [2, 3, 5]
  },
  {
    id: "bebe_adulte",
    name: "Bébé Adulte",
    emoji: "🍼",
    description: "Tu es un enfant de 2 ans dans un corps adulte.",
    hint: "Tout te fascine. Montre les choses avec le doigt. Dis ce que tu veux sans diplomatie.",
    color: "#f472b6",
    durationOptions: [1, 2, 3]
  },
  {
    id: "deteste_tout",
    name: "Déteste Tout",
    emoji: "😤",
    description: "Tout est trop lent, trop con, trop banal.",
    hint: "Soupire fort. Commentaire acide sur chaque chose. Mais sans agressivité — juste épuisé par la médiocrité.",
    color: "#dc2626",
    durationOptions: [1, 2, 3]
  },
  {
    id: "alien",
    name: "Alien Curieux",
    emoji: "👽",
    description: "Tu discovers la Terre pour la première fois.",
    hint: "Tout est étrange et fascinant. Demande 'pourquoi les humains font ça ?' Observe comme si c'était la première fois.",
    color: "#4ade80",
    durationOptions: [2, 3, 5]
  },
  {
    id: "mime",
    name: "Mime",
    emoji: "🤫",
    description: "Le silence est ton langage.",
    hint: "Ne parle pas. Communique uniquement par gestes et expressions. Montre avec les mains.",
    color: "#e2e8f0",
    durationOptions: [1, 2, 3]
  },
  {
    id: "robot",
    name: "Robot",
    emoji: "🤖",
    description: "Logique pure. Zéro émotion.",
    hint: "Ton seul objectif est l'efficacité. Aucune empathie. Analyse tout. Parle en bullet points.",
    color: "#94a3b8",
    durationOptions: [2, 3, 5]
  },
];

export const PSYCHO_PROFILES: PsychoProfile[] = [
  {
    id: "explorateur",
    name: "L'Explorateur",
    emoji: "🌍",
    archetype: "Curiosité radicale",
    essence: "Tout est terrain d'enquête. Tu cherches ce que personne ne voit encore.",
    traits: [
      "Questionne ce qui te semble évident",
      "Cherche une perspective nouvelle sur chaque situation",
      "Accepte l'inconfort de ne pas savoir",
      "Note ce qui t'étonne, même le banal"
    ],
    color: "#3b82f6",
    durationOptions: [15, 30, 45, 60, 90]
  },
  {
    id: "visionnaire",
    name: "Le Visionnaire",
    emoji: "🔭",
    archetype: "Pensée systémique",
    essence: "Tu connectes ce que les autres voient séparément. Le futur est ton terrain.",
    traits: [
      "Pense à long terme, pas à l'immédiat",
      "Cherche les patterns derrière les événements",
      "Exprime une idée grande, même si elle est floue",
      "Ignore les détails qui freinent la vision"
    ],
    color: "#8b5cf6",
    durationOptions: [30, 45, 60, 90]
  },
  {
    id: "rebelle",
    name: "Le Rebelle",
    emoji: "🔥",
    archetype: "Transgression créative",
    essence: "Tu remets en cause ce qu'on accepte sans y penser. La norme est une invitation à dévier.",
    traits: [
      "Questionne chaque règle implicite autour de toi",
      "Choisis la voie non-conventionnelle quand tu peux",
      "Exprime un désaccord que tu retiens d'habitude",
      "Refuse une contrainte que tu subissais sans la nommer"
    ],
    color: "#f97316",
    durationOptions: [15, 30, 45, 60]
  },
  {
    id: "sage",
    name: "Le Sage",
    emoji: "🦉",
    archetype: "Clarté et recul",
    essence: "Tu cherches la vérité derrière l'évidence. Agir vient après comprendre.",
    traits: [
      "Observe avant de réagir",
      "Parle moins. Écoute jusqu'au bout.",
      "Cherche ce qui est vrai plutôt que ce qui est rassurant",
      "Pose une question qui déplace la conversation"
    ],
    color: "#eab308",
    durationOptions: [30, 45, 60, 90]
  },
  {
    id: "artisan",
    name: "L'Artisan",
    emoji: "🛠️",
    archetype: "Valeur dans le faire",
    essence: "Tu construis. La valeur est dans l'acte, pas dans la planification.",
    traits: [
      "Fais quelque chose de concret chaque heure",
      "Améliore ce que tu touches, même légèrement",
      "Refuse les réunions et discussions stériles",
      "Mesure ta journée à ce que tu as produit"
    ],
    color: "#a855f7",
    durationOptions: [30, 45, 60, 90]
  },
  {
    id: "guerrier",
    name: "Le Guerrier",
    emoji: "⚔️",
    archetype: "Discipline absolue",
    essence: "Le focus est ta seule ressource. La distraction est l'ennemi.",
    traits: [
      "Élimine les distractions sans négocier",
      "Fais ce que tu as décidé, malgré l'envie d'arrêter",
      "Travaille par blocs de concentration totale",
      "Tiens ta parole envers toi-même"
    ],
    color: "#ef4444",
    durationOptions: [30, 45, 60, 90]
  },
  {
    id: "enchanteur",
    name: "L'Enchanteur",
    emoji: "✨",
    archetype: "Magie du lien",
    essence: "Tu rends le banal mémorable. Tu connectes les gens à quelque chose de plus grand.",
    traits: [
      "Crée une atmosphère dans chaque interaction",
      "Offre quelque chose d'inattendu à une personne",
      "Rends une situation ordinaire un peu magique",
      "Connecte deux personnes qui devaient se rencontrer"
    ],
    color: "#ec4899",
    durationOptions: [15, 30, 45, 60]
  },
  {
    id: "enfant",
    name: "L'Enfant",
    emoji: "🎈",
    archetype: "Jeu et émerveillement",
    essence: "Tu accèdes au monde sans filtre. Zéro cynisme. Tout est encore possible.",
    traits: [
      "Prends une chose ordinaire avec émerveillement",
      "Joue sans justification ni objectif",
      "Dis ce que tu penses sans autocensure",
      "Ris facilement. Autorise-toi à être absurde."
    ],
    color: "#10b981",
    durationOptions: [15, 30, 45, 60]
  },
  {
    id: "souverain",
    name: "Le Souverain",
    emoji: "👑",
    archetype: "Structure et gouvernance",
    essence: "Tu décides. Tu structures. Tu gouvernes ton espace avec clarté.",
    traits: [
      "Prends une décision que tu remettais à plus tard",
      "Définis les règles de ton espace sans t'excuser",
      "Délègue ou élimine ce qui n'est pas ton rôle",
      "Pose une limite claire face à quelque chose qui te déborde"
    ],
    color: "#d97706",
    durationOptions: [30, 45, 60, 90]
  },
  {
    id: "createur",
    name: "Le Créateur",
    emoji: "🎨",
    archetype: "Expression pure",
    essence: "Tu donnes une forme à l'invisible. Originalité avant perfection.",
    traits: [
      "Exprime quelque chose sans te soucier du résultat",
      "Casse un schéma répétitif dans ta façon de faire",
      "Crée quelque chose d'unique, même petit",
      "Partage ce que tu fais sans attendre qu'il soit parfait"
    ],
    color: "#06b6d4",
    durationOptions: [15, 30, 45, 60, 90]
  }
];

// Generate a palette of 3–5 unique characters with random durations
export function generatePalette(count = 4): { character: Character; minutes: number }[] {
  const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(c => ({
    character: c,
    minutes: c.durationOptions[Math.floor(Math.random() * c.durationOptions.length)]
  }));
}
