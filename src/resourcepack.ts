import { stringify, type InputTrack, type OutputFile } from "./util"

export const soundsJson = (transformSet: Set<InputTrack>): OutputFile => {
	const diskMetadata: Record<
		string,
		{ sounds: Array<{ name: string; stream: boolean }> }
	> = {}

	for (const item of transformSet) {
		diskMetadata[`music_disc.${item.transformedName}`] = {
			sounds: [
				{
					name: `records/${item.diskName}`,
					stream: true,
				},
			],
		}
	}

	return {
		path: "assets/minecraft/sounds.json",
		contents: stringify(diskMetadata),
	}
}

export const diskModelIndex = (transformSet: Set<InputTrack>): OutputFile => {
	return {
		path: "assets/minecraft/models/item/music_disc_11.json",
		contents: stringify({
			parent: "minecraft:item/template_music_disc",
			textures: {
				layer0: "minecraft:item/music_disc_11",
			},
			overrides: [...transformSet].map((item, index) => {
				return {
					predicate: {
						custom_model_data: index + 1,
					},
					model: `minecraft:item/music_disc_11/${item.transformedName}`,
				}
			}),
		}),
	}
}

export const diskModels = (transformSet: Set<InputTrack>): OutputFile[] => {
	const outputFiles: OutputFile[] = []

	for (const item of transformSet) {
		outputFiles.push({
			path: `assets/minecraft/models/item/music_disc_11/${item.transformedName}.json`,
			contents: stringify({
				parent: "minecraft:item/template_music_disc",
				textures: {
					layer0: `minecraft:item/music_disc_11/${item.transformedName}`,
				},
			}),
		})
	}

	return outputFiles
}
