import { stringify, type OutputFile } from "./util"

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
