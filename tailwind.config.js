module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        'float-a': {
          '0%, 100%': { transform: 'translateY(0) rotate(18deg)' },
          '50%': { transform: 'translateY(-14px) rotate(14deg)' },
        },
        'float-b': {
          '0%, 100%': { transform: 'translateY(0) rotate(-15deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-19deg)' },
        },
      },
      animation: {
        'float-a': 'float-a 7s ease-in-out infinite',
        'float-a-fast': 'float-a 5s ease-in-out infinite',
        'float-b': 'float-b 8s ease-in-out infinite',
        'float-b-fast': 'float-b 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
