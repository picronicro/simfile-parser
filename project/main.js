const fileInput = document.querySelector("#upload")
const readBtn = document.querySelector("#read")

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

function parseSimfile(simfileContents) {
    const simfileObject = {};
    const lines = simfileContents.split('\n');

    // Loop through each line of the simfile
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if the line contains a colon (':')
        if (line.includes(':')) {
            const [key, value] = line.split(':');
            simfileObject[key.trim()] = value.trim();
        } else if (line.startsWith('//')) {
            // Skip comments (lines starting with '//')
            continue;
        } else {
            // Handle other sections of the simfile, e.g., notes, timing data
            // You'll need to implement the parsing logic for each section
        }
    }

    return simfileObject;
}