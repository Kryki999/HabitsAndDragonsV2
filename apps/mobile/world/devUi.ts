let opener: (() => void) | null = null;

export function registerDevOpener(fn: (() => void) | null) {
  opener = fn;
}

export function requestOpenDevTools() {
  opener?.();
}
