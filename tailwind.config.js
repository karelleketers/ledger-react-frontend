module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}',  ],
    darkMode: false,
    theme: {
      screens: {
        'xs': '360px',
        'md': '547px',
        'lg': '768px',
        'xl': '1098px',
        'xli': '1366px',
        'xlb': '1320px',
      },
      extend: {
        spacing: {
          '1/8': "1.25rem",
          '1/10': '10%',
          '1/5': '20%',
          'curve': '40px',
          'curve-neg': '-40px',
          'curve-width': '20px',
          '-8': '-2rem',
          'cat-mobile': 'calc(0.08*(100vw - 4rem))',
          'main': '7.5rem',
          'main-ext': '9.5rem'
        },
        fontSize: {
          "micro": ['10px', {
            lineHeight: '16px',
          }],
          'balance': "4.5vw",
          'cc': "1.2vw",
          'mobile-text': "6vw",
          'mobile-balance': "15vw",
        },
        colors: {
          'dark': '#002600',
          'dkgreen': '#00562F',
          'mdgreen': '#2FAC66',
          'softgreen': '#DCF0DC',
          'ltgreen': '#89E798',
          'light': '#F8FFF8',
          'gradient-1': '#D0E4D8',
          'gradient-2': '#9FC2B0',
          'gradient-3': '#77A790',
          'gradient-4': '#5A9479',
          'transaction-red': "#ED593E",
        },
        maxWidth: {
          'complete': '120rem',
          '48': '12rem',
          '75': '75rem',
        },
        maxHeight: {
          '32r': '32rem',
        },
        minHeight: {
          '55': '5.5rem'
        },
        width: {
          '22': '22.5rem',
          '70': '70%',
          '11': '11%',
          '18': '4.5rem',
          '90': '90%',
          '95': '95%',
          '33': '33.33vw',
          '70vw': '70vw',
          '1/7': 'calc(100% / 7)',
          'nav-extended-xl': '16.5rem',
          'nav-options-extended-xl': '14.25rem',
          'nav-compact-xl': '7.5rem',
          'nav-options-compact-xl': '5.25rem',
          'side-notifs': '26.75rem',
          'category': 'calc(0.16*(100vw - 11.5rem))',
          'cat-mobile': 'calc(0.64*(100vw - 4rem))',
          'category-sm': 'calc(0.32*(100vw - 4rem))',
          'category-med': 'calc(0.256*(100vw - 4rem))',
          'main': 'calc(100vw - 7.5rem)'
        },
        height: {
          '18': '4.5rem',
          '100': '30rem',
          '120': '45rem',
          '80vh': '80vh',
          '25vh': '25vh'
        },
        inset: {
          '9p': '9%',
          '31p': '31%',
          '52p': '52%',
          '63p': '62.7%',
          '86p': '86%',
        },
        gridTemplateRows: {
          '15': 'repeat(15, minmax(0, 1fr))',
          '8': 'repeat(8, minmax(0, 1fr))'
        },
        fontFamily: {
          'nunitolt': ['nunitolight'],
          'nunitoblack': ['nunitoblack'],
          'nunitobold': ['nunitobold'],
          'nunitomedium': ['nunitomedium'],
          'nunitoreg': ['nunitoregular'],
          'leaguespartan': ['leaguespartan'],
        },
        borderRadius: {
          '4xl': '2rem',
          'half': '50%'
        },
        borderWidth: {
          '16': '2rem',
        },
        boxShadow: {
          'curve-top': '0 20px 0 0 #2FAC66',
          'curve-bottom': '0 -20px 0 0 #2FAC66',
          'curve-tablet-top': '0 20px 0 0 #00562F',
          'curve-tablet-bottom': '0 -20px 0 0 #00562F',
          'curve-top-light': '0 20px 0 0 #f8fff8',
          'curve-bottom-light': '0 -20px 0 0 #f8fff8',
        },
        backgroundImage: {
          'category': "url('./assets/images/artdeco.svg')",
          'cat-mobile': "url('./assets/images/artdeco-dk.svg')",
          'transaction': "url('./assets/images/currency-bg.svg')",
          'transaction-lt': "url('./assets/images/currency-bg-lt.svg')",
        },
        backgroundSize: {
          '50': '50%'
        },
        zIndex: {
          '300':'300'
        }
      },
    },
    plugins: [],
  }