import { reverseObj } from "../utils/reverseObj";

export const MOAI_CODE = {
  "0": "ア",
  "1": "ァ",
  "2": "イ",
  "3": "ィ",
  "4": "オ",
  "5": "ォ",
  "6": "ﾓｱ",
  "7": "ﾓｲ",
  "8": "ｱ",
  "9": "ｧ",
  a: "ｲ",
  b: "ｨ",
  c: "ｵ",
  d: "ｫ",
  e: "ﾓｧ",
  f: "ﾓｨ",
} as const;

export const REVERSED_MOAI_CODE = reverseObj(MOAI_CODE);
