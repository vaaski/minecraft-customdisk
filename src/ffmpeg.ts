import { mkdir } from "node:fs/promises"
import { INTERMEDIARY_FOLDER } from "./util"

export const transformTracks = async (transformMap: Map<string, string>) => {
	await mkdir(INTERMEDIARY_FOLDER, { recursive: true })

	for (const [input, output] of transformMap) {
		const process = Bun.spawn(["ffmpeg", "-i", input, "-ac", "1", output], {
			stdout: "inherit",
		})
		console.log(await process.exited)
	}
}
