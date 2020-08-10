export function removeFileExtension(str) {
  return str.replace(/\.[^/.]+$/, "");
}
