import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { DATAPACK_FOLDER, INPUT_FOLDER, INTERMEDIARY_FOLDER, ROOT_FOLDER } from "./util"
import { functions } from "./datapack"
import { packMcmeta } from "./shared"

const inputFolderFiles = await readdir(INPUT_FOLDER, { withFileTypes: true })
const inputFiles = inputFolderFiles
	.filter((file) => file.isFile())
	.filter((file) => file.name !== "readme.md")

const transformMap = new Map<string, string>()

for (const file of inputFiles) {
	const inputPath = path.join(ROOT_FOLDER, INPUT_FOLDER, file.name)

	const inputName = path.parse(file.name).name

	const outputName = inputName.replaceAll(/[^a-zA-Z0-9]/g, "-")
	const outputFile = outputName + ".ogg"
	const outputPath = path.join(ROOT_FOLDER, INTERMEDIARY_FOLDER, outputFile)

	transformMap.set(inputPath, outputPath)
}

console.log(transformMap)

await rm(DATAPACK_FOLDER, { recursive: true, force: true })
await mkdir(DATAPACK_FOLDER, { recursive: true })
const datapackTextFiles = [packMcmeta(), ...functions(transformMap)]

for (const textFile of datapackTextFiles) {
	const outputPath = path.join(DATAPACK_FOLDER, textFile.path)

	const { dir } = path.parse(outputPath)
	await mkdir(dir, { recursive: true })

	await writeFile(outputPath, textFile.contents)
}
