import { SplitObj } from "./types";
/**
 * @description Splits a pdf into files based on where each page starts and the filenames you want each resultant pdf to have.
 * @param {String} pathToPdf The path to the original pdf to be split
 * @param {Array} splitArray An array containing objects of format { startPage: Number, title: String }
 * @param {String} outputPath A directory which already exists in which you want to place the resultant pdfs
 */
declare function splitPdf(pathToPdf: string, splitArray: Array<SplitObj>, outputPath: string): Promise<void>;
export { splitPdf };
