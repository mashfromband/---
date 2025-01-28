import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'el_red': {
          50: '#ffefef',
          100: '#ffdcdc',
          200: '#ffbfc0',
          300: '#ff9293',
          400: '#ff5456',
          500: '#ff1f21',
          600: '#ff0003',
          700: '#db0002',
          800: '#c30002', //key
          900: '#940809',
          950: '#520001'
        },
        'el_yellow': {
          50: '#fefce8',
          100: '#fff9c2',
          200: '#fff087',
          300: '#ffe043',
          400: '#ffc802', //key
          500: '#efb203',
          600: '#ce8900',
          700: '#a46004',
          800: '#884b0b',
          900: '#733d10',
          950: '#431f05'
        }
      }
    }
  }
}