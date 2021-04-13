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
