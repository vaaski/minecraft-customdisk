import path from "node:path"

export type OutputFile = {
	path: string
	contents: string
}

export const stringify = (object: Parameters<typeof JSON.stringify>[0]) => {
	return JSON.stringify(object, undefined, 2)
}

export const INPUT_FOLDER = "input"
export const INTERMEDIARY_FOLDER = "intermediary"
export const ROOT_FOLDER = path.join(import.meta.dir, "..")
export const PACK_PREFIX = "customdisk"
