// ── Language types ─────────────────────────────────────────────────────────────

export type Lang = 'fr' | 'en' | 'es';

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

// ── Atmospheric phrases ────────────────────────────────────────────────────────

export const ATMOSPHERIC_PHRASES: Record<Lang, string[]> = {
  fr: [
    "Tu hésites trop. Lance.",
    "Le mouvement bat la spirale.",
    "Une seule chose. Maintenant.",
    "Le chaos, mais curatif.",
    "Une décision moyenne vaut mieux que rien.",
    "L'inertie, c'est l'ennemi.",
    "Lance d'abord. Réfléchis après.",
    "Le dé n'attend pas.",
  ],
  en: [
    "You hesitate too much. Roll.",
    "Movement beats the spiral.",
    "One thing. Right now.",
    "Chaos, but the healing kind.",
    "A bad decision beats no decision.",
    "Inertia is the enemy.",
    "Launch first. Think later.",
    "The dice doesn't wait.",
  ],
  es: [
    "Dudas demasiado. Lanza.",
    "El movimiento vence a la espiral.",
    "Una sola cosa. Ahora.",
    "El caos, pero del tipo curativo.",
    "Una mala decisión vale más que ninguna.",
    "La inercia es el enemigo.",
    "Lanza primero. Piensa después.",
    "El dado no espera.",
  ],
};

// ── UI strings ─────────────────────────────────────────────────────────────────

export const UI = {
  fr: {
    // Header
    headerTitle: "Blacklace",
    ariaHome: "Retour à l'accueil",
    ariaInfo: "À propos",
    // Mode select
    modeSelectSubtitle: "Choisis ton mode de jeu",
    modeActions: "Actions",
    modeActionsTag: "Mission concrète",
    modeActionsDesc: "Lance le dé. Reçois une mission. Démarre un timer et agis.",
    modeActionsKeywords: "Simple · Efficace",
    modeChars: "FEUCH",
    modeCharsTag: "Chaos maîtrisé",
    modeCharsDesc: "Le dé tire une palette d'états à incarner l'un après l'autre — du plus calme au plus complètement dingue.",
    modeCharsKeywords: "Chaos · Vivant",
    modeProfil: "Profil",
    modeProfilTag: "Archétype du jour",
    modeProfilDesc: "Tire un profil psychologique à incarner en profondeur sur une durée longue.",
    modeProfilKeywords: "Immersion · Exploration de soi",
    // Stats bar
    statSessions: "Sessions",
    statStreak: "Série",
    statStreakUnit: "j",
    // Actions home
    actionsTagline: '"Structure ton chaos."',
    rollBtn: "Lancer le dé",
    doubleRollBtn: "Double lancer",
    doubleRollSub: "2 catégories · mission combo",
    // Rolling
    rollingSingle: "Tirage en cours…",
    rollingDouble: "Double tirage…",
    rollingDoubleHint: "Combinaison de deux univers",
    rollingChar: "Génération de la palette…",
    rollingProfil: "Tirage du profil…",
    // Result
    examplesLabel: "Exemples",
    pickExampleBtn: "Laisser le dé choisir",
    rePickExampleBtn: "Rechoisir",
    pickingMsg: "Le dé tranche…",
    missionTag: "← mission",
    rerollBtn: "Relancer le dé",
    newComboBtn: "Nouveau combo",
    comboDetailLabel: "Action concrète",
    // Duration picker
    durationLabel: "durée",
    durationUnit: "min",
    pickingDot: "…",
    startBtn: (n: number) => `Démarrer ${n} min`,
    // Timer
    pauseBtn: "Pause",
    resumeBtn: "Reprendre",
    doneBtn: "Terminer",
    cancelMission: "Annuler la mission",
    cancelBtn: "Annuler",
    // Char home
    charHomeTitle: "FEUCH",
    charHomeDesc: "Le dé génère une palette de 4 états — certains calmes, certains complètement foutus. Tu incarnes chacun à la suite.",
    charGenerateBtn: "Générer",
    charGenerateSub: "ma palette",
    charHowTitle: "Comment ça marche",
    charHowSteps: [
      "4 personnages tirés au sort",
      "Chacun a une durée courte (1–10 min)",
      "Tu incarnes chaque état l'un après l'autre",
      "Compte sur toi pour vraiment jouer le jeu",
    ],
    // Char palette
    charPaletteTitle: "Ta palette",
    charPaletteTotal: (total: number, count: number) => `${total} min au total · ${count} personnages`,
    charStartBtn: "Commencer la palette",
    charRegenBtn: "Regénérer",
    // Char timer
    charProgress: (cur: number, total: number) => `Personnage ${cur}/${total}`,
    charNextLabel: "Ensuite :",
    charSkipBtn: "Suivant",
    charSeeBtn: "Voir la palette",
    // Profil home
    profilHomeTitle: "Profil",
    profilHomeDesc: "Un archétype psychologique à incarner en profondeur pour une durée longue.",
    profilRollBtn: "Tirer mon profil",
    profilExamplesLabel: "Exemples de profils",
    profilExamples: [
      "L'Explorateur — Curiosité radicale",
      "Le Guerrier — Discipline absolue",
      "L'Enfant — Jeu et émerveillement",
      "Le Souverain — Structure et gouvernance",
    ],
    // Profil result
    profilTraitsLabel: "Ce que tu appliques",
    profilRerollBtn: "Tirer un autre profil",
    // Profil timer
    profilReminderLabel: "Rappel — Ce que tu incarnes",
    // Eval
    evalTitle: "Bilan honnête",
    evalSubtitle: "Comment as-tu réalisé cette session ?",
    evalOptions: [
      { label: "Mission accomplie", desc: "J'ai suivi les consignes à la lettre." },
      { label: "En grande partie", desc: "J'ai fait l'essentiel, pas tout." },
      { label: "Peu respecté", desc: "J'ai à peine suivi les consignes." },
      { label: "Pas du tout", desc: "Je n'ai pas réalisé la mission." },
    ],
    evalSkip: "Passer",
    // Success
    successTitle: "Bien joué.",
    successTitleFeuch: "FEUCH. ACCOMPLI.",
    successMsgActions: "Tu as bougé. L'inertie est brisée.",
    successMsgChars: "T'as traversé tout ça sans fondre. Impressionnant.",
    successMsgFeuch: "Plusieurs versions de toi. Toutes incarnées. Zéro excuse.",
    successMsgProfil: "Tu as incarné ton profil.",
    successStreak: (n: number) => `🔥 Série : ${n} jours`,
    successChooseModeBtn: "Choisir un mode",
    successRerollBtn: "Relancer le dé",
    successNewPaletteBtn: "Relancer le chaos",
    successNewProfilBtn: "Nouveau profil",
    successHomeBtn: "Retour à l'accueil",
  },

  en: {
    headerTitle: "Blacklace",
    ariaHome: "Back to home",
    ariaInfo: "About",
    modeSelectSubtitle: "Choose your game mode",
    modeActions: "Actions",
    modeActionsTag: "Concrete mission",
    modeActionsDesc: "Roll the die. Get a mission. Start a timer and act.",
    modeActionsKeywords: "Simple · Effective",
    modeChars: "FEUCH",
    modeCharsTag: "Controlled chaos",
    modeCharsDesc: "The die draws a palette of states to embody one after another — from calm to completely unhinged.",
    modeCharsKeywords: "Chaos · Alive",
    modeProfil: "Profile",
    modeProfilTag: "Archetype of the day",
    modeProfilDesc: "Draw a psychological profile to embody deeply for a longer duration.",
    modeProfilKeywords: "Immersion · Self-exploration",
    statSessions: "Sessions",
    statStreak: "Streak",
    statStreakUnit: "d",
    actionsTagline: '"Structure your chaos."',
    rollBtn: "Roll the die",
    doubleRollBtn: "Double roll",
    doubleRollSub: "2 categories · combo mission",
    rollingSingle: "Rolling…",
    rollingDouble: "Double roll…",
    rollingDoubleHint: "Combining two worlds",
    rollingChar: "Generating your palette…",
    rollingProfil: "Drawing your profile…",
    examplesLabel: "Examples",
    pickExampleBtn: "Let the die choose",
    rePickExampleBtn: "Re-roll",
    pickingMsg: "The die decides…",
    missionTag: "← mission",
    rerollBtn: "Roll again",
    newComboBtn: "New combo",
    comboDetailLabel: "Concrete action",
    durationLabel: "duration",
    durationUnit: "min",
    pickingDot: "…",
    startBtn: (n: number) => `Start ${n} min`,
    pauseBtn: "Pause",
    resumeBtn: "Resume",
    doneBtn: "Done",
    cancelMission: "Cancel mission",
    cancelBtn: "Cancel",
    charHomeTitle: "FEUCH",
    charHomeDesc: "The die generates a palette of 4 states — some calm, some completely unhinged. You embody each one in turn.",
    charGenerateBtn: "Generate",
    charGenerateSub: "my palette",
    charHowTitle: "How it works",
    charHowSteps: [
      "4 characters drawn at random",
      "Each has a short duration (1–10 min)",
      "You embody each state one after another",
      "It's on you to actually play the game",
    ],
    charPaletteTitle: "Your palette",
    charPaletteTotal: (total: number, count: number) => `${total} min total · ${count} characters`,
    charStartBtn: "Start the palette",
    charRegenBtn: "Regenerate",
    charProgress: (cur: number, total: number) => `Character ${cur}/${total}`,
    charNextLabel: "Next up:",
    charSkipBtn: "Next",
    charSeeBtn: "See palette",
    profilHomeTitle: "Profile",
    profilHomeDesc: "A psychological archetype to embody deeply for a long duration.",
    profilRollBtn: "Draw my profile",
    profilExamplesLabel: "Profile examples",
    profilExamples: [
      "The Explorer — Radical curiosity",
      "The Warrior — Absolute discipline",
      "The Child — Play and wonder",
      "The Sovereign — Structure and governance",
    ],
    profilTraitsLabel: "What you apply",
    profilRerollBtn: "Draw another profile",
    profilReminderLabel: "Reminder — What you embody",
    evalTitle: "Honest debrief",
    evalSubtitle: "How did you complete this session?",
    evalOptions: [
      { label: "Mission accomplished", desc: "I followed the instructions to the letter." },
      { label: "Mostly done", desc: "I did the essentials, not everything." },
      { label: "Barely followed", desc: "I barely followed the instructions." },
      { label: "Not at all", desc: "I didn't complete the mission." },
    ],
    evalSkip: "Skip",
    successTitle: "Well done.",
    successTitleFeuch: "FEUCH. DONE.",
    successMsgActions: "You moved. Inertia is broken.",
    successMsgChars: "You survived the whole palette. Respect.",
    successMsgFeuch: "Multiple versions of you. All embodied. Zero excuses.",
    successMsgProfil: "You embodied your profile.",
    successStreak: (n: number) => `🔥 Streak: ${n} days`,
    successChooseModeBtn: "Choose a mode",
    successRerollBtn: "Roll again",
    successNewPaletteBtn: "More chaos",
    successNewProfilBtn: "New profile",
    successHomeBtn: "Back to home",
  },

  es: {
    headerTitle: "Blacklace",
    ariaHome: "Volver al inicio",
    ariaInfo: "Acerca de",
    modeSelectSubtitle: "Elige tu modo de juego",
    modeActions: "Acciones",
    modeActionsTag: "Misión concreta",
    modeActionsDesc: "Lanza el dado. Recibe una misión. Empieza un timer y actúa.",
    modeActionsKeywords: "Simple · Efectivo",
    modeChars: "FEUCH",
    modeCharsTag: "Caos controlado",
    modeCharsDesc: "El dado genera una paleta de estados a encarnar uno tras otro — algunos tranquilos, otros completamente desquiciados.",
    modeCharsKeywords: "Caos · Vivo",
    modeProfil: "Perfil",
    modeProfilTag: "Arquetipo del día",
    modeProfilDesc: "Extrae un perfil psicológico para encarnar en profundidad durante un tiempo largo.",
    modeProfilKeywords: "Inmersión · Autoexploración",
    statSessions: "Sesiones",
    statStreak: "Racha",
    statStreakUnit: "d",
    actionsTagline: '"Estructura tu caos."',
    rollBtn: "Lanzar el dado",
    doubleRollBtn: "Doble lanzamiento",
    doubleRollSub: "2 categorías · misión combo",
    rollingSingle: "Sorteando…",
    rollingDouble: "Doble sorteo…",
    rollingDoubleHint: "Combinando dos mundos",
    rollingChar: "Generando tu paleta…",
    rollingProfil: "Extrayendo tu perfil…",
    examplesLabel: "Ejemplos",
    pickExampleBtn: "Dejar elegir al dado",
    rePickExampleBtn: "Volver a elegir",
    pickingMsg: "El dado decide…",
    missionTag: "← misión",
    rerollBtn: "Volver a lanzar",
    newComboBtn: "Nuevo combo",
    comboDetailLabel: "Acción concreta",
    durationLabel: "duración",
    durationUnit: "min",
    pickingDot: "…",
    startBtn: (n: number) => `Empezar ${n} min`,
    pauseBtn: "Pausa",
    resumeBtn: "Reanudar",
    doneBtn: "Terminar",
    cancelMission: "Cancelar misión",
    cancelBtn: "Cancelar",
    charHomeTitle: "FEUCH",
    charHomeDesc: "El dado genera una paleta de 4 estados — algunos tranquilos, otros completamente desquiciados. Los encarnas uno a uno.",
    charGenerateBtn: "Generar",
    charGenerateSub: "mi paleta",
    charHowTitle: "Cómo funciona",
    charHowSteps: [
      "4 personajes elegidos al azar",
      "Cada uno tiene una duración corta (1–10 min)",
      "Encarnas cada estado uno tras otro",
      "Depende de ti realmente jugar el juego",
    ],
    charPaletteTitle: "Tu paleta",
    charPaletteTotal: (total: number, count: number) => `${total} min en total · ${count} personajes`,
    charStartBtn: "Comenzar la paleta",
    charRegenBtn: "Regenerar",
    charProgress: (cur: number, total: number) => `Personaje ${cur}/${total}`,
    charNextLabel: "A continuación:",
    charSkipBtn: "Siguiente",
    charSeeBtn: "Ver paleta",
    profilHomeTitle: "Perfil",
    profilHomeDesc: "Un arquetipo psicológico para encarnar en profundidad durante un tiempo largo.",
    profilRollBtn: "Extraer mi perfil",
    profilExamplesLabel: "Ejemplos de perfiles",
    profilExamples: [
      "El Explorador — Curiosidad radical",
      "El Guerrero — Disciplina absoluta",
      "El Niño — Juego y asombro",
      "El Soberano — Estructura y gobernanza",
    ],
    profilTraitsLabel: "Lo que aplicas",
    profilRerollBtn: "Extraer otro perfil",
    profilReminderLabel: "Recordatorio — Lo que encarnas",
    evalTitle: "Balance honesto",
    evalSubtitle: "¿Cómo realizaste esta sesión?",
    evalOptions: [
      { label: "Misión cumplida", desc: "Seguí las instrucciones al pie de la letra." },
      { label: "En gran parte", desc: "Hice lo esencial, no todo." },
      { label: "Poco respetado", desc: "Apenas seguí las instrucciones." },
      { label: "Para nada", desc: "No realicé la misión." },
    ],
    evalSkip: "Omitir",
    successTitle: "¡Bien hecho.",
    successTitleFeuch: "FEUCH. COMPLETADO.",
    successMsgActions: "Te moviste. La inercia está rota.",
    successMsgChars: "Sobreviviste a toda la paleta. Respeto.",
    successMsgFeuch: "Múltiples versiones de ti. Todas encarnadas. Cero excusas.",
    successMsgProfil: "Encarnaste tu perfil.",
    successStreak: (n: number) => `🔥 Racha: ${n} días`,
    successChooseModeBtn: "Elegir un modo",
    successRerollBtn: "Volver a lanzar",
    successNewPaletteBtn: "Más caos",
    successNewProfilBtn: "Nuevo perfil",
    successHomeBtn: "Volver al inicio",
  },
} as const;

