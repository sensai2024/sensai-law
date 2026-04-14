import DOMPurify from 'dompurify';

/**
 * Cleans the raw HTML string representing a contract.
 * @param {string} rawHtml
 * @returns {string} Sanitized clean HTML body
 */
export function cleanContractHtml(rawHtml) {
  if (!rawHtml) return '';

  // 1. If duplicated document, keep only the first copy
  // A simple way to detect duplication is to split by "</html>" and take the first part
  let firstDoc = rawHtml.split(/<\/html>/i)[0];
  if (firstDoc !== rawHtml && !firstDoc.trim().endsWith('</html>')) {
    firstDoc += '</html>'; // Add it back if we split and it didn't end with it
  }

  // 2. Remove outer document tags (<!doctype html>, <html>, <head>...</head>, <body>, </body>, </html>)
  let bodyContent = firstDoc;
  const bodyMatch = firstDoc.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    bodyContent = bodyMatch[1];
  } else {
    // If no body tags, strip typical outer tags just in case
    bodyContent = bodyContent
      .replace(/<!doctype html>/gi, '')
      .replace(/<html[^>]*>/gi, '')
      .replace(/<\/html>/gi, '')
      .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
      .replace(/<body[^>]*>/gi, '')
      .replace(/<\/body>/gi, '');
  }

  // 3. Sanitize final HTML before rendering
  const cleanHtml = DOMPurify.sanitize(bodyContent);

  return cleanHtml;
}
