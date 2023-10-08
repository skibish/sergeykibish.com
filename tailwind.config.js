import harmonyPalette from "@evilmartians/harmony/tailwind";

module.exports = {
  content: [
    './layouts/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "Montserrat, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        mono: "Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
      },
      colors: harmonyPalette
    },
  }
}
