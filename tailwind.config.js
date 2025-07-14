export default {
  theme: {
    extend: {
      animation: {
        fadeOut: "fadeOut 3s ease-in-out forwards",
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
