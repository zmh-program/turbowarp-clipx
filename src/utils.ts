export function cleanObject(target: object): object {
    for (const k in target) {   /** @ts-ignore */
        if (target[k] === undefined) delete target[k];
    }
    return target;
}
