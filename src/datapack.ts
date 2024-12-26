import { PACK_PREFIX, type InputTrack, type OutputFile } from "./util"

export const functions = (transformSet: Set<InputTrack>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const item of transformSet) {
		outputFiles.push({
			path: `data/${PACK_PREFIX}/function/${item.transformedName}.mcfunction`,
			contents: [
				`# give disc "${item.inputName}" to player`,
				"",
				`give @s minecraft:music_disc_11[minecraft:jukebox_playable={song:"${PACK_PREFIX}:${item.transformedName}"}]`,
			].join("\n"),
		})
	}

	return outputFiles
}