export type UIStrings = typeof UI.fr;

// ── Category translations ──────────────────────────────────────────────────────

type CategoryText = {
  title: string; mission: string; feeling: string; examples: string[];
};

const categoryTranslations: Record<Lang, Record<string, CategoryText>> = {
  fr: {
    exploration: { title: "Exploration", mission: "Tu sors. Maintenant.", feeling: "Tu sais que tu dois bouger.", examples: ["Tu te lèves. Maintenant.", "Tu ranges un truc visible.", "Change de pièce. Maintenant.", "Tu fais le premier pas."] },
    build: { title: "Build", mission: "Tu commences. Pas demain.", feeling: "Tu connais le truc à faire.", examples: ["Tu ouvres ce dossier. 2 minutes.", "Tu commences. Pas bien, juste commence.", "Tu écris 3 lignes.", "Tu lances un minuteur. 3 minutes."] },
    contact: { title: "Contact", mission: "Tu envoies ce message.", feeling: "Tu sais à qui penser.", examples: ["Envoie « ça va ? » à quelqu'un.", "Réponds à un message oublié.", "Dis merci à quelqu'un.", "Lance une conversation."] },
    reset: { title: "Reset", mission: "Tu poses tout. 2 minutes.", feeling: "Le bruit suffit.", examples: ["Pose ton téléphone. 2 minutes.", "Respire lentement. 5 cycles.", "Assieds-toi. Ne fais rien.", "Bois de l'eau."] },
    create: { title: "Créer", mission: "Tu fais UNE chose visible.", feeling: "Quelque chose veut sortir.", examples: ["Tu fais UNE chose utile. Là.", "Envoie un vocal.", "Complimente quelqu'un."] },
    chaos: { title: "Chaos", mission: "Tu fais. Pas de plan.", feeling: "Trop calme. Casse-le.", examples: ["Fais un truc sans réfléchir.", "Envoie un message que tu évites.", "Dis ce que tu penses vraiment.", "Fais-le mal, mais fais-le."] },
  },
  en: {
    exploration: { title: "Exploration", mission: "You leave. Now.", feeling: "You know you need to move.", examples: ["Get up. Now.", "Tidy one visible thing.", "Switch rooms. Now.", "Take the first step."] },
    build: { title: "Build", mission: "You start. Not tomorrow.", feeling: "You know what to do.", examples: ["Open that file. 2 minutes.", "Start. Badly, just start.", "Write 3 lines.", "Set a 3-minute timer."] },
    contact: { title: "Contact", mission: "Send that message.", feeling: "You know who to think of.", examples: ["Send \"how are you?\" to someone.", "Reply to a forgotten message.", "Say thanks to someone.", "Start a conversation."] },
    reset: { title: "Reset", mission: "Drop everything. 2 minutes.", feeling: "The noise is enough.", examples: ["Put down your phone. 2 minutes.", "Breathe slowly. 5 cycles.", "Sit down. Do nothing.", "Drink water."] },
    create: { title: "Create", mission: "Make ONE visible thing.", feeling: "Something wants out.", examples: ["Do ONE useful thing. Right there.", "Send a voice note.", "Compliment someone."] },
    chaos: { title: "Chaos", mission: "You act. No plan.", feeling: "Too calm. Break it.", examples: ["Do something without thinking.", "Send the message you've been avoiding.", "Say what you really think.", "Do it badly, but do it."] },
  },
  es: {
    exploration: { title: "Exploración", mission: "Sales. Ahora.", feeling: "Sabes que tienes que moverte.", examples: ["Levántate. Ahora.", "Ordena una cosa visible.", "Cambia de habitación. Ahora.", "Da el primer paso."] },
    build: { title: "Construir", mission: "Empiezas. No mañana.", feeling: "Sabes qué hacer.", examples: ["Abre ese archivo. 2 minutos.", "Empieza. Mal, pero empieza.", "Escribe 3 líneas.", "Pon un temporizador. 3 minutos."] },
    contact: { title: "Contacto", mission: "Envía ese mensaje.", feeling: "Sabes en quién pensar.", examples: ["Envía «¿qué tal?» a alguien.", "Responde a un mensaje olvidado.", "Da las gracias a alguien.", "Inicia una conversación."] },
    reset: { title: "Reset", mission: "Suelta todo. 2 minutos.", feeling: "El ruido es suficiente.", examples: ["Suelta el móvil. 2 minutos.", "Respira lento. 5 ciclos.", "Siéntate. No hagas nada.", "Bebe agua."] },
    create: { title: "Crear", mission: "Haz UNA cosa visible.", feeling: "Algo quiere salir.", examples: ["Haz UNA cosa útil. Ahí.", "Envía un audio.", "Halaga a alguien."] },
    chaos: { title: "Caos", mission: "Actúas. Sin plan.", feeling: "Demasiada calma. Rómpelа.", examples: ["Haz algo sin pensar.", "Envía el mensaje que evitas.", "Di lo que piensas de verdad.", "Hazlo mal, pero hazlo."] },
  },
};

// ── Combo translations ─────────────────────────────────────────────────────────

type ComboText = { label: string; emoji: string; mission: string; detail: string };

