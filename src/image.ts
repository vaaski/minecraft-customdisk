import { readdir } from "node:fs/promises"
import { COLOR_DISK_FOLDER } from "./util"
import path from "node:path"

/**
 * @param amount imagemagick takes a number between 0 and 200
 */
export const hueRotateCopy = async (
	inputPath: string,
	outputPath: string,
	amount: number,
) => {
	const process = Bun.spawn(
		["magick", "convert", inputPath, "-modulate", `100,100,${amount}`, outputPath],
		{ stderr: "ignore" },
	)

	await process.exited
}

const diskImagesRaw = await readdir(COLOR_DISK_FOLDER)
const diskImages = diskImagesRaw.filter((file) => file.endsWith(".png"))

export const getRandomDiskImage = (seed: number) => {
	const randomDisk = diskImages[Math.floor(seed * diskImages.length)]
	return path.join(COLOR_DISK_FOLDER, randomDisk)
}
