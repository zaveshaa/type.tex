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

export function classify(input, target) {
  const out = [];
  for (let i = 0; i < input.length; i++) {
    out.push(input[i] === target[i] ? 'ok' : 'bad');
  }
  return out;
}

export function wpm(correctChars, elapsedMs) {
  if (elapsedMs < 500) return 0;
  return Math.round((correctChars / 5) / (elapsedMs / 60000));
}

export function accuracy(okKeys, totalKeys) {
  if (totalKeys === 0) return 100;
  return Math.round((okKeys / totalKeys) * 100);
}
