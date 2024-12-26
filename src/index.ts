import { mkdir, readdir } from "node:fs/promises"
import path from "node:path"

const INPUT_FOLDER = "input"
const INTERMEDIARY_FOLDER = "intermediary"
const ROOT_FOLDER = path.join(import.meta.dir, "..")

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

await mkdir(INTERMEDIARY_FOLDER, { recursive: true })

for (const [input, output] of transformMap) {
	const process = Bun.spawn(["ffmpeg", "-i", input, "-ac", "1", output], {
		stdout: "inherit",
	})
	console.log(await process.exited)
}

console.log(transformMap)
