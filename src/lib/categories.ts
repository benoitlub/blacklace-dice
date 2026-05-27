export interface Category {
  id: string;
  emoji: string;
  title: string;
  mission: string;
  feeling: string;
  examples: string[];
  color: string;
}

export interface Combo {
  ids: [string, string]; // sorted alphabetically
  label: string;
  emoji: string;
  mission: string;
  detail: string; // one concrete action sentence
}

export const categories: Category[] = [
  {
    id: "exploration",
    emoji: "🌍",
    title: "Exploration",
    mission: "Sors et brise l'inertie.",
    feeling: "Tu avais besoin de mouvement.",
    examples: [
      "Sors maintenant. Tourne à gauche. Marche 15 min sans but",
      "Va dans un café que tu n'as jamais essayé et reste 20 min",
      "Change de quartier à pied — sans GPS ni destination précise",
      "Entre dans un magasin au hasard et repars avec quelque chose",
      "Fais une photo de quelque chose que tu n'aurais jamais remarqué avant"
    ],
    color: "#3b82f6"
  },
  {
    id: "build",
    emoji: "🛠️",
    title: "Build",
    mission: "Avance sur un projet concret.",
    feeling: "C'est ici que la dynamique commence.",
    examples: [
      "Ouvre un fichier vierge. Écris les 3 prochaines étapes de ton projet",
      "Travaille 25 min sur ton truc le plus urgent — rien d'autre",
      "Envoie le truc que tu aurais dû envoyer depuis 3 jours",
      "Crée une ébauche de quelque chose — imparfaite, mais réelle",
      "Nettoie un onglet ouvert depuis trop longtemps et avance dessus"
    ],
    color: "#a855f7"
  },
  {
    id: "contact",
    emoji: "📡",
    title: "Contact",
    mission: "Reconnecte-toi au monde réel.",
    feeling: "Reconnecte-toi à la réalité.",
    examples: [
      "Appelle quelqu'un — sans texte d'abord, juste appelle",
      "Envoie un compliment sincère à quelqu'un par message",
      "Écris à une personne que tu n'as pas contactée depuis +1 mois",
      "Invite quelqu'un à te rejoindre pour quelque chose dans les 2 heures",
      "Laisse un message vocal impréparé à un ami — sans le relire"
    ],
    color: "#06b6d4"
  },
  {
    id: "reset",
    emoji: "🧘",
    title: "Reset",
    mission: "Calme ton système nerveux.",
    feeling: "Ralentis. Réinitialise-toi.",
    examples: [
      "Pose ton téléphone dans une autre pièce. Respire 5 min",
      "Étire-toi pendant 10 min avec de la musique — aucune pensée productive",
      "Allonge-toi sur le sol 5 min. Rien d'autre",
      "Prends une douche froide ou chaude — puis assieds-toi en silence 3 min",
      "Marche lentement dehors sans écran — regarde juste ce qui t'entoure"
    ],
    color: "#22c55e"
  },
  {
    id: "create",
    emoji: "🎨",
    title: "Créer",
    mission: "Fais quelque chose de visible.",
    feeling: "Exprime-toi.",
    examples: [
      "Écris une pensée courte et publie-la — même si elle est imparfaite",
      "Fais un dessin ou un gribouillage rapide — pas besoin que ce soit bon",
      "Enregistre un audio de 60 secondes sur quelque chose qui t'intéresse",
      "Crée un visuel ou une note en moins de 10 minutes et envoie-la",
      "Écris 5 lignes sur ce que tu ressens maintenant — sans censure"
    ],
    color: "#ec4899"
  },
  {
    id: "chaos",
    emoji: "🔥",
    title: "Chaos",
    mission: "Fais quelque chose de fun, vivant, légèrement inattendu.",
    feeling: "Suis l'étincelle.",
    examples: [
      "Envoie un message vocal dingue à un ami proche — sans te censurer",
      "Fais quelque chose que tu aurais normalement remis à demain — là, maintenant",
      "Essaie de faire rire la prochaine personne que tu vois",
      "Commande quelque chose que tu n'as jamais mangé",
      "Mets ta playlist la plus embarrassante et danse dans ta chambre 3 min",
      "Appelle quelqu'un juste pour lui dire un truc aléatoire que tu penses d'eux"
    ],
    color: "#f97316"
  }
];

