import { describe, expect, test } from 'vitest';
import {
  isCorrectCodePoint,
  moaiLangToOrigin,
  originToMoaiLang,
} from '../../utils/convert';

// TODO: 結合文字のテストを追加する（ｶﾞなど）

describe('isCorrectCodePoint', () => {
  describe('正常系', () => {
    test('制御文字のコードポイントの場合', () => {
      expect(isCorrectCodePoint(0)).toBe(false);
    });

    test('範囲外のコードポイントの場合', () => {
      expect(isCorrectCodePoint(parseInt('FFFFFFFFFFF', 16))).toBe(false);
    });

    test('範囲内のコードポイントの場合', () => {
      // parseInt("0061", 16) は "a" のコードポイント(=10進数で「97」)
      expect(isCorrectCodePoint(parseInt('0061', 16))).toBe('a');
    });
  });
});

describe('任意の言語 → モアイ語翻訳 originToMoaiLang', () => {
  describe('正常系', () => {
    describe('1文字の場合', () => {
      test('通常文字', () => {
        // "a".codePointAt(0).toString(16) は "61"
        expect(originToMoaiLang('a')).toStrictEqual({
          moai: 'モﾓｱァ',
          dividedMoai: ['モﾓｱァ'],
          isStartMoai: true,
        });
      });

      test('数字の場合', () => {
        expect(originToMoaiLang('1')).toStrictEqual({
          moai: '1',
          dividedMoai: ['1'],
          isStartMoai: false,
        });
      });

      test('記号の場合', () => {
        expect(originToMoaiLang('!')).toStrictEqual({
          moai: '!',
          dividedMoai: ['!'],
          isStartMoai: false,
        });
      });

      test('スペースの場合', () => {
        expect(originToMoaiLang(' ')).toStrictEqual({
          moai: ' ',
          dividedMoai: [' '],
          isStartMoai: false,
        });
      });

      test('サロゲートペアの場合', () => {
        // "𠮷".codePointAt(0).toString(16) は "20bb7"
        expect(originToMoaiLang('𠮷')).toStrictEqual({
          moai: 'モイアｨｨﾓｲ',
          dividedMoai: ['モイアｨｨﾓｲ'],
          isStartMoai: true,
        });
      });
    });

    describe('複数文字の場合', () => {
      test('通常文字 の連続の場合', () => {
        // "a".codePointAt(0).toString(16) は "61"
        // "b".codePointAt(0).toString(16) は "62"
        expect(originToMoaiLang('ab')).toStrictEqual({
          moai: 'モﾓｱァモﾓｱイ',
          dividedMoai: ['モﾓｱァモﾓｱイ'],
          isStartMoai: true,
        });
      });

      test('記号 の連続の場合', () => {
        expect(originToMoaiLang('!ー＄％')).toStrictEqual({
          moai: '!ー＄％',
          dividedMoai: ['!ー＄％'],
          isStartMoai: false,
        });
      });

      test('通常文字 + 記号 の場合', () => {
        expect(originToMoaiLang('aー')).toStrictEqual({
          moai: 'モﾓｱァー',
          dividedMoai: ['モﾓｱァ', 'ー'],
          isStartMoai: true,
        });
      });

      test('記号 + 通常文字 の場合', () => {
        expect(originToMoaiLang('ーa')).toStrictEqual({
          moai: 'ーモﾓｱァ',
          dividedMoai: ['ー', 'モﾓｱァ'],
          isStartMoai: false,
        });
      });

      test('通常文字 + 記号 + 通常文字 の場合', () => {
        expect(originToMoaiLang('aーa')).toStrictEqual({
          moai: 'モﾓｱァーモﾓｱァ',
          dividedMoai: ['モﾓｱァ', 'ー', 'モﾓｱァ'],
          isStartMoai: true,
        });
      });

      test('記号 + 通常文字 + 記号 の場合', () => {
        expect(originToMoaiLang('ーaー')).toStrictEqual({
          moai: 'ーモﾓｱァー',
          dividedMoai: ['ー', 'モﾓｱァ', 'ー'],
          isStartMoai: false,
        });
      });

      test('ごちゃ混ぜ(通常文字 + 記号 + スペース + サロゲートペア)の場合', () => {
        expect(originToMoaiLang('aー 𠮷a')).toStrictEqual({
          moai: 'モﾓｱァー モイアｨｨﾓｲモﾓｱァ',
          dividedMoai: ['モﾓｱァ', 'ー ', 'モイアｨｨﾓｲモﾓｱァ'],
          isStartMoai: true,
        });
      });
    });
  });

  describe('準正常系', () => {
    test('結合文字のみの場合', () => {
      expect(originToMoaiLang('ｶﾞ')).toStrictEqual({
        moai: 'モﾓｨﾓｨﾓｲﾓｱモﾓｨﾓｨｧﾓｧ',
        dividedMoai: ['モﾓｨﾓｨﾓｲﾓｱモﾓｨﾓｨｧﾓｧ'],
        isStartMoai: true,
      });
    });
    test('結文字を含む文字列の場合', () => {
      expect(originToMoaiLang('-ｶﾞa')).toStrictEqual({
        moai: '-モﾓｨﾓｨﾓｲﾓｱモﾓｨﾓｨｧﾓｧモﾓｱァ',
        dividedMoai: ['-', 'モﾓｨﾓｨﾓｲﾓｱモﾓｨﾓｨｧﾓｧモﾓｱァ'],
        isStartMoai: false,
      });
    });
  });
});

