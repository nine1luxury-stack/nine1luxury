import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { amiriFont } from './fonts/amiri';

/**
 * Reshapes Arabic text for PDF display (Visual Arabic)
 * Handles connectivity, ligatures (Lam-Alif), and mixed text reversal
 */
export function reshapeArabic(text: string): string {
    if (!text) return "";

    // Check if it contains Arabic
    if (!/[\u0600-\u06FF]/.test(text)) return text;

    // Helper to check if a character is Arabic
    const isArabic = (char: string) => /[\u0600-\u06FF]/.test(char);

    // 1. Initial Reshaping (Connectivity)
    // We use a simplified mapping of Presentation Forms B
    // isolated, initial, medial, final
    const map: Record<number, number[]> = {
        0x0627: [0xFE8D, 0xFE8D, 0xFE8E, 0xFE8E], // Alif
        0x0628: [0xFE8F, 0xFE91, 0xFE92, 0xFE90], // Ba
        0x062A: [0xFE95, 0xFE97, 0xFE98, 0xFE96], // Ta
        0x062B: [0xFE99, 0xFE9B, 0xFE9C, 0xFE9A], // Tha
        0x062C: [0xFE9D, 0xFE9F, 0xFEA0, 0xFE9E], // Jeem
        0x062D: [0xFEA1, 0xFEA3, 0xFEA4, 0xFEA2], // Hha
        0x062E: [0xFEA5, 0xFEA7, 0xFEA8, 0xFEA6], // Kha
        0x062F: [0xFEA9, 0xFEA9, 0xFEAA, 0xFEAA], // Dal
        0x0630: [0xFEAB, 0xFEAB, 0xFEAC, 0xFEAC], // Thal
        0x0631: [0xFEAD, 0xFEAD, 0xFEAE, 0xFEAE], // Ra
        0x0632: [0xFEAF, 0xFEAF, 0xFEB0, 0xFEB0], // Zain
        0x0633: [0xFEB1, 0xFEB3, 0xFEB4, 0xFEB2], // Seen
        0x0634: [0xFEB5, 0xFEB7, 0xFEB8, 0xFEB6], // Sheen
        0x0635: [0xFEB9, 0xFEBB, 0xFEBC, 0xFEBA], // Sad
        0x0636: [0xFEBD, 0xFEBF, 0xFEC0, 0xFEBE], // Dad
        0x0637: [0xFEC1, 0xFEC3, 0xFEC4, 0xFEC2], // Tah
        0x0638: [0xFEC5, 0xFEC7, 0xFEC8, 0xFEC6], // Zah
        0x0639: [0xFEC9, 0xFECB, 0xFECC, 0xFECA], // Ain
        0x063A: [0xFECD, 0xFECF, 0xFED0, 0xFECE], // Ghain
        0x0641: [0xFED1, 0xFED3, 0xFED4, 0xFED2], // Fa
        0x0642: [0xFED5, 0xFED7, 0xFED8, 0xFED6], // Qaf
        0x0643: [0xFED9, 0xFEDB, 0xFEDC, 0xFEDA], // Kaf
        0x0644: [0xFEDD, 0xFEDF, 0xFEE0, 0xFEDE], // Lam
        0x0645: [0xFEE1, 0xFEE3, 0xFEE4, 0xFEE2], // Meem
        0x0646: [0xFEE5, 0xFEE7, 0xFEE8, 0xFEE6], // Noon
        0x0647: [0xFEE9, 0xFEEB, 0xFEEC, 0xFEEA], // Heh
        0x0648: [0xFEED, 0xFEED, 0xFEEE, 0xFEEE], // Waw
        0x064A: [0xFEF1, 0xFEF3, 0xFEF4, 0xFEF2], // Yeh
        0x0621: [0xFE80, 0xFE80, 0xFE80, 0xFE80], // Hamza
        0x0622: [0xFE81, 0xFE81, 0xFE82, 0xFE82], // Alif Madda
        0x0623: [0xFE83, 0xFE83, 0xFE84, 0xFE84], // Alif Hamza Above
        0x0624: [0xFE85, 0xFE85, 0xFE86, 0xFE86], // Waw Hamza Above
        0x0625: [0xFE87, 0xFE87, 0xFE88, 0xFE88], // Alif Hamza Below
        0x0626: [0xFE89, 0xFE8B, 0xFE8C, 0xFE8A], // Yeh Hamza Above
        0x0629: [0xFE93, 0xFE93, 0xFE94, 0xFE94], // Ta Marbuta
        0x0649: [0xFEEF, 0xFEEF, 0xFEF0, 0xFEF0], // Alef Maksura
    };

    const rightConnecting = [0x0627, 0x0622, 0x0623, 0x0625, 0x062F, 0x0630, 0x0631, 0x0632, 0x0648, 0x0629];

    let reshaped = "";

    // Process text to handle special ligatures like Lam-Alif
    const processedText = text
        .replace(/\u0644\u0627/g, '\uFEFB')
        .replace(/\u0644\u0622/g, '\uFEF5')
        .replace(/\u0644\u0623/g, '\uFEF7')
        .replace(/\u0644\u0625/g, '\uFEF9');

    const chars = Array.from(processedText);
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const code = char.charCodeAt(0);
        const forms = map[code];

        if (!forms) {
            reshaped += char;
            continue;
        }

        const prev = chars[i - 1]?.charCodeAt(0);
        const next = chars[i + 1]?.charCodeAt(0);

        const prevConnects = prev && map[prev] && !rightConnecting.includes(prev);
        const nextConnects = next && map[next];

        if (prevConnects && nextConnects) reshaped += String.fromCharCode(forms[2]);
        else if (prevConnects) reshaped += String.fromCharCode(forms[3]);
        else if (nextConnects) reshaped += String.fromCharCode(forms[1]);
        else reshaped += String.fromCharCode(forms[0]);
    }

    // 2. Handle RTL Reversal by splitting into segments
    // Mixed text reversal: "Report 2024" should stay "Report 2024" but "تقرير" -> "ري ر ق ت"
    const segments = reshaped.split(/([^\u0600-\u06FF\uFE70-\uFEFF\s]+)/);

    return segments.map(segment => {
        if (isArabic(segment)) {
            // Character-by-character reverse for Arabic segments
            return segment.split("").reverse().join("");
        }
        return segment;
    }).reverse().join("");
}

export function createArabicPDF() {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true
    });

    // Add font and set as default
    doc.addFileToVFS('Amiri-Regular.ttf', amiriFont);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    return doc;
}

export { autoTable };
