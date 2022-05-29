import { splitPdf } from "./pdf-split";
import { test as splitList } from "./test_data";
import * as path from "path";

splitPdf(
    path.join(__dirname, "..", "./testing/April in Paris.pdf"),
    splitList,
    "output"
);
