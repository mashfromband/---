import type { Config } from 'tailwindcss'
const colors = require('tailwindcss/colors')

export default <Partial<Config>>{
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      green: colors.green,
      gray: colors.gray,
      red: colors.red,
      secondary: {
        950: '#680000',
        900: '#7C0000',
        800: '#8E0000',
        700: '#A00000',
        600: '#B20000',
        500: '#c30002',
        400: '#D02929',
        300: '#E67A7A',
        200: '#E16666',
        100: '#EFA3A3',
        50: '#F7CCCC',
      }
    },
    extend: {
      colors: {
        'el_red': {
          950: '#680000',
          900: '#7C0000',
          800: '#8E0000',
          700: '#A00000',
          600: '#B20000',
          500: '#c30002',
          400: '#D02929',
          300: '#E67A7A',
          200: '#E16666',
          100: '#EFA3A3',
          50: '#F7CCCC',
        },
        'el_yellow': {
          50: '#FFF7CC',
          100: '#FFEFA3',
          200: '#FFE77A',
          300: '#FFDE52',
          400: '#FFD329',
          500: '#ffc802',
          600: '#E6B600',
          700: '#CCA300',
          800: '#B39000',
          900: '#997D00',
          950: '#806900'
        },
        'el_blue': {
          50: '#eff2fe',
          100: '#e2e8fd',
          200: '#cad4fb',
          300: '#a9b7f8',
          400: '#8792f2',
          500: '#6a6eea',
          600: '#463eda', //key
          700: '#483fc3',
          800: '#3b369d',
          900: '#35327d',
          950: '#201d49',
        },
        'el_orange': {
          50: '#fff9ec',
          100: '#fff2d3',
          200: '#ffe0a6',
          300: '#ffc96e',
          400: '#ffa634',
          500: '#ff8a0c',
          600: '#e26602', //key
          700: '#ca5304',
          800: '#a0400c',
          900: '#81370d',
          950: '#461904',
        },   
      },
    }
  }
}