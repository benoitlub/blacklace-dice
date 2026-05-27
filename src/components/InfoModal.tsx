import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { Lang } from '@/lib/i18n';
import { getInfoText } from '@/lib/i18n';
import { CyclopsEye, ActionTargetIcon, FeuchHexIcon, BeletteEyeIcon, SocialWaveIcon } from './CyclopsEye';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

const MODES_DATA = [
  {
    label: 'ACTION',
    color: '#a855f7',
    Icon: ActionTargetIcon,
    fr: { sub: 'Mission concrète', desc: 'Une tâche. Un timer. Tu agis. Le dé remplace l\'hésitation par du mouvement.' },
    en: { sub: 'Concrete mission', desc: 'One task. One timer. You act. The die replaces hesitation with momentum.' },
    es: { sub: 'Misión concreta', desc: 'Una tarea. Un temporizador. Actúas. El dado reemplaza la duda con movimiento.' },
  },
  {
    label: 'FEUCH',
    color: '#f97316',
    Icon: FeuchHexIcon,
    fr: { sub: 'Chaos maîtrisé', desc: 'Incarne une séquence d\'états émotionnels au hasard. Exagère. Improvise. Sors de toi-même.' },
    en: { sub: 'Controlled chaos', desc: 'Embody a random sequence of emotional states. Exaggerate. Improvise. Step outside yourself.' },
    es: { sub: 'Caos controlado', desc: 'Encarna una secuencia aleatoria de estados emocionales. Exagera. Improvisa. Sal de ti mismo.' },
  },
  {
    label: 'BELETTE',
    color: '#3b82f6',
    Icon: BeletteEyeIcon,
    fr: { sub: 'Archétype du jour', desc: 'Adopte un profil psychologique fort et vis dedans. Pas d\'action — une posture. Pour te retrouver.' },
    en: { sub: 'Archetype of the day', desc: 'Adopt a strong psychological profile and live inside it. Not action — a posture. To find yourself again.' },
    es: { sub: 'Arquetipo del día', desc: 'Adopta un perfil psicológico fuerte y vívelo. No es acción — es una postura. Para reencontrarte.' },
  },
  {
    label: 'SOCIAL',
    color: '#ec4899',
    Icon: SocialWaveIcon,
    fr: { sub: 'Décision déléguée', desc: 'Délègue au dé une action sociale que tu remets à plus tard. Message, appel, sortie — le dé décide.' },
    en: { sub: 'Delegated decision', desc: 'Let the dice decide a social move you keep putting off. Text, call, meetup — the dice chooses.' },
    es: { sub: 'Decisión delegada', desc: 'Deja que el dado decida una acción social que aplazas. Mensaje, llamada, plan — el dado elige.' },
  },
];

