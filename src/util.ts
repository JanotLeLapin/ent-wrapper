/**
 * Encodes string to an url.
 * @param str The string to encode
 */
export const encodeUrl = (str: string) =>
  encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');

/**
 * Converts raw html into plain text.
 * @param html The html
 */
export const htmlToText = (html: string) =>
  html
    .replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '  *  ')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/gi, '')
    .replace(/&egrave;/g, 'è')
    .replace(/&eacute;/g, 'é')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&euml;/g, 'ë')

    .replace(/&agrave;/g, 'à')
    .replace(/&acirc;/g, 'ä')
    .replace(/&auml;/g, 'â')

    .replace(/&ograve;/g, 'ò')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ouml;/g, 'ö')

    .replace(/&igrave;/g, 'ì')
    .replace(/&icirc;/g, 'î')
    .replace(/&iuml;/g, 'ï')

    .replace(/&ugrave;/g, 'ù')
    .replace(/&uuml;/g, 'ü')
    .replace(/&ucirc;/g, 'û')
    .replace(/&#(\d+);/g, (_match, num) =>
      String.fromCharCode(parseInt(num, 10))
    );

/**
 * Checks if a response contains an error and rejects it.
 * @param res The node fetch json response
 * @param reject The promise reject function
 */
export const error = (res: any, reject: (reason: any) => void) => {
  if (res.error) {
    try {
      reject(JSON.parse(res.error));
    } catch {
      reject(res.error);
    }
    return true;
  }
  return false;
};

/**
 * Processes cookies and returns them.
 * @param cookies The cookies
 */
export const processCookies = (cookies: string[]) =>
  cookies.map((cookie) => cookie.split('; ')[0]).join('; ');
