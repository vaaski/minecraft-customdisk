import { type InputTrack } from "./util"

export const transformTracks = async (transformSet: Set<InputTrack>) => {
	for (const item of transformSet) {
		const process = Bun.spawn([
			"ffmpeg",
			"-i",
			item.inputPath,
			"-ac",
			"1",
			item.intermediaryPath,
		])

		await process.exited
	}
}

export const getDuration = async (path: string) => {
	const process = Bun.spawn([
		"ffprobe",
		"-v",
		"error",
		"-show_entries",
		"format=duration",
		"-of",
		"default=noprint_wrappers=1:nokey=1",
		path,
	])

	const text = await new Response(process.stdout).text()

	return Number.parseFloat(text)
}
