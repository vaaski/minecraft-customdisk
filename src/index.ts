import Zip from "adm-zip"
import {
	copyFile,
	cp,
	exists,
	mkdir,
	readdir,
	readFile,
	rename,
	rm,
	writeFile,
} from "node:fs/promises"
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
	type InputResourcePack,
	type InputTrack,
	type Overlays,
	type PackMeta,
} from "./util"

const inputFolderFiles = await readdir(INPUT_FOLDER, { withFileTypes: true })
const inputFiles = inputFolderFiles
	.filter((file) => file.isFile())
	.filter((file) => file.name !== "readme.md")
	.filter((file) => file.name !== ".DS_Store")
	.filter((file) => !file.name.startsWith("._"))
	.filter((file) => !file.name.endsWith(".zip"))

const inputResourcePackFolders = inputFolderFiles
	.filter((file) => file.isDirectory())
	.map((entry) => path.join(entry.parentPath, entry.name))

const inputResourcePackZips = inputFolderFiles.filter(
	(file) => file.isFile() && file.name.endsWith(".zip"),
)

const inputResourcePacks = new Set<InputResourcePack>()

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

await rm(INTERMEDIARY_FOLDER, { recursive: true, force: true })
await mkdir(INTERMEDIARY_FOLDER, { recursive: true })

await transformTracks(transformSet)
console.log(transformSet)

for (const item of inputResourcePackZips) {
	const zip = new Zip(path.join(item.parentPath, item.name))
	const outputFolder = path.join(INTERMEDIARY_FOLDER, item.name)

	zip.extractAllTo(outputFolder, true)
	inputResourcePackFolders.push(outputFolder)

	if (await exists(path.join(outputFolder, "__MACOSX"))) {
		await rm(path.join(outputFolder, "__MACOSX"), { recursive: true, force: true })
	}
}

for (const resourcePackFolder of inputResourcePackFolders) {
	if (await exists(path.join(resourcePackFolder, "pack.mcmeta"))) {
		const metadata = await readFile(path.join(resourcePackFolder, "pack.mcmeta"), "utf8")
		const pack: PackMeta = JSON.parse(metadata)

		inputResourcePacks.add({
			metadata: pack,
			path: resourcePackFolder,
		})
	} else {
		continue
	}
}

console.log(inputResourcePacks)

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

const overlays: Overlays = {
	entries: [],
}

for (const pack of inputResourcePacks) {
	let supported_formats = pack.metadata.pack.supported_formats
	if (!supported_formats) {
		supported_formats = pack.metadata.pack.pack_format
	}

	const uuid = crypto.randomUUID().replaceAll("-", "").toLowerCase()
	overlays.entries.push({
		formats: supported_formats,
		directory: uuid,
	})

	await cp(
		path.join(pack.path, "assets"),
		path.join(RESOURCEPACK_FOLDER, uuid, "assets"),
		{
			recursive: true,
		},
	)

	if (pack.metadata.overlays) {
		for (const overlay of pack.metadata.overlays.entries) {
			const overlayUuid = crypto.randomUUID().replaceAll("-", "").toLowerCase()

			await cp(
				path.join(pack.path, overlay.directory),
				path.join(RESOURCEPACK_FOLDER, overlayUuid),
				{ recursive: true },
			)

			overlays.entries.push({
				formats: overlay.formats,
				directory: overlayUuid,
			})
		}
	}
}

const resourcepackTextFiles = [packMcmeta(overlays), soundsJson(transformSet)]

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

if (overlays.entries.length > 0) {
	const uuid = crypto.randomUUID().replaceAll("-", "").toLowerCase()
	overlays.entries.push({
		formats: [42, 57],
		directory: uuid,
	})

	await mkdir(path.join(RESOURCEPACK_FOLDER, uuid), { recursive: true })

	await rename(
		path.join(RESOURCEPACK_FOLDER, "assets"),
		path.join(RESOURCEPACK_FOLDER, uuid, "assets"),
	)

	await mkdir(path.join(RESOURCEPACK_FOLDER, "assets"), { recursive: true })

	const overriddenMetadata = packMcmeta(overlays)
	const outputPath = path.join(RESOURCEPACK_FOLDER, overriddenMetadata.path)
	await writeFile(outputPath, overriddenMetadata.contents)
}

await copyFile(DEFAULT_ICON, path.join(RESOURCEPACK_FOLDER, "pack.png"))

const resourcepackZip = new Zip()
resourcepackZip.addLocalFolder(RESOURCEPACK_FOLDER)
resourcepackZip.writeZip(RESOURCEPACK_FOLDER + ".zip")
