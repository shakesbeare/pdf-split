import { PDFDocument } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";
import { _splitObj } from "./tests";

async function loadPdf(filename: string): Promise<PDFDocument> {
    // loads a pdf by filename
    const existingPDFBytes: any = fs.readFileSync(filename);
    return await PDFDocument.load(existingPDFBytes);
}

function range(start: number, end: number): Array<number> {
    // generates a range of numbers for convenience
    let resultArray: Array<number> = [];
    for (let i: number = start; i < end; i++) {
        resultArray.push(i);
    }
    return resultArray;
}

async function _splitPdf(
    // helper function which actually executes the pdf splittage
    pdfDocument: PDFDocument,
    splitMarkers: Array<number>
) {
    let lastIndex = 0;
    let splitPages: Array<PDFDocument> = [];
    /* Each split marker represents the start of a new page
    so each part is split from last Index to the next split
    pages are stored as an array so nextsplit is made to be 
        one less than the entered page number
    */
    for (let i = 0; i <= splitMarkers.length; i++) {
        let nextSplit: number = splitMarkers[i] - 1;

        // The last element of the list doesn't have a correct end position
        // because it's the last element
        // Therefore, when we do the last page, we should use the page count
        // as nextSplit
        if (i == splitMarkers.length) {
            nextSplit = Number(pdfDocument.getPageCount());
        }
        // Create a new document and copy in the relevant pages
        const subDocument = await PDFDocument.create();
        const copiedPages = await subDocument.copyPages(
            pdfDocument,
            range(lastIndex, nextSplit)
        );

        copiedPages.forEach((page) => {
            subDocument.addPage(page);
        });

        splitPages.push(subDocument);

        lastIndex = nextSplit;
    }

    return splitPages;
}

async function savePdfs(
    pdfArray: Array<PDFDocument>,
    filenameList: Array<string>,
    outputPath: string
) {
    // Saves each pdf by the name provided
    let index = 0;
    pdfArray.forEach(async (pdfDoc) => {
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(
            path.join(__dirname, outputPath, filenameList[index] + ".pdf"),
            pdfBytes
        );
        index++;
    });
}

async function splitPdf(
    pathToPdf: string,
    splitList: Array<typeof _splitObj>,
    outputPath: string
) {
    // Exposed function to execute the library
    // First, split parse the provided filename and marker obj
    // Then, load the original pdf
    // Then, split the pdf
    // Finally, save the files with the appropriate names
    let splitMarkers: Array<number> = [];
    let fileNames: Array<string> = [];

    splitList.forEach((obj) => {
        splitMarkers.push(obj.startPage);
        fileNames.push(obj.title);
    });

    const originalPdf = await loadPdf(pathToPdf);
    let pdfArray = await _splitPdf(originalPdf, splitMarkers.slice(1));
    await savePdfs(pdfArray, fileNames, outputPath);
}

module.exports = splitPdf;