const comboTranslations: Record<Lang, Record<string, ComboText>> = {
  fr: {
    "build-chaos": { label: "Mode berserker", emoji: "⚡", mission: "Lance-toi sur un projet sans te préparer. Commence maintenant.", detail: "Ouvre un fichier vierge. Écris ou crée quelque chose sans plan. 20 minutes. Pas de retouches." },
    "build-contact": { label: "Boucle de feedback", emoji: "🔁", mission: "Partage ce sur quoi tu travailles avec une vraie personne.", detail: "Envoie ce que tu fais à quelqu'un. Demande un retour honnête. Pas de perfectionnisme." },
    "build-create": { label: "Livrable visible", emoji: "📦", mission: "Crée quelque chose de concret et rends-le public.", detail: "Travaille 25 min sur quelque chose. Puis publie-le ou envoie-le — même imparfait." },
    "build-exploration": { label: "Nomade productif", emoji: "🗺️", mission: "Sors avec un seul objectif de travail et fais-le ailleurs.", detail: "Prends ton téléphone ou carnet. Va dans un café ou un parc. Avance sur une seule chose." },
    "build-reset": { label: "Sprint & souffle", emoji: "🔋", mission: "25 minutes de focus, puis une pause réelle sans écran.", detail: "Travaille en silence 25 min. Puis pose tout. Respire, étire-toi. Rien d'autre pendant 5 min." },
    "chaos-contact": { label: "Appel sauvage", emoji: "📞", mission: "Appelle quelqu'un à l'improviste. Sans texte. Juste appelle.", detail: "Choisis une personne. Appelle directement. Si ça tombe sur messagerie, laisse un vrai message vocal." },
    "chaos-create": { label: "Brouillon public", emoji: "🎯", mission: "Crée quelque chose en moins de 10 minutes et publie-le sans retouches.", detail: "Un post, une note, un visuel, une vidéo. Moins de 10 min de création. Publié immédiatement." },
    "chaos-exploration": { label: "Sortie sans GPS", emoji: "🧭", mission: "Pars sans destination. Tourne à droite, puis à gauche. Vois où ça mène.", detail: "Sors maintenant. Première intersection : tourne d'un côté aléatoire. Continue 20 minutes. Reviens." },
    "chaos-reset": { label: "Pause absurde", emoji: "🫧", mission: "Fais une chose totalement inutile et agréable. Sans justification.", detail: "Danse dans ta chambre. Lis une page au hasard. Dessine n'importe quoi. 15 minutes. Zéro productivité." },
    "contact-create": { label: "Message sincère", emoji: "💌", mission: "Crée quelque chose pour quelqu'un et envoie-le directement.", detail: "Une note, un audio, un visuel — fait pour une personne précise. Envoyé à cette personne. Maintenant." },
    "contact-exploration": { label: "Rendez-vous imprévu", emoji: "🤝", mission: "Invite quelqu'un à te rejoindre pour une sortie sans plan.", detail: "Envoie un message : 'Tu es libre là ?' Propose de se voir dans l'heure. Accepte le premier oui." },
    "contact-reset": { label: "Check-in humain", emoji: "🌿", mission: "Envoie un message chaleureux à quelqu'un que tu as négligé.", detail: "Pense à une personne que tu n'as pas contactée depuis trop longtemps. Écris-lui. Deux phrases suffisent." },
    "create-exploration": { label: "Carnet de route", emoji: "📸", mission: "Sors et capture quelque chose : photo, note vocale, croquis.", detail: "Marche 15 minutes. Capture ce qui t'interpelle — une image, une idée, un mot. Reviens avec quelque chose." },
    "create-reset": { label: "Flux libre", emoji: "🌊", mission: "Mets de la musique, laisse ton esprit vagabonder, note ce qui émerge.", detail: "Musique sans paroles. Stylo ou téléphone prêt. Écris ce qui vient sans relire. 15 minutes. Rien d'autre." },
    "exploration-reset": { label: "Marche sans but", emoji: "🚶", mission: "Marche lentement, sans écran, sans destination. Juste présent.", detail: "Téléphone en poche, notifications coupées. Marche 20 minutes. Regarde autour. Ne pense à rien d'utile." },
  },
  en: {
    "build-chaos": { label: "Berserker mode", emoji: "⚡", mission: "Start a project without preparing. Begin now.", detail: "Open a blank file. Write or create something with no plan. 20 minutes. No edits." },
    "build-contact": { label: "Feedback loop", emoji: "🔁", mission: "Share what you're working on with a real person.", detail: "Send what you're doing to someone. Ask for honest feedback. No perfectionism." },
    "build-create": { label: "Visible deliverable", emoji: "📦", mission: "Create something concrete and make it public.", detail: "Work 25 min on something. Then publish or send it — even if imperfect." },
    "build-exploration": { label: "Productive nomad", emoji: "🗺️", mission: "Go out with one work goal and do it somewhere else.", detail: "Take your phone or notebook. Go to a café or park. Move forward on one thing." },
    "build-reset": { label: "Sprint & breathe", emoji: "🔋", mission: "25 minutes of focus, then a real screen-free break.", detail: "Work in silence for 25 min. Then put everything down. Breathe, stretch. Nothing else for 5 min." },
    "chaos-contact": { label: "Wild call", emoji: "📞", mission: "Call someone out of the blue. No text. Just call.", detail: "Choose a person. Call directly. If voicemail, leave a real voice message." },
    "chaos-create": { label: "Public draft", emoji: "🎯", mission: "Create something in under 10 minutes and publish it without edits.", detail: "A post, a note, a visual, a video. Under 10 min to create. Published immediately." },
    "chaos-exploration": { label: "GPS-free outing", emoji: "🧭", mission: "Leave with no destination. Turn right, then left. See where it leads.", detail: "Go outside now. First intersection: turn a random way. Keep going 20 minutes. Come back." },
    "chaos-reset": { label: "Absurd break", emoji: "🫧", mission: "Do one totally useless and enjoyable thing. No justification.", detail: "Dance in your room. Read a random page. Draw anything. 15 minutes. Zero productivity." },
    "contact-create": { label: "Sincere message", emoji: "💌", mission: "Create something for someone and send it directly.", detail: "A note, an audio, a visual — made for one specific person. Sent to that person. Now." },
    "contact-exploration": { label: "Surprise meetup", emoji: "🤝", mission: "Invite someone to join you for an unplanned outing.", detail: "Send a message: 'Are you free right now?' Suggest meeting up within the hour. Accept the first yes." },
    "contact-reset": { label: "Human check-in", emoji: "🌿", mission: "Send a warm message to someone you've neglected.", detail: "Think of someone you haven't contacted in too long. Write to them. Two sentences is enough." },
    "create-exploration": { label: "Travel journal", emoji: "📸", mission: "Go out and capture something: photo, voice note, sketch.", detail: "Walk 15 minutes. Capture what catches your eye — an image, an idea, a word. Come back with something." },
    "create-reset": { label: "Free flow", emoji: "🌊", mission: "Put on music, let your mind wander, note what comes up.", detail: "Wordless music. Pen or phone ready. Write what comes without rereading. 15 minutes. Nothing else." },
    "exploration-reset": { label: "Aimless walk", emoji: "🚶", mission: "Walk slowly, no screen, no destination. Just present.", detail: "Phone in pocket, notifications off. Walk 20 minutes. Look around. Think about nothing useful." },
  },
  es: {
    "build-chaos": { label: "Modo berserker", emoji: "⚡", mission: "Empieza un proyecto sin prepararte. Comienza ahora.", detail: "Abre un archivo en blanco. Escribe o crea algo sin plan. 20 minutos. Sin retoques." },
    "build-contact": { label: "Bucle de retroalimentación", emoji: "🔁", mission: "Comparte en qué estás trabajando con una persona real.", detail: "Envía lo que haces a alguien. Pide retroalimentación honesta. Sin perfeccionismo." },
    "build-create": { label: "Entregable visible", emoji: "📦", mission: "Crea algo concreto y hazlo público.", detail: "Trabaja 25 min en algo. Luego publícalo o envíalo — aunque sea imperfecto." },
    "build-exploration": { label: "Nómada productivo", emoji: "🗺️", mission: "Sal con un solo objetivo de trabajo y hazlo en otro lugar.", detail: "Lleva tu teléfono o cuaderno. Ve a un café o parque. Avanza en una sola cosa." },
    "build-reset": { label: "Sprint y respiro", emoji: "🔋", mission: "25 minutos de enfoque, luego una pausa real sin pantalla.", detail: "Trabaja en silencio 25 min. Luego deja todo. Respira, estírate. Nada más durante 5 min." },
    "chaos-contact": { label: "Llamada salvaje", emoji: "📞", mission: "Llama a alguien de improviso. Sin texto. Solo llama.", detail: "Elige a una persona. Llama directamente. Si sale el buzón, deja un mensaje de voz real." },
    "chaos-create": { label: "Borrador público", emoji: "🎯", mission: "Crea algo en menos de 10 minutos y publícalo sin retoques.", detail: "Un post, una nota, un visual, un vídeo. Menos de 10 min de creación. Publicado de inmediato." },
    "chaos-exploration": { label: "Salida sin GPS", emoji: "🧭", mission: "Sal sin destino. Gira a la derecha, luego a la izquierda. Ve a dónde lleva.", detail: "Sal ahora. Primera intersección: gira de un lado al azar. Continúa 20 minutos. Regresa." },
    "chaos-reset": { label: "Pausa absurda", emoji: "🫧", mission: "Haz una cosa totalmente inútil y agradable. Sin justificación.", detail: "Baila en tu habitación. Lee una página al azar. Dibuja cualquier cosa. 15 minutos. Cero productividad." },
    "contact-create": { label: "Mensaje sincero", emoji: "💌", mission: "Crea algo para alguien y envíaselo directamente.", detail: "Una nota, un audio, un visual — hecho para una persona específica. Enviado a esa persona. Ahora." },
    "contact-exploration": { label: "Encuentro imprevisto", emoji: "🤝", mission: "Invita a alguien a unirse a una salida sin plan.", detail: "Envía un mensaje: '¿Estás libre ahora?' Propón quedar en una hora. Acepta el primer sí." },
    "contact-reset": { label: "Check-in humano", emoji: "🌿", mission: "Envía un mensaje cálido a alguien que has descuidado.", detail: "Piensa en alguien con quien no has hablado en mucho tiempo. Escríbele. Dos frases bastan." },
    "create-exploration": { label: "Diario de viaje", emoji: "📸", mission: "Sal y captura algo: foto, nota de voz, boceto.", detail: "Camina 15 minutos. Captura lo que te llame la atención — una imagen, una idea, una palabra. Vuelve con algo." },
    "create-reset": { label: "Flujo libre", emoji: "🌊", mission: "Pon música, deja que tu mente divague, anota lo que surge.", detail: "Música sin letra. Bolígrafo o teléfono listo. Escribe lo que venga sin releer. 15 minutos. Nada más." },
    "exploration-reset": { label: "Paseo sin rumbo", emoji: "🚶", mission: "Camina despacio, sin pantalla, sin destino. Solo presente.", detail: "Teléfono en el bolsillo, notificaciones apagadas. Camina 20 minutos. Mira alrededor. No pienses en nada útil." },
  },
};

// ── Character translations ─────────────────────────────────────────────────────

type CharText = { name: string; description: string; hint: string };

