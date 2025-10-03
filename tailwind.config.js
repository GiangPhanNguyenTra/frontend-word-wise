/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        shape1: "var(--shape1)",
        shape2: "var(--shape2)",
        shape4: "var(--shape4)",
        tint1: "var(--tint1)",
        tint2: "var(--tint2)",
        tint3: "var(--tint3)",
        tint4: "var(--tint4)",
        secondaryShape1: "var(--secondaryShape1)",
        secondaryShape2: "var(--secondaryShape2)",
        secondaryShape3: "var(--secondaryShape3)",
        secondaryShape4: "var(--secondaryShape4)",
        secondaryTint1: "var(--secondaryTint1)",
        secondaryTint2: "var(--secondaryTint2)",
        secondaryTint3: "var(--secondaryTint3)",
        secondaryTint4: "var(--secondaryTint4)",
        info: "var(--color-info)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
