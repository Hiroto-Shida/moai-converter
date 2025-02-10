// 半角記号と、使いそうな全角記号を適当にピックアップ
// see: https://www.gaji.jp/blog/2022/03/22/9346/
// see: https://qiita.com/katsukii/items/1c1550f064b4686c04d4
const SPECIAL_CHARACTERS_TXT =
  "\\s\\d\n!\\?_\\+\\*'\"`#\\$%&\\-\\^\\@;:,¥\\.\\/=~\\|\\[\\]\\(\\)\\{\\}<>" +
  "、。，．・：；？！゛゜´｀＾￣＿〃〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【】＋－±×÷＝≠＜＞≦≧°′″￥＄￠￡％＃＆＊＠§※〒→←↑↓⇒⇔\
①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";

export const SPECIAL_CHARACTERS_REGEXP = new RegExp(
  `[${SPECIAL_CHARACTERS_TXT}]`,
);