const characterTranslations: Record<Lang, Record<string, CharText>> = {
  fr: {
    paisible: { name: "Paisible", description: "Calme profond. Rien ne te presse.", hint: "Ralentis chaque geste. Parle doucement. Respire avant de répondre." },
    enerve: { name: "Énervé", description: "Impatient, vif, électrique.", hint: "Exprime tes frustrations clairement. Sois direct, sans filtre." },
    curieux: { name: "Curieux", description: "Tout est terrain d'enquête.", hint: "Pose des questions. Observe chaque détail. Demande pourquoi." },
    mysterieux: { name: "Mystérieux", description: "Peu de mots. Présence intense.", hint: "Ne réponds pas directement. Laisse les silences exister. Regard fixe." },
    enthousiaste: { name: "Enthousiaste", description: "Énergie maximale. Tout t'excite.", hint: "Célèbre chaque petite chose. Souris. Montre ton élan." },
    melancolique: { name: "Mélancolique", description: "Lent, pensif, un brin nostalgique.", hint: "Contemple. Laisse les pensées s'alourdir. Aucune urgence." },
    espiegle: { name: "Espiègle", description: "Léger, taquin, imprévisible.", hint: "Cherche à surprendre. Ris facilement. Joue avec les règles." },
    serieux: { name: "Sérieux", description: "Aucune distraction. Précision totale.", hint: "Chaque mot compte. Reste rigoureux. Élimine le superflu." },
    reveur: { name: "Rêveur", description: "Dans ta tête. Lent à atterrir.", hint: "Laisse ton esprit vagabonder. Réponds après un silence. Perds-toi." },
    audacieux: { name: "Audacieux", description: "Prend les devants. Ne doute pas.", hint: "Parle en premier. Affirme. Assume chaque décision sans excuse." },
    contemplatif: { name: "Contemplatif", description: "Observe plus qu'il n'agit.", hint: "Recule. Écoute tout. Ne réagis qu'après avoir tout absorbé." },
    sauvage: { name: "Sauvage", description: "Instinctif. Suit ses premières impulsions.", hint: "Ne pense pas. Fais. Écoute le corps, pas la tête." },
    dingue: { name: "Complètement Dingue", description: "Déchaîné. Zéro filtre. Maximum volume.", hint: "Exagère tout. Réactions outsizées. Ris de rien. Fais n'importe quoi." },
    hypnotise: { name: "Hypnotisé", description: "En transe douce. Le monde est lent et étrange.", hint: "Parle lentement. Regarde les gens trop longtemps. Répète les mots des autres." },
    supervillain: { name: "Super-Méchant", description: "Ton plan est en marche. Tu domines tout.", hint: "Monologue intérieur de domination mondiale. Ris méchamment. Sois condescendant mais élégant." },
    philosophe_ivre: { name: "Philosophe Ivre", description: "Des questions profondes. Une cohérence douteuse.", hint: "Pose des questions existentielles sur des trucs banals. Cite des gens que tu inventes." },
    glitch: { name: "En Glitch", description: "Ton cerveau freeze. Tu bégaies de l'âme.", hint: "Commence des phrases et ne les termine pas. Change de sujet au milieu. Regarde dans le vide." },
    prophete: { name: "Le Prophète", description: "Tu vois ce que les autres ne voient pas encore.", hint: "Parle en métaphores. Annonce des choses vagues mais intenses. Sois dramatique." },
    bebe_adulte: { name: "Bébé Adulte", description: "Tu es un enfant de 2 ans dans un corps adulte.", hint: "Tout te fascine. Montre les choses avec le doigt. Dis ce que tu veux sans diplomatie." },
    deteste_tout: { name: "Déteste Tout", description: "Tout est trop lent, trop con, trop banal.", hint: "Soupire fort. Commentaire acide sur chaque chose. Mais sans agressivité — juste épuisé par la médiocrité." },
    alien: { name: "Alien Curieux", description: "Tu découvres la Terre pour la première fois.", hint: "Tout est étrange et fascinant. Demande 'pourquoi les humains font ça ?' Observe comme si c'était la première fois." },
    mime: { name: "Mime", description: "Le silence est ton langage.", hint: "Ne parle pas. Communique uniquement par gestes et expressions. Montre avec les mains." },
    robot: { name: "Robot", description: "Logique pure. Zéro émotion.", hint: "Ton seul objectif est l'efficacité. Aucune empathie. Analyse tout. Parle en bullet points." },
  },
  en: {
    paisible: { name: "Peaceful", description: "Deep calm. Nothing is rushing you.", hint: "Slow down every gesture. Speak softly. Breathe before answering." },
    enerve: { name: "Irritated", description: "Impatient, sharp, electric.", hint: "Express your frustrations clearly. Be direct, no filter." },
    curieux: { name: "Curious", description: "Everything is a field of investigation.", hint: "Ask questions. Observe every detail. Ask why." },
    mysterieux: { name: "Mysterious", description: "Few words. Intense presence.", hint: "Don't answer directly. Let silences exist. Fixed gaze." },
    enthousiaste: { name: "Enthusiastic", description: "Maximum energy. Everything excites you.", hint: "Celebrate every little thing. Smile. Show your momentum." },
    melancolique: { name: "Melancholic", description: "Slow, thoughtful, a touch nostalgic.", hint: "Contemplate. Let thoughts weigh in. No urgency." },
    espiegle: { name: "Playful", description: "Light, teasing, unpredictable.", hint: "Look to surprise. Laugh easily. Play with the rules." },
    serieux: { name: "Serious", description: "No distractions. Total precision.", hint: "Every word counts. Stay rigorous. Eliminate the superfluous." },
    reveur: { name: "Dreamy", description: "In your head. Slow to land.", hint: "Let your mind wander. Answer after a silence. Get lost." },
    audacieux: { name: "Audacious", description: "Takes the lead. Never doubts.", hint: "Speak first. Assert. Own every decision without excuse." },
    contemplatif: { name: "Contemplative", description: "Observes more than acts.", hint: "Step back. Listen to everything. Only react after absorbing it all." },
    sauvage: { name: "Wild", description: "Instinctive. Follows first impulses.", hint: "Don't think. Do. Listen to the body, not the mind." },
    dingue: { name: "Completely Wild", description: "Unleashed. Zero filter. Maximum volume.", hint: "Exaggerate everything. Outsized reactions. Laugh at nothing. Do anything." },
    hypnotise: { name: "Hypnotized", description: "In a soft trance. The world is slow and strange.", hint: "Speak slowly. Stare at people too long. Repeat others' words." },
    supervillain: { name: "Supervillain", description: "Your plan is in motion. You dominate everything.", hint: "Inner monologue of world domination. Laugh wickedly. Be condescending but elegant." },
    philosophe_ivre: { name: "Drunk Philosopher", description: "Deep questions. Doubtful coherence.", hint: "Ask existential questions about mundane things. Quote people you invent." },
    glitch: { name: "Glitching", description: "Your brain freezes. You stutter from the soul.", hint: "Start sentences and don't finish them. Change topic mid-thought. Stare into the void." },
    prophete: { name: "The Prophet", description: "You see what others can't yet.", hint: "Speak in metaphors. Announce vague but intense things. Be dramatic." },
    bebe_adulte: { name: "Adult Baby", description: "You're a 2-year-old in an adult body.", hint: "Everything fascinates you. Point at things. Say what you want without diplomacy." },
    deteste_tout: { name: "Hates Everything", description: "Everything is too slow, too dumb, too plain.", hint: "Sigh loudly. Snarky comment on everything. But not aggressive — just exhausted by mediocrity." },
    alien: { name: "Curious Alien", description: "You're discovering Earth for the first time.", hint: "Everything is strange and fascinating. Ask 'why do humans do this?' Observe like it's the first time." },
    mime: { name: "Mime", description: "Silence is your language.", hint: "Don't speak. Communicate only through gestures and expressions. Show with your hands." },
    robot: { name: "Robot", description: "Pure logic. Zero emotion.", hint: "Your only goal is efficiency. No empathy. Analyze everything. Speak in bullet points." },
  },
  es: {
    paisible: { name: "Tranquilo", description: "Calma profunda. Nada te apresura.", hint: "Ralentiza cada gesto. Habla suavemente. Respira antes de responder." },
    enerve: { name: "Irritado", description: "Impaciente, vivo, eléctrico.", hint: "Expresa tus frustraciones claramente. Sé directo, sin filtro." },
    curieux: { name: "Curioso", description: "Todo es campo de investigación.", hint: "Haz preguntas. Observa cada detalle. Pregunta por qué." },
    mysterieux: { name: "Misterioso", description: "Pocas palabras. Presencia intensa.", hint: "No respondas directamente. Deja que los silencios existan. Mirada fija." },
    enthousiaste: { name: "Entusiasta", description: "Energía máxima. Todo te emociona.", hint: "Celebra cada pequeña cosa. Sonríe. Muestra tu impulso." },
    melancolique: { name: "Melancólico", description: "Lento, pensativo, un poco nostálgico.", hint: "Contempla. Deja que los pensamientos pesen. Sin urgencia." },
    espiegle: { name: "Travieso", description: "Ligero, burlón, impredecible.", hint: "Busca sorprender. Ríe fácilmente. Juega con las reglas." },
    serieux: { name: "Serio", description: "Sin distracciones. Precisión total.", hint: "Cada palabra cuenta. Mantente riguroso. Elimina lo superfluo." },
    reveur: { name: "Soñador", description: "En tu cabeza. Lento para aterrizar.", hint: "Deja que tu mente divague. Responde después de un silencio. Piérdete." },
    audacieux: { name: "Audaz", description: "Toma la iniciativa. Nunca duda.", hint: "Habla primero. Afirma. Asume cada decisión sin excusas." },
    contemplatif: { name: "Contemplativo", description: "Observa más de lo que actúa.", hint: "Retrocede. Escucha todo. Solo reacciona después de absorberlo todo." },
    sauvage: { name: "Salvaje", description: "Instintivo. Sigue los primeros impulsos.", hint: "No pienses. Actúa. Escucha al cuerpo, no a la mente." },
    dingue: { name: "Completamente Loco", description: "Desatado. Cero filtro. Volumen máximo.", hint: "Exagera todo. Reacciones desmesuradas. Ríe de nada. Haz cualquier cosa." },
    hypnotise: { name: "Hipnotizado", description: "En trance suave. El mundo es lento y extraño.", hint: "Habla despacio. Mira a la gente demasiado tiempo. Repite las palabras de los demás." },
    supervillain: { name: "Supervillano", description: "Tu plan está en marcha. Lo dominas todo.", hint: "Monólogo interior de dominación mundial. Ríe con maldad. Sé condescendiente pero elegante." },
    philosophe_ivre: { name: "Filósofo Ebrio", description: "Preguntas profundas. Coherencia dudosa.", hint: "Haz preguntas existenciales sobre cosas banales. Cita a personas que inventas." },
    glitch: { name: "En Glitch", description: "Tu cerebro se congela. Tartamudeas del alma.", hint: "Empieza frases y no las termines. Cambia de tema en medio. Mira al vacío." },
    prophete: { name: "El Profeta", description: "Ves lo que los demás aún no ven.", hint: "Habla en metáforas. Anuncia cosas vagas pero intensas. Sé dramático." },
    bebe_adulte: { name: "Bebé Adulto", description: "Eres un niño de 2 años en cuerpo de adulto.", hint: "Todo te fascina. Señala las cosas con el dedo. Di lo que quieres sin diplomacia." },
    deteste_tout: { name: "Odia Todo", description: "Todo es demasiado lento, demasiado tonto, demasiado banal.", hint: "Suspira fuerte. Comentario ácido sobre cada cosa. Pero sin agresividad — solo agotado por la mediocridad." },
    alien: { name: "Alien Curioso", description: "Descubres la Tierra por primera vez.", hint: "Todo es extraño y fascinante. Pregunta '¿por qué los humanos hacen esto?' Observa como si fuera la primera vez." },
    mime: { name: "Mimo", description: "El silencio es tu lenguaje.", hint: "No hables. Comunica solo con gestos y expresiones. Muestra con las manos." },
    robot: { name: "Robot", description: "Lógica pura. Cero emoción.", hint: "Tu único objetivo es la eficiencia. Sin empatía. Analiza todo. Habla en viñetas." },
  },
};

// ── Profile translations ───────────────────────────────────────────────────────

type ProfileText = { name: string; archetype: string; essence: string; traits: string[] };

