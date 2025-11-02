
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: '#0b76d1', brand2: '#0a64b2' },
      boxShadow: { soft: '0 10px 25px rgba(12,64,140,.12)' }
    }
  },
  plugins: []
}
export default config
