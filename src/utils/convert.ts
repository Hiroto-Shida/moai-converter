import { MOAI_CODE, REVERSED_MOAI_CODE } from "../constants/langCode";
import { SPECIAL_CHARACTERS_REGEXP } from "../constants/regexp";

/**
 * コードポイントが有効かどうか
 * @param {number} codePoint コードポイント
 * @returns {boolean} 有効かどうか
 */
export const isCorrectCodePoint = (codePoint: number) => {
  // see: https://ja.wikipedia.org/wiki/Unicode%E4%B8%80%E8%A6%A7_0000-0FFF
  const controlCharRanges = [
    { start: "0000", end: "001f" }, // C0 Control Characters
    { start: "007f", end: "009f" }, // C1 Control Characters
  ];

  // コードポイントが制御文字(=無効)かのチェック
  const isNonPrintable = controlCharRanges.some((range) => {
    return (
      codePoint >= parseInt(range.start, 16) &&
      codePoint <= parseInt(range.end, 16)
    );
  });
  if (isNonPrintable) return false;

  // 存在するコードポイントかのチェック
  try {
    const char = String.fromCodePoint(codePoint);
    return char;
  } catch {
    return false;
  }
};

/**
 * ある言語からモアイ語へ変換
 * @param {string} inputOrigin 元の言語
 * @returns {string} モアイ語
 */
export const originToMoaiLang = (inputOrigin: string) => {
  if (!inputOrigin) {
    return "";
  }

  // サロゲートペアも考慮して1文字ずつ分割(splitではダメ)
  const originList = inputOrigin.match(/./gu);
  if (!originList) {
    return "";
  }

  return originList
    .map((char) => {
      const isSpecial = char.match(SPECIAL_CHARACTERS_REGEXP);
      const code = char.codePointAt(0);

      // 記号やunicodeに存在しない文字(?)はそのまま返す
      if (isSpecial || code === undefined) {
        return char;
      }

      const array = code.toString(16).split("") as Array<
        keyof typeof MOAI_CODE
      >;

      return "モ" + array.map((code) => MOAI_CODE[code]).join("");
    })
    .join("");
};

/**
 * モアイ語から元言語への変換
 * @param {string} inputMoai モアイ語
 * @returns {string} 元の言語
 */
export const moaiLangToOrigin = (
  inputMoai: string,
): {
  origin: string;
  dividedMoai: string[];
  isStartMoai: boolean;
} => {
  if (!inputMoai) {
    return {
      origin: "",
      dividedMoai: [],
      isStartMoai: false,
    };
  }

  const pattern = Object.values(MOAI_CODE).join("|");
  const moaiRegexp = new RegExp(`モ(${pattern})+`, "g");
  const moaiCodeRegexp = new RegExp(pattern, "g");

  const dividedMoaiInfo: { text: string; isMoai: boolean }[] = [];
  let origin = "";

  // dividedMoaiInfo に textを追加する関数
  const textSetter = (text: string, isMoai: boolean) => {
    // 前が同じ(モアイ語or非モアイ語)場合は連結
    if (dividedMoaiInfo[dividedMoaiInfo.length - 1]?.isMoai === isMoai) {
      dividedMoaiInfo[dividedMoaiInfo.length - 1].text += text;
    } else {
      dividedMoaiInfo.push({ text, isMoai });
    }
  };

  let match;
  let lastIndex = 0;
  while ((match = moaiRegexp.exec(inputMoai)) !== null) {
    const matchedMoai = match[0];

    // モアイ語ではない部分(正規表現にmatchしなかった部分)の処理
    if (lastIndex !== match.index) {
      const notMoaiText = inputMoai.slice(lastIndex, match.index);
      textSetter(notMoaiText, false);
      origin += notMoaiText;
    }
    lastIndex = moaiRegexp.lastIndex;

    // 先頭の「モ」以外の部分をArrayとして取り出す。
    // 例: matchedMoai="モアァ" -> matchedMoaiArr=["ア", "ァ"]
    const matchedMoaiArr = matchedMoai.match(
      moaiCodeRegexp,
    ) as (keyof typeof REVERSED_MOAI_CODE)[];

    const unicode16Array = matchedMoaiArr.map(
      (code) => REVERSED_MOAI_CODE[code],
    );

    // 長いコードポイントや制御文字の対応。
    // コードポイントに対応する文字がない場合は、後ろから1文字ずつ削っていく
    const unicode: {
      target: (keyof typeof MOAI_CODE)[];
      excluded: (keyof typeof MOAI_CODE)[];
    } = { target: unicode16Array, excluded: [] };

    while (
      unicode.target.length !== 0 &&
      !isCorrectCodePoint(parseInt(unicode.target.join(""), 16))
    ) {
      const last = unicode.target.pop();
      if (last) unicode.excluded.push(last);
    }

    // モアイ語として読み取れる前半と、非モアイ語の後半に分ける
    if (unicode.target.length !== 0) {
      const moaiText =
        "モ" + matchedMoaiArr.slice(0, unicode.target.length).join("");
      textSetter(moaiText, true);
      origin += String.fromCodePoint(parseInt(unicode.target.join(""), 16));
    }
    if (unicode.excluded.length !== 0) {
      // 制御文字の場合(最終的にunicode.target.length === 0となる)は"モ"をつけてそのまま返す
      const notMoaiText =
        (unicode.target.length === 0 ? "モ" : "") +
        matchedMoaiArr.slice(unicode.target.length).join("");

      textSetter(notMoaiText, false);
      origin += notMoaiText;
    }
  }
  // 末尾(後半)の正規表現にmatchしなかった部分(非モアイ語)の処理
  if (lastIndex < inputMoai.length) {
    const notMoaiText = inputMoai.slice(lastIndex);
    textSetter(notMoaiText, false);
    origin += notMoaiText;
  }

  return {
    origin,
    dividedMoai: dividedMoaiInfo.map((info) => info.text),
    isStartMoai: dividedMoaiInfo[0].isMoai,
  };
};