const profileTranslations: Record<Lang, Record<string, ProfileText>> = {
  fr: {
    explorateur: { name: "L'Explorateur", archetype: "Curiosité radicale", essence: "Tout est terrain d'enquête. Tu cherches ce que personne ne voit encore.", traits: ["Questionne ce qui te semble évident", "Cherche une perspective nouvelle sur chaque situation", "Accepte l'inconfort de ne pas savoir", "Note ce qui t'étonne, même le banal"] },
    visionnaire: { name: "Le Visionnaire", archetype: "Pensée systémique", essence: "Tu connectes ce que les autres voient séparément. Le futur est ton terrain.", traits: ["Pense à long terme, pas à l'immédiat", "Cherche les patterns derrière les événements", "Exprime une idée grande, même si elle est floue", "Ignore les détails qui freinent la vision"] },
    rebelle: { name: "Le Rebelle", archetype: "Transgression créative", essence: "Tu remets en cause ce qu'on accepte sans y penser. La norme est une invitation à dévier.", traits: ["Questionne chaque règle implicite autour de toi", "Choisis la voie non-conventionnelle quand tu peux", "Exprime un désaccord que tu retiens d'habitude", "Refuse une contrainte que tu subissais sans la nommer"] },
    sage: { name: "Le Sage", archetype: "Clarté et recul", essence: "Tu cherches la vérité derrière l'évidence. Agir vient après comprendre.", traits: ["Observe avant de réagir", "Parle moins. Écoute jusqu'au bout.", "Cherche ce qui est vrai plutôt que ce qui est rassurant", "Pose une question qui déplace la conversation"] },
    artisan: { name: "L'Artisan", archetype: "Valeur dans le faire", essence: "Tu construis. La valeur est dans l'acte, pas dans la planification.", traits: ["Fais quelque chose de concret chaque heure", "Améliore ce que tu touches, même légèrement", "Refuse les réunions et discussions stériles", "Mesure ta journée à ce que tu as produit"] },
    guerrier: { name: "Le Guerrier", archetype: "Discipline absolue", essence: "Le focus est ta seule ressource. La distraction est l'ennemi.", traits: ["Élimine les distractions sans négocier", "Fais ce que tu as décidé, malgré l'envie d'arrêter", "Travaille par blocs de concentration totale", "Tiens ta parole envers toi-même"] },
    enchanteur: { name: "L'Enchanteur", archetype: "Magie du lien", essence: "Tu rends le banal mémorable. Tu connectes les gens à quelque chose de plus grand.", traits: ["Crée une atmosphère dans chaque interaction", "Offre quelque chose d'inattendu à une personne", "Rends une situation ordinaire un peu magique", "Connecte deux personnes qui devaient se rencontrer"] },
    enfant: { name: "L'Enfant", archetype: "Jeu et émerveillement", essence: "Tu accèdes au monde sans filtre. Zéro cynisme. Tout est encore possible.", traits: ["Prends une chose ordinaire avec émerveillement", "Joue sans justification ni objectif", "Dis ce que tu penses sans autocensure", "Ris facilement. Autorise-toi à être absurde."] },
    souverain: { name: "Le Souverain", archetype: "Structure et gouvernance", essence: "Tu décides. Tu structures. Tu gouvernes ton espace avec clarté.", traits: ["Prends une décision que tu remettais à plus tard", "Définis les règles de ton espace sans t'excuser", "Délègue ou élimine ce qui n'est pas ton rôle", "Pose une limite claire face à quelque chose qui te déborde"] },
    createur: { name: "Le Créateur", archetype: "Expression pure", essence: "Tu donnes une forme à l'invisible. Originalité avant perfection.", traits: ["Exprime quelque chose sans te soucier du résultat", "Casse un schéma répétitif dans ta façon de faire", "Crée quelque chose d'unique, même petit", "Partage ce que tu fais sans attendre qu'il soit parfait"] },
  },
  en: {
    explorateur: { name: "The Explorer", archetype: "Radical curiosity", essence: "Everything is a field of investigation. You seek what no one sees yet.", traits: ["Question what seems obvious to you", "Find a new perspective on each situation", "Accept the discomfort of not knowing", "Note what surprises you, even the mundane"] },
    visionnaire: { name: "The Visionary", archetype: "Systemic thinking", essence: "You connect what others see separately. The future is your territory.", traits: ["Think long-term, not immediate", "Look for patterns behind events", "Express a big idea, even if vague", "Ignore details that slow the vision"] },
    rebelle: { name: "The Rebel", archetype: "Creative transgression", essence: "You challenge what people accept without thinking. The norm is an invitation to deviate.", traits: ["Question every implicit rule around you", "Choose the non-conventional path when you can", "Express a disagreement you usually hold back", "Refuse a constraint you were enduring without naming it"] },
    sage: { name: "The Sage", archetype: "Clarity and perspective", essence: "You seek truth behind the obvious. Action comes after understanding.", traits: ["Observe before reacting", "Talk less. Listen all the way through.", "Seek what's true rather than reassuring", "Ask a question that shifts the conversation"] },
    artisan: { name: "The Craftsman", archetype: "Value in doing", essence: "You build. Value is in the act, not the planning.", traits: ["Do something concrete every hour", "Improve what you touch, even slightly", "Refuse sterile meetings and discussions", "Measure your day by what you've produced"] },
    guerrier: { name: "The Warrior", archetype: "Absolute discipline", essence: "Focus is your only resource. Distraction is the enemy.", traits: ["Eliminate distractions without negotiating", "Do what you decided, despite the urge to stop", "Work in blocks of total concentration", "Keep your word to yourself"] },
    enchanteur: { name: "The Enchanter", archetype: "Magic of connection", essence: "You make the ordinary memorable. You connect people to something greater.", traits: ["Create an atmosphere in each interaction", "Offer something unexpected to one person", "Make an ordinary situation a little magical", "Connect two people who were meant to meet"] },
    enfant: { name: "The Child", archetype: "Play and wonder", essence: "You access the world without a filter. Zero cynicism. Everything is still possible.", traits: ["Take an ordinary thing with wonder", "Play without justification or goal", "Say what you think without self-censorship", "Laugh easily. Allow yourself to be absurd."] },
    souverain: { name: "The Sovereign", archetype: "Structure and governance", essence: "You decide. You structure. You govern your space with clarity.", traits: ["Make a decision you've been postponing", "Define the rules of your space without apologizing", "Delegate or eliminate what isn't your role", "Set a clear boundary on something overwhelming you"] },
    createur: { name: "The Creator", archetype: "Pure expression", essence: "You give form to the invisible. Originality before perfection.", traits: ["Express something without caring about the result", "Break a repetitive pattern in how you do things", "Create something unique, even small", "Share what you do without waiting for perfection"] },
  },
  es: {
    explorateur: { name: "El Explorador", archetype: "Curiosidad radical", essence: "Todo es campo de investigación. Buscas lo que nadie ve todavía.", traits: ["Cuestiona lo que te parece evidente", "Encuentra una nueva perspectiva en cada situación", "Acepta la incomodidad de no saber", "Anota lo que te sorprende, incluso lo mundano"] },
    visionnaire: { name: "El Visionario", archetype: "Pensamiento sistémico", essence: "Conectas lo que otros ven por separado. El futuro es tu territorio.", traits: ["Piensa a largo plazo, no en lo inmediato", "Busca patrones detrás de los eventos", "Expresa una gran idea, aunque sea vaga", "Ignora los detalles que frenan la visión"] },
    rebelle: { name: "El Rebelde", archetype: "Transgresión creativa", essence: "Cuestionas lo que la gente acepta sin pensar. La norma es una invitación a desviarse.", traits: ["Cuestiona cada regla implícita a tu alrededor", "Elige el camino no convencional cuando puedas", "Expresa un desacuerdo que normalmente guardas", "Rechaza una restricción que soportabas sin nombrarla"] },
    sage: { name: "El Sabio", archetype: "Claridad y perspectiva", essence: "Buscas la verdad detrás de lo evidente. La acción viene después de comprender.", traits: ["Observa antes de reaccionar", "Habla menos. Escucha hasta el final.", "Busca lo que es verdad en lugar de lo tranquilizador", "Haz una pregunta que desplace la conversación"] },
    artisan: { name: "El Artesano", archetype: "Valor en el hacer", essence: "Construyes. El valor está en el acto, no en la planificación.", traits: ["Haz algo concreto cada hora", "Mejora lo que tocas, aunque sea ligeramente", "Rechaza reuniones y discusiones estériles", "Mide tu día por lo que has producido"] },
    guerrier: { name: "El Guerrero", archetype: "Disciplina absoluta", essence: "El enfoque es tu único recurso. La distracción es el enemigo.", traits: ["Elimina las distracciones sin negociar", "Haz lo que decidiste, a pesar de las ganas de parar", "Trabaja en bloques de concentración total", "Cumple tu palabra contigo mismo"] },
    enchanteur: { name: "El Encantador", archetype: "Magia de la conexión", essence: "Haces lo ordinario memorable. Conectas a las personas con algo más grande.", traits: ["Crea una atmósfera en cada interacción", "Ofrece algo inesperado a una persona", "Haz que una situación ordinaria sea un poco mágica", "Conecta a dos personas que debían conocerse"] },
    enfant: { name: "El Niño", archetype: "Juego y asombro", essence: "Accedes al mundo sin filtro. Cero cinismo. Todo sigue siendo posible.", traits: ["Toma algo ordinario con asombro", "Juega sin justificación ni objetivo", "Di lo que piensas sin autocensura", "Ríe fácilmente. Permítete ser absurdo."] },
    souverain: { name: "El Soberano", archetype: "Estructura y gobernanza", essence: "Decides. Estructuras. Gobiernas tu espacio con claridad.", traits: ["Toma una decisión que has estado posponiendo", "Define las reglas de tu espacio sin disculparte", "Delega o elimina lo que no es tu rol", "Establece un límite claro ante algo que te desborda"] },
    createur: { name: "El Creador", archetype: "Expresión pura", essence: "Das forma a lo invisible. Originalidad antes que perfección.", traits: ["Expresa algo sin preocuparte por el resultado", "Rompe un patrón repetitivo en tu forma de hacer", "Crea algo único, aunque sea pequeño", "Comparte lo que haces sin esperar a que sea perfecto"] },
  },
};

// ── InfoModal translations ─────────────────────────────────────────────────────

export const INFO_TEXT = {
  fr: {
    title: "Blacklace Dice",
    tagline: '"Structure ton chaos."',
    conceptTitle: "Le concept",
    concept1: "Blacklace Dice part d'un constat simple : la paralysie vient souvent de trop de contrôle. On réfléchit, on reporte, on optimise — et on n'agit pas.",
    concept1bold: "la paralysie vient souvent de trop de contrôle",
    concept2: "En déléguant une part de ce contrôle à un dé, on court-circuite la résistance interne. Le hasard ne remplace pas ta volonté — il lui donne un point de départ.",
    structureTitle: "Ce que ça structure",
    structureItems: ["Tes actions — en décidant pour toi quand tu bloques", "Tes motivations — en te montrant ce vers quoi tu reviens", "Tes limites — en testant ce que tu es prêt à incarner", "Tes besoins — en révélant les patterns de tes choix", "Ta psychologie — en explorant différentes postures de vie"],
    modesTitle: "Les 4 modes",
    evalTitle: "Auto-évaluation",
    evalText: "À chaque fin de session, l'app te demande comment tu as réalisé la mission. Ce retour honnête avec toi-même est la vraie boussole — pas le timer.",
    creatorTitle: "Le créateur",
    creatorName: "Blacklace",
    creatorRole: "Créateur · Designer · Stratège",
    creatorBio1: "Je conçois des outils qui aident les gens à reprendre le mouvement quand l'esprit bloque. Blacklace Dice est né de ma propre expérience avec la paralysie par l'analyse — et du besoin de structures légères qui libèrent plutôt qu'elles n'imposent.",
    creatorBio1bold: "reprendre le mouvement",
    creatorBio2: "Si cette app résonne avec toi, si tu veux en parler, collaborer, ou aller plus loin — je suis là.",
    ctaBtn: "Prendre contact",
  },
  en: {
    title: "Blacklace Dice",
    tagline: '"Structure your chaos."',
    conceptTitle: "The concept",
    concept1: "Blacklace Dice starts from a simple observation: paralysis often comes from too much control. We think, delay, optimize — and don't act.",
    concept1bold: "paralysis often comes from too much control",
    concept2: "By delegating part of that control to a die, we short-circuit internal resistance. Chance doesn't replace your will — it gives it a starting point.",
    structureTitle: "What it structures",
    structureItems: ["Your actions — by deciding for you when you're stuck", "Your motivations — by showing what you keep coming back to", "Your limits — by testing what you're willing to embody", "Your needs — by revealing patterns in your choices", "Your psychology — by exploring different life postures"],
    modesTitle: "The 4 modes",
    evalTitle: "Self-evaluation",
    evalText: "At the end of each session, the app asks how you completed the mission. This honest self-reflection is the real compass — not the timer.",
    creatorTitle: "The creator",
    creatorName: "Blacklace",
    creatorRole: "Creator · Designer · Strategist",
    creatorBio1: "I design tools that help people get moving again when the mind blocks. Blacklace Dice was born from my own experience with analysis paralysis — and the need for light structures that liberate rather than impose.",
    creatorBio1bold: "get moving again",
    creatorBio2: "If this app resonates with you, if you want to talk, collaborate, or go further — I'm here.",
    ctaBtn: "Get in touch",
  },
  es: {
    title: "Blacklace Dice",
    tagline: '"Estructura tu caos."',
    conceptTitle: "El concepto",
    concept1: "Blacklace Dice parte de una observación simple: la parálisis viene a menudo de demasiado control. Pensamos, postergamos, optimizamos — y no actuamos.",
    concept1bold: "la parálisis viene a menudo de demasiado control",
    concept2: "Al delegar parte de ese control a un dado, cortocircuitamos la resistencia interna. El azar no reemplaza tu voluntad — le da un punto de partida.",
    structureTitle: "Lo que estructura",
    structureItems: ["Tus acciones — decidiendo por ti cuando estás bloqueado", "Tus motivaciones — mostrándote a qué vuelves siempre", "Tus límites — probando lo que estás dispuesto a encarnar", "Tus necesidades — revelando patrones en tus elecciones", "Tu psicología — explorando diferentes posturas de vida"],
    modesTitle: "Los 4 modos",
    evalTitle: "Autoevaluación",
    evalText: "Al final de cada sesión, la app te pregunta cómo realizaste la misión. Esta reflexión honesta contigo mismo es la verdadera brújula — no el timer.",
    creatorTitle: "El creador",
    creatorName: "Blacklace",
    creatorRole: "Creador · Diseñador · Estratega",
    creatorBio1: "Diseño herramientas que ayudan a las personas a retomar el movimiento cuando la mente bloquea. Blacklace Dice nació de mi propia experiencia con la parálisis por análisis — y de la necesidad de estructuras ligeras que liberan en lugar de imponer.",
    creatorBio1bold: "retomar el movimiento",
    creatorBio2: "Si esta app resuena contigo, si quieres hablar, colaborar o ir más lejos — estoy aquí.",
    ctaBtn: "Contactar",
  },
};

