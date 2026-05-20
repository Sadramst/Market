// Beauty theme — Rose Gold palette from Phase 4 UI/UX doc
export const beautyTheme = {
  colors: {
    primary: {
      50: "#FFF5F5",
      100: "#FFE0E0",
      200: "#FFC2C2",
      300: "#FF9E9E",
      400: "#FF7A7A",
      500: "#E8788A", // Primary rose gold
      600: "#D4657A",
      700: "#B84D65",
      800: "#9C3550",
      900: "#7A2040",
    },
    secondary: {
      50: "#FFF8F0",
      100: "#FFEDD5",
      200: "#FFDBB0",
      300: "#FFC987",
      400: "#FFB85E",
      500: "#D4A574", // Warm gold accent
      600: "#C09060",
      700: "#A0754A",
      800: "#805A34",
      900: "#604020",
    },
    neutral: {
      50: "#FAFAF9",
      100: "#F5F5F4",
      200: "#E7E5E4",
      300: "#D6D3D1",
      400: "#A8A29E",
      500: "#78716C",
      600: "#57534E",
      700: "#44403C",
      800: "#292524",
      900: "#1C1917",
    },
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#EF4444",
    info: "#3B82F6",
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
} as const;

// IT Services theme — Professional blue palette
export const itTheme = {
  colors: {
    primary: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#3B82F6", // Primary blue
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
      900: "#1E3A8A",
    },
    secondary: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6", // Teal accent
      600: "#0D9488",
      700: "#0F766E",
      800: "#115E59",
      900: "#134E4A",
    },
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
} as const;

export type Theme = typeof beautyTheme;
