export type SiteExperienceLevel = 'standard' | 'premium' | 'cinematic' | 'experimental';

export type ComponentCategory =
  | 'header'
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'products'
  | 'pricing'
  | 'gallery'
  | 'portfolio'
  | 'testimonials'
  | 'team'
  | 'stats'
  | 'process'
  | 'timeline'
  | 'faq'
  | 'map'
  | 'contact'
  | 'cta'
  | 'footer'
  | 'frame-sequence'
  | 'horizontal-scroll'
  | 'webgl-canvas';

export interface DesignSystemTokens {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string; // e.g. '0.75rem'
  containerWidth: string; // e.g. '1280px'
  spacingScale: 'compact' | 'normal' | 'spacious';
  themeMode: 'dark' | 'light';
}

export interface KeyframeConfig {
  scrollPercent: number; // 0 to 100
  opacity?: number;
  scale?: number;
  rotateDeg?: number;
  translateYPx?: number;
  translateXPx?: number;
  blurPx?: number;
  clipPath?: string;
  frameIndex?: number;
}

export interface ScrollAnimationConfig {
  enabled: boolean;
  type: 'fade-up' | 'scale-in' | 'parallax' | 'sticky-pin' | 'frame-sequence' | 'horizontal-scroll' | 'reveal' | 'custom-timeline';
  textAnimation?: 'none' | 'kinetic' | 'stagger' | 'typing' | 'glow' | 'wave' | 'blur-type';
  entranceAnimation?: 'none' | 'fade-up' | 'blur-in' | 'scale-in' | 'slide-right' | 'parallax-float';
  duration?: number;
  delay?: number;
  scrub: boolean | number;
  start: string; // e.g. 'top 80%'
  end: string;   // e.g. 'bottom 20%'
  pin?: boolean;
  depth?: number; // 0 to 100 for parallax
  keyframes?: KeyframeConfig[];
}

export interface InteractionConfig {
  hoverEffect?: 'scale' | 'glow' | 'magnetic' | 'tilt' | 'underline' | 'lift';
  clickAction?: 'navigate' | 'modal' | 'whatsapp' | 'scroll-to' | 'play-video';
  clickTarget?: string;
  cursorStyle?: 'default' | 'ring' | 'dot' | 'magnetic' | 'view';
}

export interface FrameSequenceConfig {
  enabled: boolean;
  framesUrlPattern: string; // e.g. '/frames/hero/frame_{index}.webp'
  frameCount: number;
  fps: number;
  scrollStartPercent: number;
  scrollEndPercent: number;
  sticky: boolean;
  desktopSource?: string;
  mobileSource?: string;
}

export type HeroVariant =
  | 'HeroFullScreen'
  | 'HeroSplit'
  | 'HeroEditorial'
  | 'HeroVideo'
  | 'HeroCinematic'
  | 'HeroMinimal'
  | 'HeroRestaurant'
  | 'HeroArchitecture'
  | 'HeroLuxury'
  | 'HeroEcoGlass'
  | 'HeroArchevo'
  | 'HeroLavilla';

export interface ComponentProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  navLink1?: string;
  navLink2?: string;
  navLink3?: string;
  navLink4?: string;
  headerCta?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image?: string;
  videoUrl?: string;
  overlayOpacity?: number; // 0 to 100
  overlayColor?: string; // hex or rgba
  focalPoint?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  heroHeight?: 'screen' | 'large' | 'medium';
  items?: Record<string, any>[];
  stats?: { number: string; label: string }[];
  whatsappNumber?: string;
  whatsappMessage?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  openingHours?: string;
  googleMapsEmbedUrl?: string;
  googleMapsUrl?: string;
  mapLabel?: string;
  customCss?: string;
}

export interface AiActionLog {
  id: string;
  timestamp: string;
  command: string;
  actionsExecuted: string[];
  summary: string;
}

export interface SiteComponentSchema {
  id: string;
  name: string;
  category: ComponentCategory;
  variant: string; // e.g. 'HeroMinimal', 'HeroCinematic', 'HeroSplit'
  props: ComponentProps;
  animation?: ScrollAnimationConfig;
  interaction?: InteractionConfig;
  frameSequence?: FrameSequenceConfig;
  styleOverrides?: Record<string, string>;
  hiddenOnMobile?: boolean;
}

export interface SiteSectionSchema {
  id: string;
  name: string;
  category: ComponentCategory;
  variant: string;
  components: SiteComponentSchema[];
  animation?: ScrollAnimationConfig;
  styleOverrides?: Record<string, string>;
}

export interface PageSchema {
  id: string;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: SiteSectionSchema[];
}

export interface AssetSchema {
  id: string;
  name: string;
  type: 'image' | 'video' | 'frame-sequence' | 'font' | 'logo';
  url: string;
  sizeKb?: number;
  dimensions?: { width: number; height: number };
}

export interface SEOSchema {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  favicon?: string;
  structuredData?: Record<string, any>;
}

export interface AuditIssue {
  id: string;
  category: 'design' | 'ux' | 'mobile' | 'performance' | 'seo' | 'accessibility' | 'conversion';
  severity: 'critical' | 'warning' | 'suggestion';
  title: string;
  description: string;
  autoFixable: boolean;
  targetId?: string;
}

export interface QualityAuditResult {
  overallScore: number;
  scores: {
    design: number;
    ux: number;
    mobile: number;
    performance: number;
    seo: number;
    accessibility: number;
    conversion: number;
  };
  issues: AuditIssue[];
}

export interface SiteVersionSnapshot {
  id: string;
  timestamp: string;
  description: string;
  site: SiteSchema;
}

export interface SiteSchema {
  id: string;
  name: string;
  clientName: string;
  leadId?: string;
  leadData?: {
    name: string;
    category: string;
    city: string;
    state: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    rating?: number;
    reviewCount?: number;
    digitalPresence?: any;
  };
  experienceLevel: SiteExperienceLevel;
  status: 'draft' | 'published' | 'archived';
  domain?: string;
  subdomain: string;
  designSystem: DesignSystemTokens;
  pages: PageSchema[];
  assets: AssetSchema[];
  seo: SEOSchema;
  version: number;
  createdAt: string;
  updatedAt: string;
}
