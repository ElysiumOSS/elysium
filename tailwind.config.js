/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'elysium-primary': 'hsl(255, 85%, 60%)',
        'elysium-secondary': 'hsl(280, 80%, 70%)',
        'elysium-accent': 'hsl(300, 85%, 65%)',
        'elysium-dark': 'hsl(250, 30%, 10%)',
      },
    },
  },
  plugins: [],
};
