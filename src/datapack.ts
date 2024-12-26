import { PACK_PREFIX, stringify, type OutputFile } from "./util"
import path from "node:path"

export const packMcmeta = (): OutputFile => {
	return {
		path: "pack.mcmeta",
		contents: stringify({
			pack: {
				pack_format: 57,
				supported_formats: [57, 57],
				description: "Custom Jukebox Pack",
			},
		}),
	}
}

export const functions = (transformMap: Map<string, string>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const [, output] of transformMap) {
		const { name: outputName } = path.parse(output)

		outputFiles.push({
			path: `functions/minecraft/${outputName}.mcfunction`,
			contents: [
				`# give ${outputName} to player`,
				"",
				`give @s minecraft:music_disc_11[minecraft:jukebox_playable={song:"${PACK_PREFIX}:${outputName}"}]`,
			].join("\n"),
		})
	}

	return outputFiles
}
