export function formatINR(value) {
  if (value == null) return '0'
  try {
    return Number(value).toLocaleString('en-IN')
  } catch (e) {
    return String(value)
  }
}
