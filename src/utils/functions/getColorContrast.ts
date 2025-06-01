export function getColorContrast(hex: string): {contract: string, transparent: string} {
    const cleanHex = hex?.replace('#', '');

    const r = parseInt(cleanHex?.slice(0, 2), 16);
    const g = parseInt(cleanHex?.slice(2, 4), 16);
    const b = parseInt(cleanHex?.slice(4, 6), 16);

    const transparent = `rgba(${r}, ${g}, ${b}, 0.2)`;

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return {
        contract: luminance > 0.6 ? '#000000' : '#FFFFFF',
        transparent: transparent
    };
}