import { LANG } from '@constants/lang';

export type LangType = (typeof LANG)[keyof typeof LANG];
