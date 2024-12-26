import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import {
	DATAPACK_FOLDER,
	INPUT_FOLDER,
	INTERMEDIARY_FOLDER,
	type InputTrack,
} from "./util"
import { functions, jukeboxSongs } from "./datapack"
import { packMcmeta } from "./shared"
import { getDuration } from "./ffmpeg"

const inputFolderFiles = await readdir(INPUT_FOLDER, { withFileTypes: true })
const inputFiles = inputFolderFiles
	.filter((file) => file.isFile())
	.filter((file) => file.name !== "readme.md")

const transformSet = new Set<InputTrack>()

for (const file of inputFiles) {
	const inputPath = path.join(INPUT_FOLDER, file.name)

	const inputName = path.parse(file.name).name

	const outputName = inputName.replaceAll(/[^a-zA-Z0-9]/g, "-")
	const outputFile = outputName + ".ogg"
	const outputPath = path.join(INTERMEDIARY_FOLDER, outputFile)

	const duration = await getDuration(inputPath)

	transformSet.add({
		inputPath: inputPath,
		inputName: inputName,
		inputDurationSeconds: duration,

		transformedName: outputName,

		intermediaryPath: outputPath,
	})
}

console.log(transformSet)

await rm(DATAPACK_FOLDER, { recursive: true, force: true })
await mkdir(DATAPACK_FOLDER, { recursive: true })
const datapackTextFiles = [
	packMcmeta(),
	...functions(transformSet),
	...jukeboxSongs(transformSet),
]

for (const textFile of datapackTextFiles) {
	const outputPath = path.join(DATAPACK_FOLDER, textFile.path)

	const { dir } = path.parse(outputPath)
	await mkdir(dir, { recursive: true })

	await writeFile(outputPath, textFile.contents)
}
