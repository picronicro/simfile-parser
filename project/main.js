const fileInput = document.querySelector("#upload")
const readBtn = document.querySelector("#read")

// read .sm file by clicking read btn
readBtn.addEventListener("click", () => {
    console.log("read")

    const simfile = fileInput.files[0]
    // read simfile
    const reader = new FileReader()
    reader.onload = event => {
        const smContents = event.target.result
        parseSimfile(smContents)
    }
    reader.readAsText(simfile)
})

const regexpHeaderTags = /#([^:]+):([^;]+)/
const regexpNotesTags = /^ {5}(.+?):/

function parseSimfile(smContents) {
    const simfileObject = {};
    const lines = smContents.split('\n');

    // first, parsing header tags
    console.log("parsing header tags")
    for (const line of lines) {
        if (!line.includes("NOTES")) {
            const formattedLine = regexpHeaderTags.exec(line)
            if (formattedLine) {
                simfileObject[formattedLine[1].toLowerCase()] = formattedLine[2]
            }
        } else {
            console.log("ended parsing header tags") // while selecting song, we have to read only header tags (no NOTES)
            // console.log(simfileObject) // debug
            break
        }
    }

    // second, parse chart itself (#NOTES)
    console.log("parsing notes")
    console.log("parsing NOTES tags")
    // we have to find index of line NOTES
    let startLine = 0
    for (let i = 0; i < lines.length; i++) {
        // console.log(regexpNotesTags.exec(lines[i]))

        if (lines[i].includes("NOTES")) {
            startLine = i + 1
            break
        }
    }
    // and then, iterate 5 times from that index to get all NOTES tags (like name, difficulty, groove radar, etc)
    let notes = {}
    let noteTagsIndex = 0
    for (let i = startLine; i < startLine + 5 ; i++) {
        noteTagsIndex ++
        console.log(noteTagsIndex)
        const line = regexpNotesTags.exec(lines[i])

        switch (noteTagsIndex) {
            case 1:
                notes.chartType = line[1]
                break
            case 2:
                notes.author = line[1]
                break
            case 3:
                notes.difficulty = line[1]
                break
            case 4:
                notes.meter = line[1]
                break
            case 5:
                notes.grooveRadar = line[1]
                break
        }
    }
    simfileObject.difficulties = [notes]
    console.log(simfileObject)

    // now we have to parse notes till ";"
    console.log("parsing notes")

    return simfileObject;
}

function parseNotes() {

}