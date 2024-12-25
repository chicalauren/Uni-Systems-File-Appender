document.getElementById('zip-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('zip-file');
    const renameTerm = document.getElementById('rename-term').value.trim();
    const outputDiv = document.getElementById('output');

    if (!fileInput.files.length || !renameTerm) {
        outputDiv.textContent = "Please upload a zip file and provide a renaming term.";
        return;
    }

    const file = fileInput.files[0];
    const zip = new JSZip();

    try {
        // Load the zip file
        const zipData = await zip.loadAsync(file);

        const newZip = new JSZip();
        const fileNames = Object.keys(zipData.files);

        for (const fileName of fileNames) {
            const fileContent = await zipData.files[fileName].async("blob");

            // Append the user-specified term to the filename
            const newFileName = appendTermToFileName(fileName, renameTerm);
            newZip.file(newFileName, fileContent);
        }

        // Generate the new zip file
        const newZipBlob = await newZip.generateAsync({ type: "blob" });

        // Download the new zip file
        saveAs(newZipBlob, "modified_files.zip");

        outputDiv.textContent = "Files processed successfully!";
    } catch (error) {
        console.error("Error processing zip file:", error);
        outputDiv.textContent = "An error occurred while processing the zip file.";
    }
});

// Helper function to append the term to a filename
function appendTermToFileName(fileName, term) {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return fileName + term;
    }
    const name = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    return `${name}${term}${extension}`;
}
