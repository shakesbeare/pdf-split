"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPdf = void 0;
const pdf_lib_1 = require("pdf-lib");
const fs = require("fs");
const path = require("path");
function loadPdf(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // loads a pdf by filename
        const existingPDFBytes = fs.readFileSync(filename);
        return yield pdf_lib_1.PDFDocument.load(existingPDFBytes);
    });
}
function range(start, end) {
    // generates a range of numbers for convenience
    let resultArray = [];
    for (let i = start; i < end; i++) {
        resultArray.push(i);
    }
    return resultArray;
}
function _splitPdf(
// helper function which actually executes the pdf splittage
pdfDocument, splitMarkers) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastIndex = 0;
        let splitPages = [];
        /* Each split marker represents the start of a new page
        so each part is split from last Index to the next split
        pages are stored as an array so nextsplit is made to be
            one less than the entered page number
        */
        for (let i = 0; i <= splitMarkers.length; i++) {
            let nextSplit = splitMarkers[i] - 1;
            // The last element of the list doesn't have a correct end position
            // because it's the last element
            // Therefore, when we do the last page, we should use the page count
            // as nextSplit
            if (i == splitMarkers.length) {
                nextSplit = Number(pdfDocument.getPageCount());
            }
            // Create a new document and copy in the relevant pages
            const subDocument = yield pdf_lib_1.PDFDocument.create();
            const copiedPages = yield subDocument.copyPages(pdfDocument, range(lastIndex, nextSplit));
            copiedPages.forEach((page) => {
                subDocument.addPage(page);
            });
            splitPages.push(subDocument);
            lastIndex = nextSplit;
        }
        return splitPages;
    });
}
function savePdfs(pdfArray, filenameList, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Saves each pdf by the name provided
        let index = 0;
        pdfArray.forEach((pdfDoc) => __awaiter(this, void 0, void 0, function* () {
            const pdfBytes = yield pdfDoc.save();
            fs.writeFileSync(path.join(__dirname, outputPath, filenameList[index] + ".pdf"), pdfBytes);
            index++;
        }));
    });
}
/**
 * @description Splits a pdf into files based on where each page starts and the filenames you want each resultant pdf to have.
 * @param {String} pathToPdf The path to the original pdf to be split
 * @param {Array} splitArray An array containing objects of format { startPage: Number, title: String }
 * @param {String} outputPath A directory which already exists in which you want to place the resultant pdfs
 */
function splitPdf(pathToPdf, splitArray, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        // Exposed function to execute the library
        // First, split parse the provided filename and marker obj
        // Then, load the original pdf
        // Then, split the pdf
        // Finally, save the files with the appropriate names
        let splitMarkers = [];
        let fileNames = [];
        splitArray.forEach((obj) => {
            splitMarkers.push(obj.startPage);
            fileNames.push(obj.title);
        });
        const originalPdf = yield loadPdf(pathToPdf);
        let pdfArray = yield _splitPdf(originalPdf, splitMarkers.slice(1));
        yield savePdfs(pdfArray, fileNames, outputPath);
    });
}
exports.splitPdf = splitPdf;
//# sourceMappingURL=pdf-split.js.map