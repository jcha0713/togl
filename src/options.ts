import { option, optional } from "@optique/core/parser";
import { integer } from "@optique/core/valueparser";
import { charsOptionParser } from "./parsers";

const inverseFlag = option("-i", "--inverse");
const charsOption = optional(option("-c", "--chars", charsOptionParser()));
const scaleOption = optional(
  option(
    "-x",
    "--scale",
    integer({ min: 1, max: Number.MAX_SAFE_INTEGER, metavar: "SCALE" }),
  ),
);

export { inverseFlag, charsOption, scaleOption };
