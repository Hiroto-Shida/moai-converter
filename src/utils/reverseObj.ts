// see: https://www.hueter.net/articles/type-safe-reversal-of-a-records-key-value-pairs/

// キーと値を逆にした型
type Reverse<T extends Record<keyof T, PropertyKey>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

// キーと値を逆にする関数
export const reverseObj = <T extends Record<keyof T, PropertyKey>>(
  obj: T,
): Reverse<T> =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
