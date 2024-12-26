import Zip from "adm-zip"
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { functions, jukeboxSongs } from "./datapack"
import { getDuration, transformTracks } from "./ffmpeg"
import { soundsJson } from "./resourcepack"
import { packMcmeta } from "./shared"
import {
	DATAPACK_FOLDER,
	DEFAULT_ICON,
	INPUT_FOLDER,
	INTERMEDIARY_FOLDER,
	PACK_PREFIX,
	RESOURCEPACK_FOLDER,
	type InputTrack,
} from "./util"

const inputFolderFiles = await readdir(INPUT_FOLDER, { withFileTypes: true })
const inputFiles = inputFolderFiles
	.filter((file) => file.isFile())
	.filter((file) => file.name !== "readme.md")

const transformSet = new Set<InputTrack>()

for (const file of inputFiles) {
	const inputPath = path.join(INPUT_FOLDER, file.name)

	const inputName = path.parse(file.name).name

	const outputName = inputName.replaceAll(/[^a-zA-Z0-9]/g, "_").toLowerCase()
	const outputFile = outputName + ".ogg"
	const outputPath = path.join(INTERMEDIARY_FOLDER, outputFile)

	const duration = await getDuration(inputPath)

	transformSet.add({
		inputPath: inputPath,
		inputName: inputName,
		inputDurationSeconds: duration,

		transformedName: outputName,
		diskName: `${PACK_PREFIX}_${outputName}`,

		intermediaryPath: outputPath,
	})
}

await transformTracks(transformSet)

console.log(transformSet)

// -----------------------------------------------------------------------------

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

await copyFile(DEFAULT_ICON, path.join(DATAPACK_FOLDER, "pack.png"))

const datapackZip = new Zip()
datapackZip.addLocalFolder(DATAPACK_FOLDER)
datapackZip.writeZip(DATAPACK_FOLDER + ".zip")

// -----------------------------------------------------------------------------

await rm(RESOURCEPACK_FOLDER, { recursive: true, force: true })
await mkdir(RESOURCEPACK_FOLDER, { recursive: true })

const resourcepackTextFiles = [packMcmeta(), soundsJson(transformSet)]

for (const textFile of resourcepackTextFiles) {
	const outputPath = path.join(RESOURCEPACK_FOLDER, textFile.path)

	const { dir } = path.parse(outputPath)
	await mkdir(dir, { recursive: true })

	await writeFile(outputPath, textFile.contents)
}

for (const track of transformSet) {
	const outputPath =
		path.join(RESOURCEPACK_FOLDER, "assets/minecraft/sounds/records", track.diskName) +
		".ogg"

	const { dir } = path.parse(outputPath)
	await mkdir(dir, { recursive: true })

	await copyFile(track.intermediaryPath, outputPath)
}

await copyFile(DEFAULT_ICON, path.join(RESOURCEPACK_FOLDER, "pack.png"))

const resourcepackZip = new Zip()
resourcepackZip.addLocalFolder(RESOURCEPACK_FOLDER)
resourcepackZip.writeZip(RESOURCEPACK_FOLDER + ".zip")