// ── Public accessor functions ──────────────────────────────────────────────────

export function getUI(lang: Lang): UIStrings {
  return UI[lang];
}

export function getAtmosphericPhrases(lang: Lang): string[] {
  return ATMOSPHERIC_PHRASES[lang];
}

export function getCategoryText(id: string, lang: Lang): CategoryText {
  return categoryTranslations[lang][id] ?? categoryTranslations.fr[id];
}

export function getComboText(id1: string, id2: string, lang: Lang): ComboText | null {
  const key = [id1, id2].sort().join('-');
  return comboTranslations[lang][key] ?? comboTranslations.fr[key] ?? null;
}

export function getCharacterText(id: string, lang: Lang): CharText {
  return characterTranslations[lang][id] ?? characterTranslations.fr[id];
}

export function getProfileText(id: string, lang: Lang): ProfileText {
  return profileTranslations[lang][id] ?? profileTranslations.fr[id];
}

export function getInfoText(lang: Lang) {
  return INFO_TEXT[lang];
}

// ── Blacklace spirit phrases ───────────────────────────────────────────────────

export const SPIRIT_PHRASES: Record<Lang, string[]> = {
  fr: ["Le dé a parlé.", "C'est maintenant.", "Pas d'excuse.", "Tu sais quoi faire.", "Ton tour.", "Aucune hésitation."],
  en: ["The die has spoken.", "It's now.", "No excuses.", "You know what to do.", "Your turn.", "No hesitation."],
  es: ["El dado ha hablado.", "Es ahora.", "Sin excusas.", "Sabes qué hacer.", "Tu turno.", "Sin dudas."],
};

export const SPIRIT_AMBIENT: Record<Lang, string[]> = {
  fr: ["Arrête de penser.", "Pas de détour.", "C'est maintenant.", "Bouge ou reste.", "Ferme l'app et fais-le."],
  en: ["Stop thinking.", "No detour.", "It's now.", "Move or stay.", "Close the app and do it."],
  es: ["Deja de pensar.", "Sin rodeos.", "Es ahora.", "Muévete o quédate.", "Cierra la app y hazlo."],
};

export const SPIRIT_DONE: Record<Lang, string[]> = {
  fr: ["+1 action réelle.", "Tu bouges.", "Ça avance.", "Validé.", "Bien joué.", "Le réel a gagné."],
  en: ["+1 real action.", "You moved.", "It's moving.", "Validated.", "Well played.", "Reality won."],
  es: ["+1 acción real.", "Te mueves.", "Avanza.", "Validado.", "Bien jugado.", "Ganó la realidad."],
};

export const SPIRIT_SKIP: Record<Lang, string[]> = {
  fr: ["Tu le sais.", "Pas cette fois.", "Tu hésites.", "Relance.", "Tu préfères rester comme ça ?"],
  en: ["You know it.", "Not this time.", "You're hesitating.", "Roll again.", "You prefer to stay like this?"],
  es: ["Lo sabes.", "Esta vez no.", "Dudas.", "Relanza.", "¿Prefieres quedarte así?"],
};

// ── Engagement mode ────────────────────────────────────────────────────────────

export const ENGAGE_PRESETS: Record<Lang, string[]> = {
  fr: ["Envoyer ce message.", "Lancer un appel.", "Sortir, là.", "Ouvrir ce dossier.", "Écrire 3 lignes."],
  en: ["Send that message.", "Make that call.", "Go out, now.", "Open that file.", "Write 3 lines."],
  es: ["Enviar ese mensaje.", "Hacer esa llamada.", "Salir, ahora.", "Abrir ese archivo.", "Escribir 3 líneas."],
};

export type EngageModifier = 'refus' | 'light' | 'character' | 'standard' | 'intense' | 'twist';

export const ENGAGE_OUTCOMES: Record<Lang, { face: number; icon: string; label: string; desc: string; modifier: EngageModifier }[]> = {
  fr: [
    { face: 1, icon: "✕", label: "Refus", desc: "Pas maintenant. Tu n'es pas aligné.", modifier: "refus" },
    { face: 2, icon: "◐", label: "Version courte", desc: "Tu le fais. Mais vite.", modifier: "light" },
    { face: 3, icon: "◈", label: "Mode personnage", desc: "Tu le fais. Mais en incarnant un rôle.", modifier: "character" },
    { face: 4, icon: "◆", label: "Standard", desc: "Tu le fais normalement.", modifier: "standard" },
    { face: 5, icon: "⬡", label: "Intensifié", desc: "Tu y vas à fond.", modifier: "intense" },
    { face: 6, icon: "◎", label: "Twist Blacklace", desc: "Tu le fais. Mais avec une contrainte.", modifier: "twist" },
  ],
  en: [
    { face: 1, icon: "✕", label: "Refusal", desc: "Not now. You're not aligned.", modifier: "refus" },
    { face: 2, icon: "◐", label: "Short version", desc: "Do it. But fast.", modifier: "light" },
    { face: 3, icon: "◈", label: "Character mode", desc: "Do it. But embodying a role.", modifier: "character" },
    { face: 4, icon: "◆", label: "Standard", desc: "Do it normally.", modifier: "standard" },
    { face: 5, icon: "⬡", label: "Amplified", desc: "Go all in.", modifier: "intense" },
    { face: 6, icon: "◎", label: "Blacklace Twist", desc: "Do it. But with a constraint.", modifier: "twist" },
  ],
  es: [
    { face: 1, icon: "✕", label: "Rechazo", desc: "Ahora no. No estás alineado.", modifier: "refus" },
    { face: 2, icon: "◐", label: "Versión corta", desc: "Lo haces. Pero rápido.", modifier: "light" },
    { face: 3, icon: "◈", label: "Modo personaje", desc: "Lo haces. Pero encarnando un rol.", modifier: "character" },
    { face: 4, icon: "◆", label: "Estándar", desc: "Lo haces normalmente.", modifier: "standard" },
    { face: 5, icon: "⬡", label: "Intensificado", desc: "Todo a fondo.", modifier: "intense" },
    { face: 6, icon: "◎", label: "Twist Blacklace", desc: "Lo haces. Pero con una restricción.", modifier: "twist" },
  ],
};

export const ENGAGE_TWISTS: Record<Lang, string[]> = {
  fr: ["Sans parler.", "Dans un lieu différent.", "Avec de la musique.", "Sans téléphone.", "En changeant de posture.", "Debout.", "En 2x moins de temps."],
  en: ["Without speaking.", "In a different place.", "With music.", "Without your phone.", "Changing your posture.", "Standing up.", "In half the time."],
  es: ["Sin hablar.", "En un lugar diferente.", "Con música.", "Sin teléfono.", "Cambiando de postura.", "De pie.", "En la mitad del tiempo."],
};

// ── Mood states (pre-mission check) ───────────────────────────────────────────

export interface MoodState { id: string; emoji: string; label: string; sublabel: string; color: string; }

export const MOOD_STATES: Record<Lang, MoodState[]> = {
  fr: [
    { id: 'motivated', emoji: '⚡', label: 'Motivé', sublabel: 'Prêt à agir', color: '#a855f7' },
    { id: 'blocked', emoji: '😤', label: 'Bloqué', sublabel: 'Résistance interne', color: '#ef4444' },
    { id: 'scattered', emoji: '🌀', label: 'Dispersé', sublabel: 'Trop de choses', color: '#f59e0b' },
    { id: 'tired', emoji: '😴', label: 'Fatigué', sublabel: 'Énergie basse', color: '#6366f1' },
    { id: 'charged', emoji: '🔥', label: 'Chargé', sublabel: 'Intensité maximale', color: '#14b8a6' },
  ],
  en: [
    { id: 'motivated', emoji: '⚡', label: 'Motivated', sublabel: 'Ready to act', color: '#a855f7' },
    { id: 'blocked', emoji: '😤', label: 'Blocked', sublabel: 'Inner resistance', color: '#ef4444' },
    { id: 'scattered', emoji: '🌀', label: 'Scattered', sublabel: 'Too much going on', color: '#f59e0b' },
    { id: 'tired', emoji: '😴', label: 'Tired', sublabel: 'Low energy', color: '#6366f1' },
    { id: 'charged', emoji: '🔥', label: 'Charged', sublabel: 'Maximum intensity', color: '#14b8a6' },
  ],
  es: [
    { id: 'motivated', emoji: '⚡', label: 'Motivado', sublabel: 'Listo para actuar', color: '#a855f7' },
    { id: 'blocked', emoji: '😤', label: 'Bloqueado', sublabel: 'Resistencia interna', color: '#ef4444' },
    { id: 'scattered', emoji: '🌀', label: 'Disperso', sublabel: 'Demasiadas cosas', color: '#f59e0b' },
    { id: 'tired', emoji: '😴', label: 'Cansado', sublabel: 'Energía baja', color: '#6366f1' },
    { id: 'charged', emoji: '🔥', label: 'Cargado', sublabel: 'Intensidad máxima', color: '#14b8a6' },
  ],
};

export const MOOD_UI: Record<Lang, { title: string; subtitle: string; skipBtn: string; rollBtn: string }> = {
  fr: { title: "Où tu en es ?", subtitle: "Choisis ton état avant de lancer.", skipBtn: "Passer", rollBtn: "Lancer le dé" },
  en: { title: "Where are you at?", subtitle: "Choose your state before rolling.", skipBtn: "Skip", rollBtn: "Roll the die" },
  es: { title: "¿Cómo estás?", subtitle: "Elige tu estado antes de lanzar.", skipBtn: "Omitir", rollBtn: "Lanzar el dado" },
};

// ── Engagement messages per outcome ───────────────────────────────────────────

