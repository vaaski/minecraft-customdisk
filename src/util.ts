import path from "node:path"

export type OutputFile = {
	path: string
	contents: string
}

export type InputTrack = {
	inputName: string
	inputPath: string

	transformedName: string

	intermediaryPath: string
}

export const stringify = (object: Parameters<typeof JSON.stringify>[0]) => {
	return JSON.stringify(object, undefined, 2)
}

export const PACK_PREFIX = "customdisk"

export const ROOT_FOLDER = path.join(import.meta.dir, "..")

export const INPUT_FOLDER = path.join(ROOT_FOLDER, "input")
export const INTERMEDIARY_FOLDER = path.join(ROOT_FOLDER, "intermediary")
export const OUTPUT_FOLDER = path.join(ROOT_FOLDER, "output")

export const DATAPACK_FOLDER = path.join(OUTPUT_FOLDER, `${PACK_PREFIX}-datapack`)
export const RESOURCEPACK_FOLDER = path.join(OUTPUT_FOLDER, `${PACK_PREFIX}-resourcepack`)