export function InfoModal({ open, onClose, lang }: InfoModalProps) {
  const t = getInfoText(lang);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[92dvh] overflow-y-auto"
            style={{ background: 'hsl(var(--card))', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '28px 28px 0 0' }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>

            {/* ── Hero vectoriel */}
            <div className="relative h-44 overflow-hidden mx-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0e2e 50%, #0d1117 100%)' }}>
              {/* Sacred geometry background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <CyclopsEye size={160} color="#f97316" glow chaos opacity={0.6} />
              </div>
              {/* Floating mode icons */}
              <div className="absolute top-4 left-6 opacity-40">
                <ActionTargetIcon size={28} color="#a855f7" />
              </div>
              <div className="absolute top-3 right-8 opacity-40">
                <SocialWaveIcon size={26} color="#ec4899" />
              </div>
              <div className="absolute bottom-5 left-8 opacity-35">
                <BeletteEyeIcon size={24} color="#3b82f6" />
              </div>
              <div className="absolute bottom-4 right-6 opacity-35">
                <FeuchHexIcon size={26} color="#f97316" />
              </div>
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 100%)' }} />
              {/* Title */}
              <div className="absolute bottom-4 left-5 right-14">
                <h2 className="text-2xl font-display font-bold text-white leading-tight">{t.title}</h2>
                <p className="text-sm text-foreground/60 italic mt-0.5">{t.tagline}</p>
              </div>
              <button onClick={onClose}
                className="absolute top-3 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-foreground/80 hover:text-white hover:bg-foreground/10 transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-12 space-y-10 pt-6">

              {/* Concept */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-primary" />
                  <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-foreground/80">{t.conceptTitle}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {t.concept1.split(t.concept1bold).map((part, i) =>
                    i === 0
                      ? <React.Fragment key={i}>{part}<span className="text-foreground font-medium">{t.concept1bold}</span></React.Fragment>
                      : <React.Fragment key={i}>{part}</React.Fragment>
                  )}
                </p>
                <p className="text-sm text-foreground/70 leading-relaxed">{t.concept2}</p>
                <div className="rounded-2xl px-4 py-4 space-y-2"
                  style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wider font-bold">{t.structureTitle}</p>
                  {t.structureItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground/75">
                      <span className="w-1 h-1 rounded-full bg-primary/60 mt-2 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* 4 Modes */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-primary" />
                  <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-foreground/80">{t.modesTitle}</h3>
                </div>
                <div className="space-y-3">
                  {MODES_DATA.map(m => {
                    const copy = m[lang] ?? m.fr;
                    return (
                      <div key={m.label} className="flex gap-3 rounded-2xl px-3 py-3 items-center"
                        style={{ background: `${m.color}0a`, border: `1px solid ${m.color}25` }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${m.color}10`, border: `1.5px solid ${m.color}35` }}>
                          <m.Icon size={32} color={m.color} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <p className="text-sm font-display font-bold tracking-wider" style={{ color: m.color }}>{m.label}</p>
                          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">{copy.sub}</p>
                          <p className="text-xs text-foreground/65 leading-relaxed">{copy.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Belette mascot interlude — vectoriel */}
              <div className="flex items-center gap-4 rounded-2xl overflow-hidden px-4 py-4"
                style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1.5px solid rgba(59,130,246,0.3)' }}>
                  <BeletteEyeIcon size={44} color="#3b82f6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-display font-bold text-blue-400 uppercase tracking-wider mb-1">Fée Belette</p>
                  <p className="text-xs text-foreground/65 leading-relaxed">
                    {lang === 'fr' ? 'Mascotte BELETTE. Gardienne du chaos intérieur. Elle souffle la magie — toi tu décides quoi en faire.'
                      : lang === 'en' ? 'BELETTE mascot. Guardian of inner chaos. She blows the magic — you decide what to do with it.'
                      : 'Mascota BELETTE. Guardiana del caos interior. Ella sopla la magia — tú decides qué hacer con ella.'}
                  </p>
                </div>
              </div>

              {/* Eval */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-primary" />
                  <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-foreground/80">{t.evalTitle}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{t.evalText}</p>
              </section>

              <div className="h-px bg-foreground/6" />

              {/* Creator */}
              <section className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-primary" />
                  <h3 className="text-sm font-display font-bold uppercase tracking-[0.2em] text-foreground/80">{t.creatorTitle}</h3>
                </div>
                <div className="flex items-center gap-4">
                  {/* Creator avatar — vectoriel */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1a0e2e, #0f1629)', border: '1.5px solid rgba(168,85,247,0.4)' }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                      <CyclopsEye size={58} color="#a855f7" glow opacity={1} />
                    </div>
                    <span className="relative font-display font-bold text-lg tracking-wider"
                      style={{ color: '#a855f7', textShadow: '0 0 12px rgba(168,85,247,0.7)' }}>BL</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">{t.creatorName}</p>
                    <p className="text-xs text-muted-foreground">{t.creatorRole}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {t.creatorBio1.split(t.creatorBio1bold).map((part, i) =>
                    i === 0
                      ? <React.Fragment key={i}>{part}<span className="text-foreground font-medium">{t.creatorBio1bold}</span></React.Fragment>
                      : <React.Fragment key={i}>{part}</React.Fragment>
                  )}
                </p>
                <p className="text-sm text-foreground/70 leading-relaxed">{t.creatorBio2}</p>
                <a href="mailto:prohibitedvlc@gmail.com"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-display font-bold text-sm tracking-wide text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 0 24px -4px rgba(168,85,247,0.6)' }}>
                  <ExternalLink className="w-4 h-4" />
                  {t.ctaBtn}
                </a>
                <p className="text-center text-[10px] text-muted-foreground/50">prohibitedvlc@gmail.com</p>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
