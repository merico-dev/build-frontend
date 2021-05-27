export function ellipsis (input, length = 52) {
  return input.length >= length ? `${input.substring(0, length)}...` : input
}
