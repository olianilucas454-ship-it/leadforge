'use client';

export interface FontOption {
  family: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'display';
  googleFontName: string;
  weights: number[];
}

export const AVAILABLE_FONTS: FontOption[] = [
  { family: 'Inter, sans-serif', name: 'Inter', category: 'sans-serif', googleFontName: 'Inter', weights: [400, 500, 600, 700, 800] },
  { family: 'Manrope, sans-serif', name: 'Manrope', category: 'sans-serif', googleFontName: 'Manrope', weights: [400, 500, 600, 700, 800] },
  { family: 'DM Sans, sans-serif', name: 'DM Sans', category: 'sans-serif', googleFontName: 'DM+Sans', weights: [400, 500, 700] },
  { family: 'Plus Jakarta Sans, sans-serif', name: 'Plus Jakarta Sans', category: 'sans-serif', googleFontName: 'Plus+Jakarta+Sans', weights: [400, 500, 600, 700, 800] },
  { family: 'Space Grotesk, sans-serif', name: 'Space Grotesk', category: 'sans-serif', googleFontName: 'Space+Grotesk', weights: [400, 500, 600, 700] },
  { family: 'Sora, sans-serif', name: 'Sora', category: 'sans-serif', googleFontName: 'Sora', weights: [400, 600, 700] },
  { family: 'Montserrat, sans-serif', name: 'Montserrat', category: 'sans-serif', googleFontName: 'Montserrat', weights: [400, 500, 600, 700, 800] },
  { family: 'Poppins, sans-serif', name: 'Poppins', category: 'sans-serif', googleFontName: 'Poppins', weights: [400, 500, 600, 700] },
  { family: 'Playfair Display, serif', name: 'Playfair Display', category: 'serif', googleFontName: 'Playfair+Display', weights: [400, 600, 700, 800] },
  { family: 'Cormorant Garamond, serif', name: 'Cormorant Garamond', category: 'serif', googleFontName: 'Cormorant+Garamond', weights: [400, 500, 600, 700] },
  { family: 'Libre Baskerville, serif', name: 'Libre Baskerville', category: 'serif', googleFontName: 'Libre+Baskerville', weights: [400, 700] },
  { family: 'Lora, serif', name: 'Lora', category: 'serif', googleFontName: 'Lora', weights: [400, 500, 600, 700] },
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
    name: 'Luxury & Haute Cuisine',
    niche: 'Restaurantes, Barbearias Luxe, Joalherias',
    headingFont: 'Cormorant Garamond, serif',
    bodyFont: 'Inter, sans-serif',
    description: 'Elegância clássica com títulos em serifas delicadas e corpo limpo.',
  },
  {
    id: 'modern-editorial',
    name: 'Editorial Premium',
    niche: 'Arquitetura, Moda, Revistas',
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Manrope, sans-serif',
    description: 'Contraste editorial marcante com forte apelo visual.',
  },
  {
    id: 'tech-saas',
    name: 'Modern Tech & SaaS',
    niche: 'Software, Startups, Agências',
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
    description: 'Acolhedor, moderno e transmite confiança clínica.',
  },
  {
    id: 'corporate-authority',
    name: 'Corporate & Legal Authority',
    niche: 'Advocacia, Finanças, Consultorias',
    headingFont: 'Libre Baskerville, serif',
    bodyFont: 'DM Sans, sans-serif',
    description: 'Sobriedade e imponência para negócios de alto nível.',
  },
  {
    id: 'bold-fitness',
    name: 'Bold Energy & Fitness',
    niche: 'Academias, Crossfit, Esportes',
    headingFont: 'Oswald, sans-serif',
    bodyFont: 'Montserrat, sans-serif',
    description: 'Tipografia de impacto e energia máxima.',
  },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (typeof window === 'undefined') return;
  const found = AVAILABLE_FONTS.find((f) => f.family === fontFamily || f.name === fontFamily);
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
