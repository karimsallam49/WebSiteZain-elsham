export function throttle<A extends unknown[]>(
  fn: (...args: A) => void,
  wait: number
): (...args: A) => void {
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: A | null = null;

  const invoke = () => {
    lastTime = Date.now();
    timer = null;
    if (pendingArgs) {
      fn(...pendingArgs);
      pendingArgs = null;
    }
  };

  return (...args: A) => {
    const remaining = wait - (Date.now() - lastTime);
    if (remaining <= 0) {
      lastTime = Date.now();
      fn(...args);
    } else {
      pendingArgs = args;
      if (!timer) timer = setTimeout(invoke, remaining);
    }
  };
}
