/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00d4ff',
        crimsonRed: '#ff2d55',
        deepBlack: '#0a0a0f',
        violetGlow: '#8b5cf6',
        cyanEnergy: '#22d3ee',
        whiteHighlight: '#f0f0ff',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        techmono: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blink: 'blink 4s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        glitch: 'glitch 0.3s ease-in-out',
        scanline: 'scanline 8s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        particleDrift: 'particleDrift 20s linear infinite',
      },
    },
  },
  plugins: [],
}
