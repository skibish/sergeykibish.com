import harmonyPalette from "@evilmartians/harmony/tailwind";

export default {
  content: [
    './layouts/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "Montserrat, sans-serif, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        mono: "Fira Code, monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New"
      },
      colors: harmonyPalette
    },
  }
}
