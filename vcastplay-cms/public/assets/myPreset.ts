import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const myPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#EDF3F5',
            100: '#E1EAED',
            200: '#B6C8D1',
            300: '#8DA6B5',
            400: '#4F6B80',
            500: '#213448',
            600: '#1A2C40',
            700: '#122136',
            800: '#0C182B',
            900: '#071021',
            950: '#030814',
        },
        surface: {
            0: '#ffffff',
            50: '{zinc.50}',
            100: '{zinc.100}',
            200: '{zinc.200}',
            300: '{zinc.300}',
            400: '{zinc.400}',
            500: '{zinc.500}',
            600: '{zinc.600}',
            700: '{zinc.700}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.950}'
        }
    },
    extend: {
        animation: {
            'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
        },
    },
})


export default myPreset;