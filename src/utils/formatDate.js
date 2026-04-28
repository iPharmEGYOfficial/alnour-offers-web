export function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("ar-SA");
  } catch {
    return "";
  }
}









