export type ErrRes = {
    error: string
}

export function ErrRes(e: Error | string | unknown): ErrRes {
    return {error: e instanceof Error ? e.message : typeof e === 'string' ? e : "Something went wrong"};
}

export function deleteUndefinedFields(o: object) {
    for (let _key in o) {
        let key = _key as keyof typeof o;
        if (o[key] === undefined) {
            delete o[key];
        }
    }
}

export function isOfType(o: unknown, properties: Record<string, (x: unknown) => boolean>): boolean {
    if (!(typeof o === "object" && o !== null)) {
        return false;
    }

    for (let key of Object.keys(properties)) {
        if (!(key in o && properties[key]((o as Record<string, unknown>)[key]))) {
            return false;
        }
    }

    return true;
}