export const ENGAGE_MESSAGES: Record<Lang, Record<string, string>> = {
  fr: {
    refus: "Honore ce besoin. L'inertie n'est pas toujours l'ennemi — parfois c'est du discernement.",
    light: "Réduis l'acte à son noyau. L'essentiel suffit. Commence maintenant.",
    character: "Change d'identité le temps d'un acte. Laisse le personnage porter la tâche.",
    standard: "Engagement plein. Sans réserve. Tu sais ce que tu as à faire.",
    intense: "Mode plein. Toute ton énergie dans cet acte unique. Rien d'autre n'existe.",
    twist: "La contrainte révèle ce que le confort cache. Suis-la jusqu'au bout.",
  },
  en: {
    refus: "Honor this need. Inertia isn't always the enemy — sometimes it's discernment.",
    light: "Reduce the act to its core. The essential is enough. Start now.",
    character: "Switch identity for the duration of one act. Let the character carry the task.",
    standard: "Full commitment. No reservation. You know what you have to do.",
    intense: "Full mode. All your energy into this one act. Nothing else exists.",
    twist: "The constraint reveals what comfort hides. Follow it all the way through.",
  },
  es: {
    refus: "Honra esta necesidad. La inercia no siempre es el enemigo — a veces es discernimiento.",
    light: "Reduce el acto a su núcleo. Lo esencial es suficiente. Empieza ahora.",
    character: "Cambia de identidad por la duración de un acto. Deja que el personaje lleve la tarea.",
    standard: "Compromiso total. Sin reservas. Sabes lo que tienes que hacer.",
    intense: "Modo completo. Toda tu energía en este acto único. No existe nada más.",
    twist: "La restricción revela lo que el confort oculta. Síguela hasta el final.",
  },
};

// ── Paywall ────────────────────────────────────────────────────────────────────

export const PAYWALL_UI: Record<Lang, {
  title: string; subtitle: string; desc: string; limitLabel: string;
  cta: string; ctaSub: string; returnBtn: string; playsLeftLabel: (n: number) => string;
}> = {
  fr: {
    title: "Tu veux continuer ?",
    subtitle: "Blacklace t'a lancé.",
    desc: "Continue le mouvement.\nMissions illimitées. 2,90€ / mois. Annulable à tout moment.",
    limitLabel: "Sessions aujourd'hui",
    cta: "Débloquer",
    ctaSub: "prohibitedvlc@gmail.com",
    returnBtn: "Plus tard",
    playsLeftLabel: (n) => n === 1 ? `${n} mission restante aujourd'hui` : `${n} missions restantes aujourd'hui`,
  },
  en: {
    title: "Want to keep going?",
    subtitle: "Blacklace launched you.",
    desc: "Keep the momentum.\nUnlimited missions. €2.90 / month. Cancel anytime.",
    limitLabel: "Sessions today",
    cta: "Unlock",
    ctaSub: "prohibitedvlc@gmail.com",
    returnBtn: "Later",
    playsLeftLabel: (n) => n === 1 ? `${n} mission left today` : `${n} missions left today`,
  },
  es: {
    title: "¿Quieres seguir?",
    subtitle: "Blacklace te lanzó.",
    desc: "Mantén el movimiento.\nMisiones ilimitadas. 2,90€ / mes. Cancelable cuando quieras.",
    limitLabel: "Sesiones hoy",
    cta: "Desbloquear",
    ctaSub: "prohibitedvlc@gmail.com",
    returnBtn: "Más tarde",
    playsLeftLabel: (n) => n === 1 ? `${n} misión restante hoy` : `${n} misiones restantes hoy`,
  },
};

// ── History / chemin ───────────────────────────────────────────────────────────

export const HISTORY_UI: Record<Lang, {
  title: string; subtitle: string; empty: string; clearBtn: string;
  modeLabels: Record<string, string>;
  evalLabels: string[];
  evalColors: string[];
  moodLabel: string;
  noEval: string;
}> = {
  fr: {
    title: "Mon chemin",
    subtitle: "Évaluations & sessions enregistrées",
    empty: "Aucune session enregistrée.\nComplete une mission pour commencer.",
    clearBtn: "Effacer l'historique",
    modeLabels: { actions: "Actions", personnages: "Personnages", profil: "Profil", engagement: "Engagement" },
    evalLabels: ["Mission accomplie", "En grande partie", "Peu respecté", "Pas du tout"],
    evalColors: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444'],
    moodLabel: "État",
    noEval: "Non évalué",
  },
  en: {
    title: "My path",
    subtitle: "Evaluations & recorded sessions",
    empty: "No sessions recorded.\nComplete a mission to begin.",
    clearBtn: "Clear history",
    modeLabels: { actions: "Actions", personnages: "Characters", profil: "Profile", engagement: "Engagement" },
    evalLabels: ["Mission done", "Mostly done", "Barely followed", "Not at all"],
    evalColors: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444'],
    moodLabel: "State",
    noEval: "Not rated",
  },
  es: {
    title: "Mi camino",
    subtitle: "Evaluaciones y sesiones registradas",
    empty: "Sin sesiones registradas.\nCompleta una misión para comenzar.",
    clearBtn: "Borrar historial",
    modeLabels: { actions: "Acciones", personnages: "Personajes", profil: "Perfil", engagement: "Compromiso" },
    evalLabels: ["Misión cumplida", "En gran parte", "Poco respetado", "Para nada"],
    evalColors: ['#22c55e', '#84cc16', '#f59e0b', '#ef4444'],
    moodLabel: "Estado",
    noEval: "Sin evaluar",
  },
};

export const ENGAGE_UI: Record<Lang, {
  modeLabel: string; modeTag: string; modeDesc: string; modeKeywords: string;
  homeTitle: string; homeSubtitle: string; homeCustomPlaceholder: string;
  rollBtn: string; rollSuspense: string;
  resultMission: string; resultRest: string; resultOtherMission: string;
  resultCharLabel: string;
}> = {
  fr: {
    modeLabel: "Engagement", modeTag: "Décision déléguée",
    modeDesc: "Choisis ta mission. Le dé décide si tu t'engages et comment.",
    modeKeywords: "Décision · Engagement",
    homeTitle: "Engagement", homeSubtitle: "Quelle est ta mission ?",
    homeCustomPlaceholder: "Écrire ta propre mission…",
    rollBtn: "Le dé décide", rollSuspense: "Le dé décide si tu t'engages",
    resultMission: "Mission", resultRest: "Repose-toi.", resultOtherMission: "Autre mission",
    resultCharLabel: "Ton personnage",
  },
  en: {
    modeLabel: "Engagement", modeTag: "Delegated decision",
    modeDesc: "Choose your mission. The die decides if you commit and how.",
    modeKeywords: "Decision · Commitment",
    homeTitle: "Engagement", homeSubtitle: "What is your mission?",
    homeCustomPlaceholder: "Write your own mission…",
    rollBtn: "The die decides", rollSuspense: "The die decides if you commit",
    resultMission: "Mission", resultRest: "Rest.", resultOtherMission: "Other mission",
    resultCharLabel: "Your character",
  },
  es: {
    modeLabel: "Compromiso", modeTag: "Decisión delegada",
    modeDesc: "Elige tu misión. El dado decide si te comprometes y cómo.",
    modeKeywords: "Decisión · Compromiso",
    homeTitle: "Compromiso", homeSubtitle: "¿Cuál es tu misión?",
    homeCustomPlaceholder: "Escribe tu propia misión…",
    rollBtn: "El dado decide", rollSuspense: "El dado decide si te comprometes",
    resultMission: "Misión", resultRest: "Descansa.", resultOtherMission: "Otra misión",
    resultCharLabel: "Tu personaje",
  },
};

// ── QCM translations (questions use numeric indices internally) ────────────────

