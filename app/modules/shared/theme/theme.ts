export const colors = {
  light: {
    primary: {
      main: "#000000",
      mainBlue: "#3182CE",
      light: "#80D1F0",
      dark: "#0076A3",
    },
    secondary: {
      main: "#2E7D32",
      light: "#60AD5E",
      dark: "#005005",
    },
    background: {
      main: "#fbfcff",
      secondary: "#F5FAFF", //light blue
      tertiary: "#CEEDFF", // darker blue
      quaternary: "#90CDF4", //darker darker blue
    },
    // Neutral colors
    neutral: {
      white: "#FFFFFF",
      black: "#000000",
      gray: {
        50: "#FAFAFA",
        100: "#F1F2F3",
        200: "#E1E2E4",
        300: "#C7C9CC",
        400: "#A3A7AB",
        500: "#6B6F73",
        600: "#393D41",
        700: "#2E3236",
        800: "#23272B",
        900: "#181C20",
      },
    },
    palette: {
      red: {
        50: "#FFF5F5",
        100: "#FCE5E5",
        200: "#F9CCCC",
        300: "#F59B9B",
        400: "#F16A6A",
        500: "#E53232",
        600: "#C72B2B",
        700: "#A92424",
        800: "#8B1D1D",
        900: "#6E1616",
      },
      purple: {
        50: "#F8F5FF",
        100: "#ECE6FD",
        200: "#D7D0FA",
        300: "#B1A1ED",
        400: "#8B6AD1",
        500: "#6533B4",
        600: "#572C9A",
        700: "#492580",
        800: "#3B1E66",
        900: "#2D174C",
      },
      cyan: {
        50: "#F0FEFF",
        100: "#D1FAFC",
        200: "#A8F2FA",
        300: "#6FE6F7",
        400: "#1CD6F2",
        500: "#179CBA",
        600: "#146B83",
        700: "#115B6F",
        800: "#0E4A5B",
        900: "#0B3A47",
      },
      blue: {
        20: "#fbfcff",
        50: "#F5FAFF",
        100: "#CEEDFF",
        200: "#90CDF4",
        300: "#63B3ED",
        400: "#4299E1",
        500: "#3182CE",
        600: "#2A69AC",
        700: "#1E4E8C",
        800: "#153E75",
        900: "#1A365D",
      },
      teal: {
        50: "#F5FFFF",
        100: "#E1FCFC",
        200: "#B9F7F7",
        300: "#8CEEEE",
        400: "#5FD1D1",
        500: "#32A3A3",
        600: "#2C7C7C",
        700: "#266666",
        800: "#205050",
        900: "#1A3A3A",
      },
      green: {
        50: "#F5FFF8",
        100: "#E6FCEB",
        200: "#CFF7D5",
        300: "#A6EFB0",
        400: "#6FD17E",
        500: "#38A353",
        600: "#317C46",
        700: "#2A663C",
        800: "#235032",
        900: "#1C3A28",
      },
      yellow: {
        50: "#FFFDF5",
        100: "#FCF8E5",
        200: "#F9F2CC",
        300: "#F5DB9B",
        400: "#F1C16A",
        500: "#E58F32",
        600: "#C77C2B",
        700: "#A96924",
        800: "#8B561D",
        900: "#6E4316",
      },
      orange: {
        50: "#FFF5F0",
        100: "#FCE5E5",
        200: "#F9D7CC",
        300: "#F5B99B",
        400: "#F19A6A",
        500: "#E56032",
        600: "#C7532B",
        700: "#A94624",
        800: "#8B391D",
        900: "#6E2C16",
      },
    },
  },
};

export default colors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.light.neutral.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: colors.light.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.light.neutral.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