// All 15 possible combos (ids sorted alphabetically for lookup)
export const COMBOS: Combo[] = [
  {
    ids: ["build", "chaos"],
    label: "Mode berserker",
    emoji: "⚡",
    mission: "Lance-toi sur un projet sans te préparer. Commence maintenant.",
    detail: "Ouvre un fichier vierge. Écris ou crée quelque chose sans plan. 20 minutes. Pas de retouches."
  },
  {
    ids: ["build", "contact"],
    label: "Boucle de feedback",
    emoji: "🔁",
    mission: "Partage ce sur quoi tu travailles avec une vraie personne.",
    detail: "Envoie ce que tu fais à quelqu'un. Demande un retour honnête. Pas de perfectionnisme."
  },
  {
    ids: ["build", "create"],
    label: "Livrable visible",
    emoji: "📦",
    mission: "Crée quelque chose de concret et rends-le public.",
    detail: "Travaille 25 min sur quelque chose. Puis publie-le ou envoie-le — même imparfait."
  },
  {
    ids: ["build", "exploration"],
    label: "Nomade productif",
    emoji: "🗺️",
    mission: "Sors avec un seul objectif de travail et fais-le ailleurs.",
    detail: "Prends ton téléphone ou carnet. Va dans un café ou un parc. Avance sur une seule chose."
  },
  {
    ids: ["build", "reset"],
    label: "Sprint & souffle",
    emoji: "🔋",
    mission: "25 minutes de focus, puis une pause réelle sans écran.",
    detail: "Travaille en silence 25 min. Puis pose tout. Respire, étire-toi. Rien d'autre pendant 5 min."
  },
  {
    ids: ["chaos", "contact"],
    label: "Appel sauvage",
    emoji: "📞",
    mission: "Appelle quelqu'un à l'improviste. Sans texte. Juste appelle.",
    detail: "Choisis une personne. Appelle directement. Si ça tombe sur messagerie, laisse un vrai message vocal."
  },
  {
    ids: ["chaos", "create"],
    label: "Brouillon public",
    emoji: "🎯",
    mission: "Crée quelque chose en moins de 10 minutes et publie-le sans retouches.",
    detail: "Un post, une note, un visuel, une vidéo. Moins de 10 min de création. Publié immédiatement."
  },
  {
    ids: ["chaos", "exploration"],
    label: "Sortie sans GPS",
    emoji: "🧭",
    mission: "Pars sans destination. Tourne à droite, puis à gauche. Vois où ça mène.",
    detail: "Sors maintenant. Première intersection : tourne d'un côté aléatoire. Continue 20 minutes. Reviens."
  },
  {
    ids: ["chaos", "reset"],
    label: "Pause absurde",
    emoji: "🫧",
    mission: "Fais une chose totalement inutile et agréable. Sans justification.",
    detail: "Danse dans ta chambre. Lis une page au hasard. Dessine n'importe quoi. 15 minutes. Zéro productivité."
  },
  {
    ids: ["contact", "create"],
    label: "Message sincère",
    emoji: "💌",
    mission: "Crée quelque chose pour quelqu'un et envoie-le directement.",
    detail: "Une note, un audio, un visuel — fait pour une personne précise. Envoyé à cette personne. Maintenant."
  },
  {
    ids: ["contact", "exploration"],
    label: "Rendez-vous imprévu",
    emoji: "🤝",
    mission: "Invite quelqu'un à te rejoindre pour une sortie sans plan.",
    detail: "Envoie un message : 'Tu es libre là ?' Propose de se voir dans l'heure. Accepte le premier oui."
  },
  {
    ids: ["contact", "reset"],
    label: "Check-in humain",
    emoji: "🌿",
    mission: "Envoie un message chaleureux à quelqu'un que tu as négligé.",
    detail: "Pense à une personne que tu n'as pas contactée depuis trop longtemps. Écris-lui. Deux phrases suffisent."
  },
  {
    ids: ["create", "exploration"],
    label: "Carnet de route",
    emoji: "📸",
    mission: "Sors et capture quelque chose : photo, note vocale, croquis.",
    detail: "Marche 15 minutes. Capture ce qui t'interpelle — une image, une idée, un mot. Reviens avec quelque chose."
  },
  {
    ids: ["create", "reset"],
    label: "Flux libre",
    emoji: "🌊",
    mission: "Mets de la musique, laisse ton esprit vagabonder, note ce qui émerge.",
    detail: "Musique sans paroles. Stylo ou téléphone prêt. Écris ce qui vient sans relire. 15 minutes. Rien d'autre."
  },
  {
    ids: ["exploration", "reset"],
    label: "Marche sans but",
    emoji: "🚶",
    mission: "Marche lentement, sans écran, sans destination. Juste présent.",
    detail: "Téléphone en poche, notifications coupées. Marche 20 minutes. Regarde autour. Ne pense à rien d'utile."
  },
];

// Lookup a combo by two category IDs (order doesn't matter)
export function getCombo(id1: string, id2: string): Combo | null {
  const key = [id1, id2].sort();
  return COMBOS.find(c => c.ids[0] === key[0] && c.ids[1] === key[1]) ?? null;
}

export const ATMOSPHERIC_PHRASES = [
  "Le mouvement bat la spirale.",
  "Une petite action peut tout changer.",
  "Lance d'abord. Réfléchis après.",
  "Le chaos, mais curatif.",
  "Fais quelque chose. N'importe quoi.",
  "L'inertie n'a pas sa place ici."
];