describe('モアイ語 → 任意の言語翻訳 moaiLangToOrigin', () => {
  describe('正常系', () => {
    describe('1文字の場合', () => {
      test('通常文字', () => {
        expect(moaiLangToOrigin('モﾓｱァ')).toStrictEqual({
          origin: 'a',
          dividedMoai: ['モﾓｱァ'],
          isStartMoai: true,
        });
      });

      test('数字の場合', () => {
        expect(moaiLangToOrigin('1')).toStrictEqual({
          origin: '1',
          dividedMoai: ['1'],
          isStartMoai: false,
        });
      });

      test('記号の場合', () => {
        expect(moaiLangToOrigin('!')).toStrictEqual({
          origin: '!',
          dividedMoai: ['!'],
          isStartMoai: false,
        });
      });

      test('スペースの場合', () => {
        expect(moaiLangToOrigin(' ')).toStrictEqual({
          origin: ' ',
          dividedMoai: [' '],
          isStartMoai: false,
        });
      });

      test('サロゲートペアの場合', () => {
        // "𠮷".codePointAt(0).toString(16) は "20bb7"
        expect(moaiLangToOrigin('モイアｨｨﾓｲ')).toStrictEqual({
          origin: '𠮷',
          dividedMoai: ['モイアｨｨﾓｲ'],
          isStartMoai: true,
        });
      });
    });

    describe('複数文字の場合', () => {
      test('通常文字 の連続の場合', () => {
        // "a".codePointAt(0).toString(16) は "61"
        // "b".codePointAt(0).toString(16) は "62"
        expect(moaiLangToOrigin('モﾓｱァモﾓｱイ')).toStrictEqual({
          origin: 'ab',
          dividedMoai: ['モﾓｱァモﾓｱイ'],
          isStartMoai: true,
        });
      });

      test('記号 の連続の場合', () => {
        expect(moaiLangToOrigin('!ー＄％')).toStrictEqual({
          origin: '!ー＄％',
          dividedMoai: ['!ー＄％'],
          isStartMoai: false,
        });
      });

      test('通常文字 + 記号 の場合', () => {
        expect(moaiLangToOrigin('モﾓｱァー')).toStrictEqual({
          origin: 'aー',
          dividedMoai: ['モﾓｱァ', 'ー'],
          isStartMoai: true,
        });
      });

      test('記号 + 通常文字 の場合', () => {
        expect(moaiLangToOrigin('ーモﾓｱァ')).toStrictEqual({
          origin: 'ーa',
          dividedMoai: ['ー', 'モﾓｱァ'],
          isStartMoai: false,
        });
      });

      test('通常文字 + 記号 + 通常文字 の場合', () => {
        expect(moaiLangToOrigin('モﾓｱァーモﾓｱァ')).toStrictEqual({
          origin: 'aーa',
          dividedMoai: ['モﾓｱァ', 'ー', 'モﾓｱァ'],
          isStartMoai: true,
        });
      });

      test('記号 + 通常文字 + 記号 の場合', () => {
        expect(moaiLangToOrigin('ーモﾓｱァー')).toStrictEqual({
          origin: 'ーaー',
          dividedMoai: ['ー', 'モﾓｱァ', 'ー'],
          isStartMoai: false,
        });
      });

      test('ごちゃ混ぜ(通常文字 + 記号 + スペース + サロゲートペア)の場合', () => {
        expect(moaiLangToOrigin('モﾓｱァー モイアｨｨﾓｲモﾓｱァ')).toStrictEqual({
          origin: 'aー 𠮷a',
          dividedMoai: ['モﾓｱァ', 'ー ', 'モイアｨｨﾓｲモﾓｱァ'],
          isStartMoai: true,
        });
      });
    });
  });

  describe('準正常系', () => {
    describe('存在しないモアイ語の入力の場合', () => {
      test('制御文字の場合', () => {
        expect(moaiLangToOrigin('モア')).toStrictEqual({
          origin: 'モア',
          dividedMoai: ['モア'],
          isStartMoai: false,
        });
      });

      test('制御文字 + 制御文字 の場合', () => {
        expect(moaiLangToOrigin('モァモァ')).toStrictEqual({
          origin: 'モァモァ',
          dividedMoai: ['モァモァ'],
          isStartMoai: false,
        });
      });

      test('制御文字 + 記号 + 制御文字 の場合', () => {
        expect(moaiLangToOrigin('モァ-モァ')).toStrictEqual({
          origin: 'モァ-モァ',
          dividedMoai: ['モァ-モァ'],
          isStartMoai: false,
        });
      });

      test('制御文字 + 存在する文字 の場合', () => {
        expect(moaiLangToOrigin('モアモﾓｱァ')).toStrictEqual({
          origin: 'モアa',
          dividedMoai: ['モア', 'モﾓｱァ'],
          isStartMoai: false,
        });
      });

      test('存在する文字 + 制御文字 の場合', () => {
        expect(moaiLangToOrigin('モﾓｱァモア')).toStrictEqual({
          origin: 'aモア',
          dividedMoai: ['モﾓｱァ', 'モア'],
          isStartMoai: true,
        });
      });

      test('存在する文字 + 制御文字 + 記号 の場合', () => {
        expect(moaiLangToOrigin('モﾓｱァモア-')).toStrictEqual({
          origin: 'aモア-',
          dividedMoai: ['モﾓｱァ', 'モア-'],
          isStartMoai: true,
        });
      });

      test('範囲外のコードポイントを含む場合', () => {
        expect(moaiLangToOrigin('モオォオォオォオォオ')).toStrictEqual({
          origin: '񅑔ォオォオ',
          dividedMoai: ['モオォオォオ', 'ォオォオ'],
          isStartMoai: true,
        });
      });

      test('範囲外のコードポイントを含む文字 +制御文字 の場合', () => {
        expect(moaiLangToOrigin('モオォオォオォオォオモア')).toStrictEqual({
          origin: '񅑔ォオォオモア',
          dividedMoai: ['モオォオォオ', 'ォオォオモア'],
          isStartMoai: true,
        });
      });
    });
  });
});
