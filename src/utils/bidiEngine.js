export const detectDirection = (text, defaultDir = "rtl") => {
  if (!text || !text.trim()) return defaultDir;

  const firstLetter = text.match(/[a-zA-Z\u0600-\u06FF]/)?.[0];
  if (!firstLetter) return defaultDir;

  return /\p{Script=Arabic}/u.test(firstLetter) ? "rtl" : "ltr";
};
