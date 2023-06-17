export function clean(target: Record<string, any>): object {
  for (const k in target) {
    if (target[k] === undefined) delete target[k]
  }
  return target
}

export function truncate(str: string, len: number = 10): string {
    return (str.length > (len)) ? `${str.slice(0, (len))}...` : str;
}

export async function translate(text: string, from: string, to: string): Promise<string> {
  const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
  const data = await resp.json();
  const result = data.responseData.translatedText;
  if (result === undefined) throw new Error('Translation failed.');
  return result;
}
