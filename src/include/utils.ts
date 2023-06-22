export function clean(target: Record<string, any>): object {
  for (const k in target) {
    if (target[k] === undefined) delete target[k]
  }
  return target
}

export function truncate(str: string, len: number = 10): string {
    return (str.length > (len)) ? `${str.slice(0, (len))}...` : str;
}

export function translate(id: string, default_?: string): string {
  return Scratch.translate({
    id: id,
    default: default_ || "",
  })
}
