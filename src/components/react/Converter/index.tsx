import { moaiLangToOrigin, originToMoaiLang } from '@utils/convert';
import React, { useRef, useState } from 'react';
import MoaiTextArea from '../textArea/MoaiTextArea';
import OriginTextArea from '../textArea/OriginTextArea';

const Converter: React.FC = () => {
  const originTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const moaiTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const displayAreaRef = useRef<HTMLDivElement | null>(null);
  const [originValue, setOriginValue] = useState<string>('');
  const [moaiValue, setMoaiValue] = useState<string>('');

  const [moaiInfo, setMoaiInfo] = useState<
    Omit<ReturnType<typeof moaiLangToOrigin>, 'origin'>
  >({
    dividedMoai: [],
    isStartMoai: false,
  });

  const handleScroll = (target: 'origin' | 'moai') => {
    const scrollTop =
      target === 'origin'
        ? moaiTextAreaRef.current?.scrollTop
        : originTextAreaRef.current?.scrollTop;
    const targetRef =
      target === 'origin' ? originTextAreaRef.current : moaiTextAreaRef.current;
    if (targetRef) {
      targetRef.scrollTo({ top: scrollTop });
    }
  };

  // TODO: 反映箇所がわかるようなcssを付け加える
  const handleChange = (
    value: string,
    target: 'origin' | 'moai',
    fromClear?: boolean,
  ) => {
    if (target === 'origin') {
      if (!fromClear) {
        const moaiInfo = originToMoaiLang(value);
        setMoaiValue(moaiInfo.moai);
        setMoaiInfo({
          dividedMoai: moaiInfo.dividedMoai,
          isStartMoai: moaiInfo.isStartMoai,
        });
        handleScroll('moai');
      }
      setOriginValue(value);
    } else {
      const originInfo = moaiLangToOrigin(value);
      if (!fromClear) {
        setOriginValue(originInfo.origin);
        handleScroll('origin');
      }
      setMoaiValue(value);
      setMoaiInfo({
        dividedMoai: originInfo.dividedMoai,
        isStartMoai: originInfo.isStartMoai,
      });
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-4 md:flex-row">
      <OriginTextArea
        value={originValue}
        label="Your language"
        textareaRef={originTextAreaRef}
        placeholder="hello"
        maxLength={200}
        handleChange={(value, fromClear) =>
          handleChange(value, 'origin', fromClear)
        }
      />
      <MoaiTextArea
        value={moaiValue}
        label="Moai language"
        textareaRef={moaiTextAreaRef}
        placeholder="モﾓｱｱモﾓｱォモﾓｱｵモﾓｱｵモﾓｱﾓｨ"
        maxLength={1000}
        handleChange={(value, fromClear) =>
          handleChange(value, 'moai', fromClear)
        }
        displayAreaRef={displayAreaRef}
        moaiInfo={moaiInfo}
      />
    </div>
  );
};

export default Converter;
