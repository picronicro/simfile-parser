import SMParser from "./SMParser.js";

const fileInput = document.querySelector("#upload")
const readBtn = document.querySelector("#read")

// read .sm file by clicking read btn
readBtn.addEventListener("click", () => {
    console.log("read") // debug

    const simfile = fileInput.files[0]
    // read simfile
    const reader = new FileReader()
    reader.onload = event => {
        const smContents = event.target.result
        console.log(new SMParser(smContents).simfileObject)
    }
    reader.readAsText(simfile)
})