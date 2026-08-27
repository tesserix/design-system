/**
 * The body checks: §4's cross-cutting rules, plus the one row rule (§8.9) that
 * is shaped like them.
 *
 * Each check takes a parsed body and returns findings; none of them perform
 * I/O, so a runner is free to capture a response once and run all of them over
 * it. §8.9 is the exception to the "holds for every endpoint" framing — it
 * applies to §3.4's rows alone, and answers a skip everywhere else rather than
 * making the runner remember which endpoint it belongs to.
 */

export { ENVELOPE_SECTION, checkEnvelope, checkEnvelopeShape } from "./envelope"
export { MONEY_SECTION, checkMoney } from "./money"
export { TIMESTAMP_SECTION, checkTimestamps } from "./timestamps"
export { ERROR_SECTION, checkErrorShape } from "./errors"
export { EMPTY_SECTION, checkEmptyResult } from "./empty"
export { ENTITY_ROW_SECTION, checkEntityRow } from "./entity-row"
