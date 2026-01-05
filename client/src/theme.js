// // color design tokens export
// export const colorTokens = {
//     grey: {
//       0: "#FFFFFF",
//       10: "#F6F6F6",
//       50: "#F0F0F0",
//       100: "#E0E0E0",
//       200: "#C2C2C2",
//       300: "#A3A3A3",
//       400: "#858585",
//       500: "#666666",
//       600: "#4D4D4D",
//       700: "#333333",
//       800: "#1A1A1A",
//       900: "#0A0A0A",
//       1000: "#000000",
//     },
//     primary: {
//       50: "#E6FBFF",
//       100: "#CCF7FE",
//       200: "#99EEFD",
//       300: "#66E6FC",
//       400: "#33DDFB",
//       500: "#00D5FA",
//       600: "#00A0BC",
//       700: "#006B7D",
//       800: "#00353F",
//       900: "#001519",
//     },
//   };
  
//   // mui theme settings
//   export const themeSettings = (mode) => {
//     return {
//       palette: {
//         mode: mode,
//         ...(mode === "dark"
//           ? {
//               // palette values for dark mode
//               primary: {
//                 dark: colorTokens.primary[200],
//                 main: colorTokens.primary[500],
//                 light: colorTokens.primary[800],
//               },
//               neutral: {
//                 dark: colorTokens.grey[100],
//                 main: colorTokens.grey[200],
//                 mediumMain: colorTokens.grey[300],
//                 medium: colorTokens.grey[400],
//                 light: colorTokens.grey[700],
//               },
//               background: {
//                 default: colorTokens.grey[900],
//                 alt: colorTokens.grey[800],
//               },
//             }
//           : {
//               // palette values for light mode
//               primary: {
//                 dark: colorTokens.primary[700],
//                 main: colorTokens.primary[500],
//                 light: colorTokens.primary[50],
//               },
//               neutral: {
//                 dark: colorTokens.grey[700],
//                 main: colorTokens.grey[500],
//                 mediumMain: colorTokens.grey[400],
//                 medium: colorTokens.grey[300],
//                 light: colorTokens.grey[50],
//               },
//               background: {
//                 default: colorTokens.grey[10],
//                 alt: colorTokens.grey[0],
//               },
//             }),
//       },
//       typography: {
//         fontFamily: ["Rubik", "sans-serif"].join(","),
//         fontSize: 12,
//         h1: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 40,
//         },
//         h2: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 32,
//         },
//         h3: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 24,
//         },
//         h4: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 20,
//         },
//         h5: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 16,
//         },
//         h6: {
//           fontFamily: ["Rubik", "sans-serif"].join(","),
//           fontSize: 14,
//         },
//       },
//     };
//   };

// color design tokens export
export const colorTokens = {
    grey: {
      0: "#FFFFFF",
      10: "#F8FAFC",    // Very light slate
      50: "#F1F5F9",
      100: "#E2E8F0",
      200: "#CBD5E1",
      300: "#94A3B8",
      400: "#64748B",
      500: "#475569",
      600: "#334155",
      700: "#1E293B",
      800: "#0F172A",    // Deep Navy/Grey
      900: "#020617",    // Near Black
      1000: "#000000",
    },
    primary: {
      50: "#EEF2FF",
      100: "#E0E7FF",
      200: "#C7D2FE",
      300: "#A5B4FC",
      400: "#818CF8",
      500: "#6366F1",    // Modern Indigo
      600: "#4F46E5",
      700: "#4338CA",
      800: "#3730A3",
      900: "#312E81",
    },
  };
  
  // mui theme settings
  export const themeSettings = (mode) => {
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              // Dark mode: Deep Navy background with Indigo accents
              primary: {
                dark: colorTokens.primary[200],
                main: colorTokens.primary[400], // Brighter Indigo for accessibility
                light: colorTokens.primary[800],
              },
              neutral: {
                dark: colorTokens.grey[100],
                main: colorTokens.grey[200],
                mediumMain: colorTokens.grey[300],
                medium: colorTokens.grey[400],
                light: colorTokens.grey[700],
              },
              background: {
                default: colorTokens.grey[900],
                alt: colorTokens.grey[800],
              },
            }
          : {
              // Light mode: Clean Slate background with Indigo accents
              primary: {
                dark: colorTokens.primary[700],
                main: colorTokens.primary[500],
                light: colorTokens.primary[50],
              },
              neutral: {
                dark: colorTokens.grey[700],
                main: colorTokens.grey[500],
                mediumMain: colorTokens.grey[400],
                medium: colorTokens.grey[300],
                light: colorTokens.grey[50],
              },
              background: {
                default: colorTokens.grey[10],
                alt: colorTokens.grey[0],
              },
            }),
      },
      typography: {
        fontFamily: ["Inter", "Rubik", "sans-serif"].join(","), // Added Inter for a cleaner look
        fontSize: 12,
        h1: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 40,
          fontWeight: 700,
        },
        h2: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 32,
          fontWeight: 700,
        },
        h3: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 24,
          fontWeight: 600,
        },
        h4: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 20,
          fontWeight: 600,
        },
        h5: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 16,
          fontWeight: 500,
        },
        h6: {
          fontFamily: ["Inter", "Rubik", "sans-serif"].join(","),
          fontSize: 14,
          fontWeight: 500,
        },
      },
    };
};