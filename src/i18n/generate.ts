import { I18nConfig } from "../include/option";

export const transformer: Record<string, string> = {
    "en": "en",
    "zh": "zh-cn",
}

async function _translate(text: string, from: string, to: string): Promise<string> {
  if (from === to || text.length === 0) return text;
  const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
  const data = await resp.json();
  return data.responseData.translatedText;
}

export async function translate(text: string, from: string, to: string): Promise<string> {
  const keys: string[] = text.match(/\[\S*:\S*]/ig) || [];
  for (let i = 0; i < keys.length; i++)
    text = text.replace(keys[i], `[${i}]`);

  let result = await _translate(text, from, to);
  if (result === undefined) throw new Error('Translation failed.');
  let values: string[] = text.match(/\d+/ig) || [];
  for (let i = 0; i < values.length; i++) {
    const key: string = keys[parseInt(values[i])].slice(1, -1).split(':')[0];
    result = result.replace(`[${i}]`, `[${key}]`);
  }
  return result;
}

async function test(): Promise<void> {
  console.debug('Testing translation...');
  const text = await translate('Hello world!', 'en', 'zh-cn');
  if (text === undefined || text.trim().length === 0 || text === 'Hello world!')
    throw new Error('Translation test failed.');
  console.debug(`Translation test \u001b[32mpassed\u001b[0m.`);
}
export async function process_i18n(blocks: Record<string, string>, option: I18nConfig): Promise<void> {
  await test();
  const len: number = Object.keys(blocks).length, time = Date.now();
  const from = option.source || 'en',
    to = option.accept ||  ['en', 'zh'];
  const result: Record<string, Record<string, string>> = {};
  for (const lang of to) result[lang] = {};

  console.info(`Detected \u001b[34m${len}\u001b[0m blocks.`);
  for (const opcode in blocks) {
    console.debug(`> Processing block \u001b[36m${opcode}\u001b[0m.`);
    for (const lang of to) {
      const text: string = await translate(blocks[opcode].trim(), transformer[from], transformer[lang]);
      result[lang][opcode] = text;
      console.debug(`  \u001b[32m${lang}\u001b[0m: ${text}`);
    }
  }

  const { writeFileSync } = require('fs');
  writeFileSync(
    './src/i18n/source.json',
    JSON.stringify(result, null, 2),
  );
  console.info(`\nTranslation compiled \u001b[32msuccessfully\u001b[0m in \u001b[35m${Date.now() - time}\u001b[0m ms.`);
  process.exit(0);
}
