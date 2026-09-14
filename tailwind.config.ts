import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        'surface-hover': '#1a1a2e',
        border: '#2a2a3e',
        'border-hover': '#3a3a4e',
        'text-primary': '#f0f0f5',
        'text-secondary': '#8888a0',
        'text-muted': '#55556a',
        accent: '#00d68f',
        'accent-hover': '#00b377',
        'accent-blue': '#3b82f6',
        hot: '#ef4444',
        warm: '#f97316',
        cold: '#3b82f6',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
};
export default config;
