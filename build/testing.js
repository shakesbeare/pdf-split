"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_split_1 = require("./pdf-split");
const test_data_1 = require("./test_data");
const path = require("path");
(0, pdf_split_1.splitPdf)(path.join(__dirname, "..", "./testing/April in Paris.pdf"), test_data_1.test, "output");
//# sourceMappingURL=testing.js.map