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

class Cache {
  protected caches: Record<string, Record<string, any>>;
  constructor() {
    this.caches = {};
    this.uptime();
  }

  get(key: string): undefined | any {
    const value = this.caches[key];
    if (this.exist(key)) {
      return JSON.parse(value.value);
    }
  }

  set(key: string, value: any, expiration: number): void {
    this.caches[key] = {
      value: JSON.stringify(value),
      expiration: (new Date().getTime() / 1000) + expiration,
    }
  }

  exist(key: string): boolean {
    const value = this.caches[key];
    return (!!value) && (value.expiration > (new Date().getTime() / 1000));
  }

  remove(key: string): boolean {
    return delete this.caches[key];
  }

  uptime(): void {
    const _this = this;
    setInterval(function (){
      let n: number = 0;
      for (const key in _this.caches) {
        if (_this.caches[key].expiration < (new Date().getTime() / 1000)) {
          _this.remove(key); n++;
        }
      }
    }, 60000);
  }

  cache_async(name: string, func: (...params: any[]) => Promise<any>, expiration: number): (...params: any[]) => Promise<any> {
    /**
     * Async Function Cache.
     */

    const _this: Cache = this;
    return async function (...params : any[]) {
      const key: string = name + params.toString();
      if (_this.exist(key)) {
        return _this.get(key);
      } else {
        const response: any = await func(...params);
        _this.set(key, response, expiration);
        return response;
      }
    }
  }
}

export const cache = new Cache();
