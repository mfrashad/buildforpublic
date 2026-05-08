/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(355, 78%, 97%)',
            '100': 'hsl(355, 78%, 94%)',
            '200': 'hsl(355, 78%, 86%)',
            '300': 'hsl(355, 78%, 76%)',
            '400': 'hsl(355, 78%, 64%)',
            '500': 'hsl(355, 78%, 50%)',
            '600': 'hsl(355, 78%, 40%)',
            '700': 'hsl(355, 78%, 32%)',
            '800': 'hsl(355, 78%, 24%)',
            '900': 'hsl(355, 78%, 16%)',
            '950': 'hsl(355, 78%, 10%)',
            DEFAULT: '#e84855'
        },
        secondary: {
            '50': 'hsl(221, 55%, 97%)',
            '100': 'hsl(221, 55%, 94%)',
            '200': 'hsl(221, 55%, 86%)',
            '300': 'hsl(221, 55%, 76%)',
            '400': 'hsl(221, 55%, 64%)',
            '500': 'hsl(221, 55%, 50%)',
            '600': 'hsl(221, 55%, 40%)',
            '700': 'hsl(221, 55%, 32%)',
            '800': 'hsl(221, 55%, 24%)',
            '900': 'hsl(221, 55%, 16%)',
            '950': 'hsl(221, 55%, 10%)',
            DEFAULT: '#2e519f'
        },
        accent: {
            '50': 'hsl(337, 100%, 97%)',
            '100': 'hsl(337, 100%, 94%)',
            '200': 'hsl(337, 100%, 86%)',
            '300': 'hsl(337, 100%, 76%)',
            '400': 'hsl(337, 100%, 64%)',
            '500': 'hsl(337, 100%, 50%)',
            '600': 'hsl(337, 100%, 40%)',
            '700': 'hsl(337, 100%, 32%)',
            '800': 'hsl(337, 100%, 24%)',
            '900': 'hsl(337, 100%, 16%)',
            '950': 'hsl(337, 100%, 10%)',
            DEFAULT: '#ff70a6'
        },
        'neutral-50': '#1a1b1f',
        'neutral-100': '#000000',
        'neutral-200': '#ffffff',
        'neutral-300': '#fff7e7',
        background: '#fff7e7',
        foreground: '#000000'
    },
    fontFamily: {
        body: [
            'DM Sans',
            'sans-serif'
        ],
        heading: [
            'sans-serif',
            'sans-serif'
        ],
        font2: [
            'Gilroy',
            'sans-serif'
        ]
    },
    fontSize: {
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '28px'
            }
        ],
        '25': [
            '25px',
            {
                lineHeight: '36px'
            }
        ],
        '30': [
            '30px',
            {
                lineHeight: '30px'
            }
        ],
        '50': [
            '50px',
            {
                lineHeight: '45px'
            }
        ]
    },
    spacing: {
        '20': '40px',
        '50': '100px',
        '117': '234px',
        '5px': '5px'
    },
    borderRadius: {
        md: '8px',
        lg: '16px',
        full: '60px'
    },
    boxShadow: {
        sm: 'rgb(0, 0, 0) 0px 5px 0px 0px'
    },
    screens: {
        md: '768px',
        xl: '1280px',
        '1440px': '1440px'
    },
    transitionDuration: {
        '200': '0.2s'
    }
},
  },
};
