'use client';

export interface FontOption {
  family: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'display';
  googleFontName: string;
  weights: number[];
}

export const AVAILABLE_FONTS: FontOption[] = [
  { family: 'Cormorant Garamond, serif', name: 'Cormorant Garamond', category: 'serif', googleFontName: 'Cormorant+Garamond', weights: [400, 500, 600, 700] },
  { family: 'Playfair Display, serif', name: 'Playfair Display', category: 'serif', googleFontName: 'Playfair+Display', weights: [400, 600, 700, 800] },
  { family: 'Cinzel, serif', name: 'Cinzel Decorative', category: 'serif', googleFontName: 'Cinzel', weights: [400, 600, 700, 900] },
  { family: 'Bodoni Moda, serif', name: 'Bodoni Moda', category: 'serif', googleFontName: 'Bodoni+Moda', weights: [400, 600, 700, 800] },
  { family: 'Italiana, serif', name: 'Italiana Couture', category: 'serif', googleFontName: 'Italiana', weights: [400] },
  { family: 'Marcellus, serif', name: 'Marcellus Luxury', category: 'serif', googleFontName: 'Marcellus', weights: [400] },
  { family: 'Libre Baskerville, serif', name: 'Libre Baskerville', category: 'serif', googleFontName: 'Libre+Baskerville', weights: [400, 700] },
  { family: 'Lora, serif', name: 'Lora', category: 'serif', googleFontName: 'Lora', weights: [400, 500, 600, 700] },
  { family: 'Space Grotesk, sans-serif', name: 'Space Grotesk', category: 'sans-serif', googleFontName: 'Space+Grotesk', weights: [400, 500, 600, 700] },
  { family: 'Plus Jakarta Sans, sans-serif', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFontName: 'Plus+Jakarta+Sans', weights: [400, 500, 600, 700, 800] },
  { family: 'Syne, sans-serif', name: 'Syne Futuristic', category: 'sans-serif', googleFontName: 'Syne', weights: [400, 600, 700, 800] },
  { family: 'Outfit, sans-serif', name: 'Outfit Modern', category: 'sans-serif', googleFontName: 'Outfit', weights: [400, 500, 600, 700, 800] },
  { family: 'Inter, sans-serif', name: 'Inter', category: 'sans-serif', googleFontName: 'Inter', weights: [400, 500, 600, 700, 800] },
  { family: 'Manrope, sans-serif', name: 'Manrope', category: 'sans-serif', googleFontName: 'Manrope', weights: [400, 500, 600, 700, 800] },
  { family: 'DM Sans, sans-serif', name: 'DM Sans', category: 'sans-serif', googleFontName: 'DM+Sans', weights: [400, 500, 700] },
  { family: 'Sora, sans-serif', name: 'Sora', category: 'sans-serif', googleFontName: 'Sora', weights: [400, 600, 700] },
  { family: 'Montserrat, sans-serif', name: 'Montserrat', category: 'sans-serif', googleFontName: 'Montserrat', weights: [400, 500, 600, 700, 800] },
  { family: 'Poppins, sans-serif', name: 'Poppins', category: 'sans-serif', googleFontName: 'Poppins', weights: [400, 500, 600, 700] },
  { family: 'Bebas Neue, sans-serif', name: 'Bebas Neue', category: 'display', googleFontName: 'Bebas+Neue', weights: [400] },
  { family: 'Oswald, sans-serif', name: 'Oswald', category: 'display', googleFontName: 'Oswald', weights: [400, 600, 700] },
];

export interface TypographyPreset {
  id: string;
  name: string;
  niche: string;
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  description: string;
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'luxury-haute',
    name: 'Haute Luxury & Visagismo',
    niche: 'Barbearias VIP, Joalherias, Restaurantes Estrelados',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Inter, sans-serif',
    description: 'Elegância máxima em serifas italianas delicadas com corpo limpo.',
  },
  {
    id: 'cinzel-emperor',
    name: 'Cinzel Imperial Luxury',
    niche: 'Marcas de Luxo, Alta Barbearia, Gastronomia Autorais',
    headingFont: 'Cinzel, serif',
    bodyFont: 'Outfit, sans-serif',
    description: 'Presença imponente com letras romanas esculpidas em ouro.',
  },
  {
    id: 'bodoni-haute',
    name: 'Bodoni Haute Couture',
    niche: 'Moda, Estética VIP, Arquitetura',
    headingFont: 'Bodoni Moda, serif',
    bodyFont: 'Manrope, sans-serif',
    description: 'Contraste editorial dramático e alta sofisticação visual.',
  },
  {
    id: 'modern-editorial',
    name: 'Editorial Premium',
    niche: 'Arquitetura, Interiores, Design',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Manrope, sans-serif',
    description: 'Contraste editorial refinado com forte apelo estético.',
  },
  {
    id: 'syne-futuristic',
    name: 'Syne Next-Gen Creative',
    niche: 'Agências, Tech, Estúdios Digitais',
    headingFont: 'Syne, sans-serif',
    bodyFont: 'Space Grotesk, sans-serif',
    description: 'Estética futurista e vanguardista de agências globais.',
  },
  {
    id: 'tech-saas',
    name: 'Modern Tech & SaaS',
    niche: 'Software, Startups, Plataformas',
    headingFont: 'Space Grotesk, sans-serif',
    bodyFont: 'Inter, sans-serif',
    description: 'Geometria contemporânea e alta legibilidade digital.',
  },
  {
    id: 'clean-medical',
    name: 'Clinical & Health Care',
    niche: 'Clínicas, Médicos, Odontologia',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    bodyFont: 'Inter, sans-serif',
    description: 'Acolhedor, moderno e transmite máxima confiança.',
  },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily?: string) {
  if (!fontFamily || typeof window === 'undefined') return;
  const cleanFamily = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  const found = AVAILABLE_FONTS.find(
    (f) => f.family.toLowerCase().includes(cleanFamily.toLowerCase()) || f.name.toLowerCase() === cleanFamily.toLowerCase()
  );
  if (!found || loadedFonts.has(found.googleFontName)) return;

  try {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${found.googleFontName}:wght@${found.weights.join(';')}&display=swap`;
    document.head.appendChild(link);
    loadedFonts.add(found.googleFontName);
  } catch (e) {
    console.error('Failed to load font dynamically', e);
  }
}

export function loadAllSiteFonts(fonts: (string | undefined)[]) {
  fonts.forEach((f) => {
    if (f) loadGoogleFont(f);
  });
}
