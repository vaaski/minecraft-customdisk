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
