import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { amiriFont } from './fonts/amiri';

/**
 * Basic Arabic reshaper logic to handle connected letters in PDF
 * This is a simplified version of many open-source Arabic reshapers
 */
const reshaperMap: Record<string, string[]> = {
    // isolated, initial, medial, final
    '\u0627': ['\uFE8D', '\uFE8D', '\uFE8E', '\uFE8E'], // Alif
    '\u0628': ['\uFE8F', '\uFE91', '\uFE92', '\uFE90'], // Ba
    '\u062A': ['\uFE95', '\uFE97', '\uFE98', '\uFE96'], // Ta
    '\u062B': ['\uFE99', '\uFE9B', '\uFE9C', '\uFE9A'], // Tha
    '\u062C': ['\uFE9D', '\uFE9F', '\uFEA0', '\uFE9E'], // Jeem
    '\u062D': ['\uFEA1', '\uFEA3', '\uFEA4', '\uFEA2'], // Hha
    '\u062E': ['\uFEA5', '\uFEA7', '\uFEA8', '\uFEA6'], // Kha
    '\u062F': ['\uFEA9', '\uFEA9', '\uFEAA', '\uFEAA'], // Dal
    '\u0630': ['\uFEAB', '\uFEAB', '\uFEAC', '\uFEAC'], // Thal
    '\u0631': ['\uFEAD', '\uFEAD', '\uFEAE', '\uFEAE'], // Ra
    '\u0632': ['\uFEAF', '\uFEAF', '\uFEB0', '\uFEB0'], // Zain
    '\u0633': ['\uFEB1', '\uFEB3', '\uFEB4', '\uFEB2'], // Seen
    '\u0634': ['\uFEB5', '\uFEB7', '\uFEB8', '\uFEB6'], // Sheen
    '\u0635': ['\uFEB9', '\uFEBB', '\uFEBC', '\uFEBA'], // Sad
    '\u0636': ['\uFEBD', '\uFEBF', '\uFEC0', '\uFEBE'], // Dad
    '\u0637': ['\uFEC1', '\uFEC3', '\uFEC4', '\uFEC2'], // Tah
    '\u0638': ['\uFEC5', '\uFEC7', '\uFEC8', '\uFEC6'], // Zah
    '\u0639': ['\uFEC9', '\uFECB', '\uFECC', '\uFECA'], // Ain
    '\u063A': ['\uFECD', '\uFECF', '\uFED0', '\uFECE'], // Ghain
    '\u0641': ['\uFED1', '\uFED3', '\uFED4', '\uFED2'], // Fa
    '\u0642': ['\uFED5', '\uFED7', '\uFED8', '\uFED6'], // Qaf
    '\u0643': ['\uFED9', '\uFEDB', '\uFEDC', '\uFEDA'], // Kaf
    '\u0644': ['\uFEDD', '\uFEDF', '\uFEE0', '\uFEDE'], // Lam
    '\u0645': ['\uFEE1', '\uFEE3', '\uFEE4', '\uFEE2'], // Meem
    '\u0646': ['\uFEE5', '\uFEE7', '\uFEE8', '\uFEE6'], // Noon
    '\u0647': ['\uFEE9', '\uFEEB', '\uFEEC', '\uFEEA'], // Heh
    '\u0648': ['\uFEED', '\uFEED', '\uFEEE', '\uFEEE'], // Waw
    '\u064A': ['\uFEF1', '\uFEF3', '\uFEF4', '\uFEF2'], // Yeh
    '\u0621': ['\uFE80', '\uFE80', '\uFE80', '\uFE80'], // Hamza
    '\u0622': ['\uFE81', '\uFE81', '\uFE82', '\uFE82'], // Alif Madda
    '\u0623': ['\uFE83', '\uFE83', '\uFE84', '\uFE84'], // Alif Hamza Above
    '\u0624': ['\uFE85', '\uFE85', '\uFE86', '\uFE86'], // Waw Hamza Above
    '\u0625': ['\uFE87', '\uFE87', '\uFE88', '\uFE88'], // Alif Hamza Below
    '\u0626': ['\uFE89', '\uFE8B', '\uFE8C', '\uFE8A'], // Yeh Hamza Above
    '\u0629': ['\uFE93', '\uFE93', '\uFE94', '\uFE94'], // Ta Marbuta
    '\u0649': ['\uFEEF', '\uFEEF', '\uFEF0', '\uFEF0'], // Alef Maksura
};

const rightConnectingChars = ['\u0627', '\u0622', '\u0623', '\u0625', '\u062F', '\u0630', '\u0631', '\u0632', '\u0648', '\u0629'];

export function reshapeArabic(text: string): string {
    if (!text) return "";

    // Check if it contains Arabic
    if (!/[\u0600-\u06FF]/.test(text)) return text;

    let result = "";
    const chars = Array.from(text);
    const reshaped = new Array(chars.length);

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const forms = reshaperMap[char];

        if (!forms) {
            reshaped[i] = char;
            continue;
        }

        const prev = chars[i - 1];
        const next = chars[i + 1];

        const prevHasForms = reshaperMap[prev];
        const nextHasForms = reshaperMap[next];

        const connectsToPrev = prevHasForms && !rightConnectingChars.includes(prev);
        const connectsToNext = nextHasForms;

        if (connectsToPrev && connectsToNext) {
            reshaped[i] = forms[2]; // medial
        } else if (connectsToPrev) {
            reshaped[i] = forms[3]; // final
        } else if (connectsToNext) {
            reshaped[i] = forms[1]; // initial
        } else {
            reshaped[i] = forms[0]; // isolated
        }
    }

    // Special Lam-Alif handling could be added here, but keep it simple
    return reshaped.reverse().join(""); // Reverse for RTL in jsPDF
}

export function createArabicPDF() {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true
    });

    // Add font
    doc.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    return doc;
}

export { autoTable };
