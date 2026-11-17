/** Intl usa espacios de no separación (U+00A0, U+202F); los normalizamos para que las expectativas sean legibles. */
const NON_BREAKING = new RegExp(`[${String.fromCharCode(0x00a0, 0x202f)}]`, 'g');

export function plain(text: string | null | undefined): string {
  return (text ?? '').replace(NON_BREAKING, ' ').replace(/\s+/g, ' ');
}
