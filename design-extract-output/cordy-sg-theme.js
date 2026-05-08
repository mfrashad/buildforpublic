// React Theme — extracted from https://www.cordy.sg/
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '16': string;
    '20': string;
    '25': string;
    '30': string;
    '50': string;
 *   };
 *   space: {
    '5': string;
    '40': string;
    '100': string;
    '234': string;
 *   };
 *   radii: {
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#e84855",
    "secondary": "#2e519f",
    "accent": "#ff70a6",
    "background": "#fff7e7",
    "foreground": "#000000",
    "neutral50": "#1a1b1f",
    "neutral100": "#000000",
    "neutral200": "#ffffff",
    "neutral300": "#fff7e7"
  },
  "fonts": {
    "body": "'Gilroy', sans-serif"
  },
  "fontSizes": {
    "16": "16px",
    "20": "20px",
    "25": "25px",
    "30": "30px",
    "50": "50px"
  },
  "space": {
    "5": "5px",
    "40": "40px",
    "100": "100px",
    "234": "234px"
  },
  "radii": {
    "md": "8px",
    "lg": "16px",
    "full": "60px"
  },
  "shadows": {
    "sm": "rgb(0, 0, 0) 0px 5px 0px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#e84855",
      "light": "hsl(355, 78%, 75%)",
      "dark": "hsl(355, 78%, 45%)"
    },
    "secondary": {
      "main": "#2e519f",
      "light": "hsl(221, 55%, 55%)",
      "dark": "hsl(221, 55%, 25%)"
    },
    "background": {
      "default": "#fff7e7",
      "paper": "#000000"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#1a1b1f"
    }
  },
  "typography": {
    "fontFamily": "'DM Sans', sans-serif",
    "h1": {
      "fontSize": "50px",
      "fontWeight": "900",
      "lineHeight": "45px"
    },
    "h2": {
      "fontSize": "25px",
      "fontWeight": "600",
      "lineHeight": "36px"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "400",
      "lineHeight": "28px"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "normal"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgb(0, 0, 0) 0px 5px 0px 0px"
  ]
};

export default theme;
