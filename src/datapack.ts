import { PACK_PREFIX, stringify, type InputTrack, type OutputFile } from "./util"

export const functions = (transformSet: Set<InputTrack>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const [index, item] of [...transformSet].entries()) {
		outputFiles.push({
			path: `data/${PACK_PREFIX}/function/${item.transformedName}.mcfunction`,
			contents: [
				`# give disc "${item.inputName}" to player`,
				`give @s minecraft:music_disc_11[minecraft:jukebox_playable={song:"${PACK_PREFIX}:${item.transformedName}"},minecraft:custom_model_data=${index + 1}]`,
			].join("\n"),
		})
	}

	outputFiles.push({
		path: `data/${PACK_PREFIX}/function/all_discs.mcfunction`,
		contents: [
			`# give all discs to player`,
			...[...transformSet].map((item, index) => {
				return `give @s minecraft:music_disc_11[minecraft:jukebox_playable={song:"${PACK_PREFIX}:${item.transformedName}"},minecraft:custom_model_data=${index + 1}]`
			}),
		].join("\n"),
	})

	return outputFiles
}

export const jukeboxSongs = (transformSet: Set<InputTrack>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const item of transformSet) {
		outputFiles.push({
			path: `data/${PACK_PREFIX}/jukebox_song/${item.transformedName}.json`,
			contents: stringify({
				comparator_output: 1,
				description: item.inputName,
				length_in_seconds: item.inputDurationSeconds,
				sound_event: {
					sound_id: `minecraft:music_disc.${item.transformedName}`,
				},
			}),
		})
	}

	return outputFiles
}
