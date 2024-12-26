import path from "node:path"

export type OutputFile = {
	path: string
	contents: string
}

export type InputTrack = {
	inputName: string
	inputPath: string
	inputDurationSeconds: number

	transformedName: string
	diskName: string

	intermediaryPath: string
}

export type InputResourcePack = {
	metadata: PackMeta
	path: string
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

export const DEFAULT_ICON = path.join(ROOT_FOLDER, "assets/disk.png")

export type PackMeta = {
	pack: Pack
	overlays?: Overlays
}

export type Pack = {
	pack_format: number
	supported_formats?: Format
	description: string
}

export type Format = number[] | number | { min_inclusive: number; max_inclusive: number }

export type Overlays = {
	entries: Entry[]
}

export type Entry = {
	formats: Format
	directory: string
}
