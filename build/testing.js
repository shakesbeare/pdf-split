"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_split_1 = require("./pdf-split");
const typing_and_test_data_1 = require("./typing_and_test_data");
const path = require("path");
(0, pdf_split_1.splitPdf)(path.join(__dirname, "..", "./testing/April in Paris.pdf"), typing_and_test_data_1.test, "output");
//# sourceMappingURL=testing.js.map