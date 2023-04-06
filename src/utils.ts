export function cleanObject (target: Record<string, any>): object {
  for (const k in target) {
    if (target[k] === undefined) delete target[k]
  }
  return target
}

export function notification (content: string): void {
  // @ts-expect-error
  top.mdui.snackbar(content)
}