export const QCM_UI: Record<Lang, {
  qcmIntention: { q: string; opts: { emoji: string; label: string; sub: string }[] };
  qcmDirection: { q: string; opts: { emoji: string; label: string; sub: string }[] };
  qcmContext:   { q: string; opts: { emoji: string; label: string }[] };
  findBtn: string;
  resumeMission: string;
  manualMode: string;
  historyLabel: string;
  modeSelected: string;
  adaptedFor: string;
  // Home hero
  heroTitle: string;
  heroSubtitle: string;
  startBtn: string;
  agePlaceholder: string;
  // Age modal
  ageModalTitle: string;
  ageModalSubtitle: string;
  ageModalSkip: string;
  ageGroups: { label: string; range: string; hint: string }[];
  // Mode cards (accordion)
  modes: { label: string; sub: string; tag: string; desc: string; emotionalTag: string; cta: string }[];
  chooseMode: string;
  decideForMe: string;
  decideForMeSub: string;
  manualPick: string;
  frictionTitle: string;
  frictionBody: string;
  frictionConfirm: string;
  frictionCancel: string;
  cancelToastTitle: string;
  cancelToastSub: string;
  tensionTitle: string;
  tensionAccept: string;
  tensionDecline: string;
  // Onboarding preload
  onboardSteps: { icon: string; title: string; body: string }[];
  onboardNext: string;
  onboardStart: string;
}> = {
  fr: {
    qcmIntention: {
      q: "Qu'est-ce qui t'attire en ce moment ?",
      opts: [
        { emoji: '⚡', label: 'Agir', sub: 'Passer à l\'action' },
        { emoji: '🎨', label: 'Créer', sub: 'M\'exprimer librement' },
        { emoji: '🌀', label: 'Calmer', sub: 'Ralentir, souffler' },
        { emoji: '🤝', label: 'Connecter', sub: 'Aller vers les autres' },
      ],
    },
    qcmDirection: {
      q: 'Tu veux amplifier ou transformer ce que tu ressens ?',
      opts: [
        { emoji: '↑', label: 'Amplifier', sub: 'Aller plus loin dans cet état' },
        { emoji: '↺', label: 'Transformer', sub: 'Changer de registre' },
      ],
    },
    qcmContext: {
      q: 'Où tu te trouves en ce moment ?',
      opts: [
        { emoji: '🏠', label: 'Chez moi / seul·e' },
        { emoji: '🌿', label: 'Dehors / en mouvement' },
        { emoji: '👥', label: 'Avec quelqu\'un' },
        { emoji: '📱', label: 'En public' },
      ],
    },
    findBtn: "Trouver ma mission",
    resumeMission: "Reprendre ma mission",
    manualMode: "Mode manuel",
    historyLabel: "Chemin",
    modeSelected: "Mode sélectionné",
    adaptedFor: "Adapté pour :",
    heroTitle: "Tu hésites trop.\nLe dé décide.",
    heroSubtitle: "4 modes. Une mission. Pas d'excuses.",
    startBtn: "Commencer",
    agePlaceholder: "Âge",
    ageModalTitle: "Quel est ton profil ?",
    ageModalSubtitle: "Blacklace adapte les missions et les durées selon ton âge.",
    ageModalSkip: "Passer cette étape",
    ageGroups: [
      { label: 'Ado', range: '13–17 ans', hint: 'Missions courtes (-40%)' },
      { label: 'Jeune adulte', range: '18–29 ans', hint: 'Durées standard' },
      { label: 'Adulte', range: '30–49 ans', hint: 'À ton rythme' },
      { label: 'Senior', range: '50+ ans', hint: 'Tempo doux (+30%)' },
    ],
    modes: [
      { label: 'ACTION', sub: 'Mission concrète', tag: 'Direct · Concret', emotionalTag: 'Brise l\'inertie',
        desc: 'Une tâche courte. Un timer. Tu agis. Pas le temps de réfléchir — juste de faire. Idéal pour les jours où tu tournes en rond depuis trop longtemps.',
        cta: 'Lancer ACTION' },
      { label: 'FEUCH', sub: 'Chaos maîtrisé', tag: 'Chaos · Vivant', emotionalTag: 'Dionysien',
        desc: 'Incarne une séquence d\'états émotionnels au hasard. Joue avec tes humeurs, exagère, improvise. Pour les jours où tu veux sortir de toi-même.',
        cta: 'Lancer FEUCH' },
      { label: 'BELETTE', sub: 'Archétype du jour', tag: 'Profond · Calme', emotionalTag: 'Introspection',
        desc: 'Adopte un profil psychologique fort et vis dedans pendant une durée longue. Pas d\'action — une posture. Pour les jours où tu as besoin de te retrouver.',
        cta: 'Lancer BELETTE' },
      { label: 'SOCIAL', sub: 'Décision déléguée', tag: 'Liens · Audace', emotionalTag: 'Action relationnelle',
        desc: 'Délègue au dé une action sociale que tu remets à plus tard. Message, appel, sortie — le dé décide. Toi tu exécutes. Sans trop réfléchir.',
        cta: 'Lancer SOCIAL' },
    ],
    chooseMode: "ou choisir directement",
    decideForMe: "Décide pour moi",
    decideForMeSub: "Une mission, maintenant. Pas demain.",
    manualPick: "ou je choisis mon mode",
    frictionTitle: "Tu veux vraiment choisir ? 😏",
    frictionBody: "Le concept c'est de pas réfléchir. Mais bon, t'es libre.",
    frictionConfirm: "Oui, je choisis",
    frictionCancel: "Non, décide pour moi",
    cancelToastTitle: "Tu l'as évité.",
    cancelToastSub: "Tu sais pourquoi.",
    tensionTitle: "Tu le fais ?",
    tensionAccept: "Je le fais",
    tensionDecline: "J'esquive",
    onboardSteps: [
      { icon: '⬡', title: 'Tu hésites trop.', body: 'Blacklace décide pour toi. Une mission courte, directe, légèrement inconfortable. Lance le dé. Fais-le.' },
      { icon: '◈', title: '4 modes. 4 vies.', body: 'ACTION pour avancer. FEUCH pour le chaos. BELETTE pour te recentrer. SOCIAL pour connecter.' },
      { icon: '🔒', title: 'Rien ne quitte ton téléphone', body: 'Aucun compte. Aucune donnée envoyée. Tout reste stocké localement, uniquement chez toi.' },
      { icon: '⚡', title: '4 missions gratuites / jour', body: 'Blacklace est gratuit jusqu\'à 4 missions quotidiennes. Au-delà, un abonnement à 2,90€ / mois via PayPal débloque l\'accès illimité. Annulable à tout moment.' },
    ],
    onboardNext: "Suivant",
    onboardStart: "C'est parti",
  },
  en: {
    qcmIntention: {
      q: "What draws you right now?",
      opts: [
        { emoji: '⚡', label: 'Act', sub: 'Get into motion' },
        { emoji: '🎨', label: 'Create', sub: 'Express myself freely' },
        { emoji: '🌀', label: 'Slow down', sub: 'Breathe, settle' },
        { emoji: '🤝', label: 'Connect', sub: 'Reach out to others' },
      ],
    },
    qcmDirection: {
      q: 'Do you want to amplify or transform what you feel?',
      opts: [
        { emoji: '↑', label: 'Amplify', sub: 'Go further into this state' },
        { emoji: '↺', label: 'Transform', sub: 'Shift to a different register' },
      ],
    },
    qcmContext: {
      q: 'Where are you right now?',
      opts: [
        { emoji: '🏠', label: 'Home / alone' },
        { emoji: '🌿', label: 'Outside / moving' },
        { emoji: '👥', label: 'With someone' },
        { emoji: '📱', label: 'In public' },
      ],
    },
    findBtn: "Find my mission",
    resumeMission: "Resume my mission",
    manualMode: "Manual mode",
    historyLabel: "Path",
    modeSelected: "Selected mode",
    adaptedFor: "Adapted for:",
    heroTitle: "You hesitate too much.\nThe dice decides.",
    heroSubtitle: "4 modes. One mission. No excuses.",
    startBtn: "Start",
    agePlaceholder: "Age",
    ageModalTitle: "What's your profile?",
    ageModalSubtitle: "Blacklace adapts missions and durations to your age.",
    ageModalSkip: "Skip this step",
    ageGroups: [
      { label: 'Teen', range: '13–17', hint: 'Shorter missions (-40%)' },
      { label: 'Young adult', range: '18–29', hint: 'Standard durations' },
      { label: 'Adult', range: '30–49', hint: 'At your own pace' },
      { label: 'Senior', range: '50+', hint: 'Gentle tempo (+30%)' },
    ],
    modes: [
      { label: 'ACTION', sub: 'Concrete mission', tag: 'Direct · Fast', emotionalTag: 'Breaks inertia',
        desc: 'One task. One timer. You act. No time to overthink — just do. Perfect for the days you\'ve been stuck in your head way too long.',
        cta: 'Launch ACTION' },
      { label: 'FEUCH', sub: 'Controlled chaos', tag: 'Chaos · Alive', emotionalTag: 'Dionysian',
        desc: 'Embody a random sequence of emotional states. Play with your moods, exaggerate, improvise. For the days you need to step outside yourself.',
        cta: 'Launch FEUCH' },
      { label: 'BELETTE', sub: 'Archetype of the day', tag: 'Deep · Calm', emotionalTag: 'Introspection',
        desc: 'Adopt a strong psychological profile and live inside it for a long stretch. Not action — a posture. For the days you need to find yourself again.',
        cta: 'Launch BELETTE' },
      { label: 'SOCIAL', sub: 'Delegated decision', tag: 'Bonds · Boldness', emotionalTag: 'Relational action',
        desc: 'Let the dice make a social move you\'ve been putting off. A text, a call, a meetup — the dice decides. You execute. No overthinking.',
        cta: 'Launch SOCIAL' },
    ],
    chooseMode: "or choose directly",
    decideForMe: "Decide for me",
    decideForMeSub: "One mission, now. Not tomorrow.",
    manualPick: "or I'll pick a mode",
    frictionTitle: "Sure you want to choose? 😏",
    frictionBody: "The whole point is to stop thinking. But hey, your call.",
    frictionConfirm: "Yes, let me pick",
    frictionCancel: "No, decide for me",
    cancelToastTitle: "You avoided it.",
    cancelToastSub: "You know why.",
    tensionTitle: "Are you doing it?",
    tensionAccept: "I do it",
    tensionDecline: "I dodge",
    onboardSteps: [
      { icon: '⬡', title: 'You hesitate too much.', body: 'Blacklace decides for you. A short, direct, slightly uncomfortable mission. Roll the dice. Do it.' },
      { icon: '◈', title: '4 modes. 4 lives.', body: 'ACTION to move forward. FEUCH for the chaos. BELETTE to go inward. SOCIAL to connect.' },
      { icon: '🔒', title: 'Nothing leaves your phone', body: 'No account needed. No data sent anywhere. Everything stays stored locally, just for you.' },
      { icon: '⚡', title: '4 free missions / day', body: 'Blacklace is free up to 4 daily missions. Beyond that, a subscription at €2.90/month via PayPal unlocks unlimited access. Cancel anytime.' },
    ],
    onboardNext: "Next",
    onboardStart: "Let's go",
  },
  es: {
    qcmIntention: {
      q: '¿Qué te atrae ahora mismo?',
      opts: [
        { emoji: '⚡', label: 'Actuar', sub: 'Ponerme en movimiento' },
        { emoji: '🎨', label: 'Crear', sub: 'Expresarme libremente' },
        { emoji: '🌀', label: 'Calmar', sub: 'Respirar, descansar' },
        { emoji: '🤝', label: 'Conectar', sub: 'Acercarme a otros' },
      ],
    },
    qcmDirection: {
      q: '¿Quieres amplificar o transformar lo que sientes?',
      opts: [
        { emoji: '↑', label: 'Amplificar', sub: 'Ir más lejos en este estado' },
        { emoji: '↺', label: 'Transformar', sub: 'Cambiar de registro' },
      ],
    },
    qcmContext: {
      q: '¿Dónde estás ahora mismo?',
      opts: [
        { emoji: '🏠', label: 'En casa / solo/a' },
        { emoji: '🌿', label: 'Afuera / en movimiento' },
        { emoji: '👥', label: 'Con alguien' },
        { emoji: '📱', label: 'En público' },
      ],
    },
    findBtn: "Encontrar mi misión",
    resumeMission: "Retomar mi misión",
    manualMode: "Modo manual",
    historyLabel: "Camino",
    modeSelected: "Modo seleccionado",
    adaptedFor: "Adaptado para:",
    heroTitle: "Dudas demasiado.\nEl dado decide.",
    heroSubtitle: "4 modos. Una misión. Sin excusas.",
    startBtn: "Empezar",
    agePlaceholder: "Edad",
    ageModalTitle: "¿Cuál es tu perfil?",
    ageModalSubtitle: "Blacklace adapta las misiones y duraciones según tu edad.",
    ageModalSkip: "Omitir este paso",
    ageGroups: [
      { label: 'Adolescente', range: '13–17', hint: 'Misiones cortas (-40%)' },
      { label: 'Joven adulto', range: '18–29', hint: 'Duraciones estándar' },
      { label: 'Adulto', range: '30–49', hint: 'A tu ritmo' },
      { label: 'Senior', range: '50+', hint: 'Tempo suave (+30%)' },
    ],
    modes: [
      { label: 'ACTION', sub: 'Misión concreta', tag: 'Directo · Rápido', emotionalTag: 'Rompe la inercia',
        desc: 'Una tarea. Un temporizador. Actúas. Sin tiempo para pensar — solo hacer. Perfecto para los días en que llevas demasiado tiempo dando vueltas.',
        cta: 'Lanzar ACTION' },
      { label: 'FEUCH', sub: 'Caos controlado', tag: 'Caos · Vivo', emotionalTag: 'Dionisiaco',
        desc: 'Encarna una secuencia aleatoria de estados emocionales. Juega con tus emociones, exagera, improvisa. Para los días en que quieres salir de ti mismo.',
        cta: 'Lanzar FEUCH' },
      { label: 'BELETTE', sub: 'Arquetipo del día', tag: 'Profundo · Calmado', emotionalTag: 'Introspección',
        desc: 'Adopta un perfil psicológico fuerte y vívelo durante un buen rato. No es acción — es una postura. Para los días en que necesitas reencontrarte contigo mismo.',
        cta: 'Lanzar BELETTE' },
      { label: 'SOCIAL', sub: 'Decisión delegada', tag: 'Vínculos · Audacia', emotionalTag: 'Acción relacional',
        desc: 'Deja que el dado tome una decisión social que sigues aplazando. Un mensaje, una llamada, un plan — el dado decide. Tú lo ejecutas. Sin pensarlo demasiado.',
        cta: 'Lanzar SOCIAL' },
    ],
    chooseMode: "o elegir directamente",
    decideForMe: "Decide por mí",
    decideForMeSub: "Una misión, ahora. No mañana.",
    manualPick: "o elijo mi modo",
    frictionTitle: "¿Seguro que quieres elegir? 😏",
    frictionBody: "La idea es dejar de pensar. Pero bueno, es tu decisión.",
    frictionConfirm: "Sí, yo elijo",
    frictionCancel: "No, decide por mí",
    cancelToastTitle: "Lo evitaste.",
    cancelToastSub: "Sabes por qué.",
    tensionTitle: "¿Lo haces?",
    tensionAccept: "Lo hago",
    tensionDecline: "Lo esquivo",
    onboardSteps: [
      { icon: '⬡', title: 'Dudas demasiado.', body: 'Blacklace decide por ti. Una misión corta, directa, ligeramente incómoda. Lanza el dado. Hazlo.' },
      { icon: '◈', title: '4 modos. 4 vidas.', body: 'ACTION para avanzar. FEUCH para el caos. BELETTE para centrarte. SOCIAL para conectar.' },
      { icon: '🔒', title: 'Todo queda en tu teléfono', body: 'Sin cuenta. Sin datos enviados. Todo se almacena localmente, solo para ti.' },
      { icon: '⚡', title: '4 misiones gratuitas / día', body: 'Blacklace es gratuito hasta 4 misiones diarias. A partir de ahí, una suscripción de 2,90€ / mes por PayPal desbloquea el acceso ilimitado. Cancelable en cualquier momento.' },
    ],
    onboardNext: "Siguiente",
    onboardStart: "Empecemos",
  },
};
