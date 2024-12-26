import { stringify, type OutputFile, type Overlays, type PackMeta } from "./util"

export const packMcmeta = (overlays?: Overlays): OutputFile => {
	const meta: PackMeta = {
		pack: {
			pack_format: 57,
			supported_formats: [42, 57],
			description: "Custom Jukebox Pack",
		},
		overlays,
	}

	return {
		path: "pack.mcmeta",
		contents: stringify(meta),
	}
}
