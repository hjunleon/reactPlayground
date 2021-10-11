
export function unicodeBase64Decode(text) { return decodeURIComponent(Array.prototype.map.call(window.atob(text), function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); }


