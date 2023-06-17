import { truncate } from "./utils";

export default class Cache {
    /**
     * Cache Manager.
     *
     * Structure:
     * e.g.
     *
     * opcode
     *  - expiration (secs)
     *  - data
     *    - key1
     *      - json args
     *      - stamp
     *    - key2
     *    ...
     *
     */

    protected caches: Record<
        string, // opcode
        {
            data: Record<string, {
                value: any,
                stamp: number,
            }>,
            expiration: number,
        }
    >;
    public secs: number;
    public debug: boolean;

    public constructor(secs ?: number, debug ?: boolean) {
        this.caches = {};
        this.secs = secs || 60;
        this.debug = debug || false;
        this.start();
    }

    public register(tag: string, expiration: number) {
        this.caches[tag] = {
            data: {},
            expiration: expiration,
        }
    }

    static is_expired(stamp: number, expiration: number): boolean {
        return expiration === 0 ? false : (new Date().getTime() / 1000) > (stamp + expiration);
    }

    public is_registered(tag: string): boolean {
        return this.caches[tag] !== undefined;
    }

    public exist(tag: string, key: string): boolean {
        if (!this.is_registered(tag)) return false;
        return this.caches[tag].data[key] !== undefined;
    }

    public is_available(tag: string, key: string): boolean {
        if (!this.exist(tag, key)) return false;
        const { data, expiration } = this.caches[tag];
        return !Cache.is_expired(data[key].stamp, expiration);
    }

    public get(tag: string, key: string): undefined | any {
        if (!this.is_available(tag, key)) return undefined;
        return JSON.parse(this.caches[tag].data[key].value);
    }

    public set(tag: string, key: string, value: any, stamp: number): void {
        if (!this.is_registered(tag)) return;
        this.caches[tag].data[key] = {
            value: JSON.stringify(value),
            stamp: stamp,
        }
    }

    remove(tag: string, key: string): boolean {
        if (!this.exist(tag, key)) return false;
        delete this.caches[tag].data[key];
        return true;
    }

    start(): void {
        const _this = this;
        setInterval(() => {
            let count: number = 0;
            for (const tag in _this.caches) {
                const { data, expiration } = _this.caches[tag];
                for (const key in data) {
                    if (Cache.is_expired(data[key].stamp, expiration)) {
                        count ++;
                        delete data[key];
                    }
                }
            }
            if (count && _this.debug) console.debug(`[Cache] ${count} items expired.`);
        }, this.secs * 1000);
    }

    public cache_async(tag: string, func: (...params: any[]) => Promise<any>): (...params: any[]) => Promise<any> {
        /**
         * Async Function Cache.
         */
        const _this = this;
        return async function(...params: any[]) {
            const key = JSON.stringify(params);
            if (_this.is_available(tag, key)) {
                if (_this.debug) console.log(`[Cache] ${tag}(${truncate(key)}) hit.`);
                return _this.get(tag, key);
            }
            const stamp = new Date().getTime() / 1000;
            const result = await func(...params);
            _this.set(tag, key, result, stamp);
            return result;
        }
    }

    public cache_sync(tag: string, func: (...params: any[]) => any): (...params: any[]) => any {
        /**
         * Sync Function Cache.
         */
        const _this = this;
        return function(...params: any[]) {
            const key = JSON.stringify(params);
            if (_this.is_available(tag, key)) {
                if (_this.debug) console.log(`[Cache] ${tag}(${truncate(key)}) hit.`);
                return _this.get(tag, key);
            }
            const stamp = new Date().getTime() / 1000;
            const result = func(...params);
            _this.set(tag, key, result, stamp);
            return result;
        }
    }

    public cache(tag: string, func: (...params: any[]) => any): (...params: any[]) => any {
        /**
         * Function Cache.
         */
        if (func.constructor.name === 'AsyncFunction') {
            return this.cache_async(tag, func);
        } else {
            return this.cache_sync(tag, func);
        }
    }
}
