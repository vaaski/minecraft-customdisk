import { readFile } from "node:fs/promises"
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

// -----------------------------------------------------------------------------

export const PACK_PREFIX = "customdisk"

export const ROOT_FOLDER = path.join(import.meta.dir, "..")

export const INPUT_FOLDER = path.join(ROOT_FOLDER, "input")
export const INTERMEDIARY_FOLDER = path.join(ROOT_FOLDER, "intermediary")
export const OUTPUT_FOLDER = path.join(ROOT_FOLDER, "output")

export const DATAPACK_FOLDER = path.join(OUTPUT_FOLDER, `${PACK_PREFIX}-datapack`)
export const RESOURCEPACK_FOLDER = path.join(OUTPUT_FOLDER, `${PACK_PREFIX}-resourcepack`)

export const DEFAULT_ICON = path.join(ROOT_FOLDER, "assets/disk.png")
export const COLOR_DISK_FOLDER = path.join(ROOT_FOLDER, "assets/disks")

export const stringify = (object: Parameters<typeof JSON.stringify>[0]) => {
	return JSON.stringify(object, undefined, 2)
}

export const fileSHA1 = async (path: string) => {
	const file = await readFile(path)
	const hash = await crypto.subtle.digest("SHA-1", file)

	return [...new Uint8Array(hash)]
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("")
}

export const sha1ToSeed = (sha1: string) => {
	const buffer = Buffer.from(sha1, "hex")
	const hashBytes = [...buffer]

	let largeNumber = 0
	for (const byte of hashBytes) {
		largeNumber = largeNumber * 256 + byte // equivalent to left shifting by 8 bits and adding the byte
	}

	// Normalize the large number to a value between 0 and 1.
	return largeNumber / (256 ** 20 - 1) //256^20 is the maximum possible value (all bytes are 255)
}

// -----------------------------------------------------------------------------

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
