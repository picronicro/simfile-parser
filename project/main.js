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
        console.log(parseSimfile(smContents))
    }
    reader.readAsText(simfile)
})

const regexpHeaderTags = /#([^:]+):([^;]+)/
const regexpNotesTags = /^ {5}(.+?):/

function parseSimfile(smContents) {
    const simfileObject = {}; // base obj
    simfileObject.headerTags = {} // init header tags obj
    simfileObject.difficulties = {} // init difficulties obj

    const lines = smContents.split('\n');

    // first, parsing header tags
    console.log("parsing header tags")
    for (const line of lines) {
        if (!line.includes("NOTES")) {
            const formattedLine = regexpHeaderTags.exec(line)
            if (formattedLine) {
                simfileObject.headerTags[formattedLine[1].toLowerCase()] = formattedLine[2]
            }
        } else {
            console.log("ended parsing header tags") // while selecting song, we have to read only header tags (no NOTES)
            // console.log(simfileObject) // debug
            break
        }
    }

    // second, parse chart itself (#NOTES)
    console.log("parsing notes")
    // we have to find index of line NOTES
    let startLine = 0
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("NOTES")) {
            startLine = i + 1
            break
        }
    }
    // parse notes function
    const diff = parseNotes(startLine, lines)
    const diffName = diff.difficulty.toLowerCase()

    simfileObject.difficulties[diffName] = diff

    return simfileObject;
}

function parseNotes(startLine, lines) {
    // iterate 5 times from NOTES line index to get all NOTES tags (like name, difficulty, groove radar, etc)
    let notesData = {}
    let noteTagsIndex = 0 // max value 5, need for putting tags into notes object
    for (let i = startLine; i < startLine + 5 ; i++) {
        noteTagsIndex ++
        const line = regexpNotesTags.exec(lines[i])

        switch (noteTagsIndex) {
            case 1:
                notesData.chartType = line[1]
                break
            case 2:
                notesData.author = line[1]
                break
            case 3:
                notesData.difficulty = line[1]
                break
            case 4:
                notesData.meter = line[1]
                break
            case 5:
                notesData.grooveRadar = line[1]
                break
        }
    }

    // parse notes
    let notes = [] // store all notes
    let buffer = [] // store measure (pack of notes till ",")
    for (let i = startLine + 5; i < lines.length; i++) {
        if (!lines[i].includes(";")) {
            if (!lines[i].includes(",")) {
                buffer.push(lines[i].replace(/(\r\n|\n|\r)/gm, ""))
            } else {
                console.log("met comma, parse next measure")
                notes.push(buffer)
                buffer = []
            }
        } else {
            console.log("notes parse end")
            notes.push(buffer)
            buffer = []
        }
    }
    notesData.notes = notes

    return notesData
}