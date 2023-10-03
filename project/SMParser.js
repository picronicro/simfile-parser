class SMParser {

    // regexp patterns
    regexpHeaderTags = /#([^:]+):([^;]+)/
    regexpNotesTags = /^ {5}(.+?):/

    _simfileObject = {}; // base obj

    constructor(smContents) {
        this._simfileObject.headerTags = {} // init header tags obj
        this._simfileObject.difficulties = {} // init difficulties obj

        this.parseSimfile(smContents)
    }

    parseSimfile(smContents) {
        const lines = smContents.split('\n');

        // first, parsing header tags
        console.log("parsing header tags") // debug
        for (const line of lines) {
            if (!line.includes("NOTES")) {
                const formattedLine = this.regexpHeaderTags.exec(line)
                if (formattedLine) {
                    this._simfileObject.headerTags[formattedLine[1].toLowerCase()] = formattedLine[2].replace(/(\r\n|\n|\r)/gm, "")
                }
            } else {
                console.log("ended parsing header tags") // while selecting song, we have to read only header tags (no NOTES) // debug
                // console.log(simfileObject) // debug
                break
            }
        }

        // second, parse chart itself (#NOTES)
        console.log("parsing notes") // debug
        let startLine = 0
        let i = 0
        while (true) {
            // find #NOTES tag and get its line index
            startLine = this.findNotes(startLine, lines)
            if (startLine === -1) break

            // parse notes function (returns endLineIndex and parsed difficulty)
            const diff = this.parseNotes(startLine, lines)
            startLine = diff[0]
            const diffName = diff[1].difficulty.toLowerCase() // to get diff name for obj key
            this._simfileObject.difficulties[diffName] = diff[1]
        }

        return this._simfileObject;
    }

    findNotes(startLineIndex, lines) {
        // we have to find index of line NOTES
        let anyLeft = true
        for (let i = startLineIndex; i < lines.length; i++) {
            if (lines[i].includes("NOTES")) {
                startLineIndex = i + 1 // add 1 to get the exact line index
                anyLeft = true
                break
            } else {
                anyLeft = false
            }
        }
        // check is there any left #NOTES tags (-1 means nothing left)
        if (!anyLeft) {
            console.warn("no more #NOTES tags, stopping")
            startLineIndex = -1
        }

        return startLineIndex
    }

    parseNotes(startLineIndex, lines) {
        let endLineIndex = 0
        // iterate 5 times from NOTES line index to get all NOTES tags (like name, difficulty, groove radar, etc)
        let notesData = {}
        let noteTagsIndex = 0 // max value 5, need for putting tags into notes object
        for (let i = startLineIndex; i < startLineIndex + 5; i++) {
            noteTagsIndex++
            let line = this.regexpNotesTags.exec(lines[i])
            if (!line) line = "" // check for null

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
        for (let i = startLineIndex + 5; i < lines.length; i++) {
            if (!lines[i].includes(";")) {
                if (!lines[i].includes(",")) {
                    buffer.push(lines[i].replace(/(\r\n|\n|\r)/gm, ""))
                } else {
                    console.log("met comma, parse next measure") // debug
                    notes.push(buffer)
                    buffer = []
                }
            } else {
                console.log("notes parse end " + i) // debug
                endLineIndex = i + 1 // +1 to get exact line
                notes.push(buffer)
                buffer = []
                break
            }
        }
        notesData.notes = notes

        return [endLineIndex, notesData]
    }

    // getter
    get simfileObject() {
        return this._simfileObject;
    }

}

export default SMParser