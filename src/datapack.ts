import { PACK_PREFIX, type OutputFile } from "./util"
import path from "node:path"

export const functions = (transformMap: Map<string, string>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const [input, output] of transformMap) {
		const { name: inputName } = path.parse(input)
		const { name: outputName } = path.parse(output)

		outputFiles.push({
			path: `data/${PACK_PREFIX}/function/${outputName}.mcfunction`,
			contents: [
				`# give disc "${inputName}" to player`,
				"",
				`give @s minecraft:music_disc_11[minecraft:jukebox_playable={song:"${PACK_PREFIX}:${outputName}"}]`,
			].join("\n"),
		})
	}

	return outputFiles
}
