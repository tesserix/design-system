/**
 * The §4 cross-cutting checks: the rules that hold for every endpoint rather
 * than for one.
 *
 * Each check takes a parsed body and returns findings; none of them perform
 * I/O, so a runner is free to capture a response once and run all five over it.
 */

export { ENVELOPE_SECTION, checkEnvelope, checkEnvelopeShape } from "./envelope"
export { MONEY_SECTION, checkMoney } from "./money"
export { TIMESTAMP_SECTION, checkTimestamps } from "./timestamps"
export { ERROR_SECTION, checkErrorShape } from "./errors"
export { EMPTY_SECTION, checkEmptyResult } from "./empty"
