export function isComplete(input, target) {
  return input === target;
}

export function firstMismatch(input, target) {
  const n = Math.min(input.length, target.length);
  for (let i = 0; i < n; i++) {
    if (input[i] !== target[i]) return i;
  }
  if (input.length < target.length) return input.length;
  return -1;
}
