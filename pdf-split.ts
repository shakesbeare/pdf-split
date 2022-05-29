import { PDFDocument } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";

const test: Array<typeof _splitObj> = [
    {
        startPage: 1,
        title: "1st Eb Alto Saxophone (Clarinet)",
    },
    {
        startPage: 3,
        title: "2nd Eb Alto Saxophone (Clarinet)",
    },
    {
        startPage: 5,
        title: "1st Bb Tenor Saxophone",
    },
    {
        startPage: 7,
        title: "2nd Bb Tenor Saxophone",
    },
    {
        startPage: 9,
        title: "Eb Baritone Saxophone",
    },
    {
        startPage: 11,
        title: "1st Bb Trumpet",
    },
    {
        startPage: 12,
        title: "2nd Bb Trumpet",
    },
    {
        startPage: 13,
        title: "3rd Bb Trumpet",
    },
    {
        startPage: 14,
        title: "4th Bb Trumpet",
    },
    {
        startPage: 16,
        title: "1st Trombone",
    },
    {
        startPage: 18,
        title: "2nd Trombone",
    },
    {
        startPage: 20,
        title: "3rd Trombone",
    },
    {
        startPage: 22,
        title: "Piano",
    },
    {
        startPage: 25,
        title: "Guitar Chords",
    },
    {
        startPage: 26,
        title: "Guitar",
    },
    {
        startPage: 28,
        title: "Bass",
    },
    {
        startPage: 30,
        title: "Drums",
    },
];

const _splitObj: { startPage: number; title: string } = {
    // For typing purposes
    startPage: 0,
    title: "undefined",
};

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

splitPdf("./April in Paris.pdf", test, "./output");
