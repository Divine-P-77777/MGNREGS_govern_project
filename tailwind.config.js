/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
     extend: {
    colors: {
      primary: '#0077B6',
      secondary: '#FFD60A',
      accent: '#00B4D8',
      success: '#2ECC71',
      warning: '#F39C12',
      danger: '#E74C3C',
      background: '#F9FAFB',
      card: '#FFFFFF',
      textPrimary: '#1A1A1A',
      textSecondary: '#444444',
      hover: '#005f8d',
    },
    boxShadow: {
      card: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
  },
  },
  plugins: [],
}