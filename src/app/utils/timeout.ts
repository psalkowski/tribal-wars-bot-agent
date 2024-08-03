let timeouts: NodeJS.Timeout[] = [];

export function timeout(callback: () => void, ms: number) {
  timeouts.push(setTimeout(callback, ms));
}

export function clearTimeouts() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
}
