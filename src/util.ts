/**
 * Encodes string to an url.
 * @param str The string to encode
 */
export const encodeUrl = (str: string) => encodeURIComponent(str).replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
