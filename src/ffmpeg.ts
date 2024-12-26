import { mkdir } from "node:fs/promises"
import { INTERMEDIARY_FOLDER, type InputTrack } from "./util"

export const transformTracks = async (transformSet: Set<InputTrack>) => {
	await mkdir(INTERMEDIARY_FOLDER, { recursive: true })

	for (const item of transformSet) {
		const process = Bun.spawn(
			["ffmpeg", "-i", item.inputPath, "-ac", "1", item.intermediaryPath],
			{
				stdout: "inherit",
			},
		)
		console.log(await process.exited)
	}
}
