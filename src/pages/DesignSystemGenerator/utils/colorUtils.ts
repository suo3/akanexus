import { interpolate, samples, formatHex, formatHsl, formatRgb, parse } from "culori";

export type ColorScale = {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
};

export const generateColorScale = (baseColor: string): ColorScale => {
    // Use OKLCH for better perceptual uniformity
    const interpolator = interpolate(["#ffffff", baseColor, "#000000"], "oklch");

    // We want 11 points: 50 (near white) to 950 (near black)
    // Samples will give us evenly spaced points. 
    // 50 is at ~0.05, 500 (base) is at 0.5, 950 is at ~0.95
    // However, simple linear mapping isn't always best.
    // Tailwind's 500 is typically the base color.

    const scale = {
        50: formatHex(interpolator(0.05)),
        100: formatHex(interpolator(0.1)),
        200: formatHex(interpolator(0.2)),
        300: formatHex(interpolator(0.3)),
        400: formatHex(interpolator(0.4)),
        500: formatHex(baseColor), // Enforce base color as 500
        600: formatHex(interpolator(0.6)),
        700: formatHex(interpolator(0.7)),
        800: formatHex(interpolator(0.8)),
        900: formatHex(interpolator(0.9)),
        950: formatHex(interpolator(0.95)),
    };

    return scale as ColorScale;
};

export const getColorContrast = (bgColor: string) => {
    const c = parse(bgColor);
    if (!c) return "black";

    // Simple brightness check
    const rgb = formatRgb(c);
    if (!rgb) return "black";

    // Extract numbers from "rgb(r, g, b)"
    const matches = rgb.match(/\d+/g);
    if (!matches) return "black";

    const [r, g, b] = matches.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "black" : "white";
};
