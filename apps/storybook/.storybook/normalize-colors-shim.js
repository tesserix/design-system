// Shim for @react-native/normalize-colors
// react-native-web handles colors internally, so we just pass them through
export default function normalizeColor(color) {
  return color;
}
