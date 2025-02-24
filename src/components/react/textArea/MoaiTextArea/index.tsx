import AudioButton from '@assets/audio.svg';
import ClearButton from '@assets/clear.svg';
import CopyButton from '@assets/copy.svg';
import MoaiStroke from '@assets/moai-stroke-white.svg';
import ToolTipButton from '@components/react/ToolTipButton';
import { moaiLangToOrigin } from '@utils/convert';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import type { ContentType } from 'src/types/translations';
import styles from '../TextArea.module.css';

type MoaiTextAreaProps = {
  value: string;
  content: ContentType;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  maxLength: number;
  handleChange: (value: string, fromClear?: boolean) => void;
  displayAreaRef: React.RefObject<HTMLDivElement | null>;
  moaiInfo: Omit<ReturnType<typeof moaiLangToOrigin>, 'origin'>;
};

const MoaiTextArea: React.FC<MoaiTextAreaProps> = ({
  value,
  content,
  textareaRef,
  maxLength,
  handleChange,
  displayAreaRef,
  moaiInfo,
}) => {
  const [count, setCount] = useState(0);

  const handleClear = () => {
    if (textareaRef.current) textareaRef.current.value = '';
    handleChange('', true);
    setCount(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textareaRef.current?.value || '');
  };

  const handleAudioPlay = () => {
    if (!textareaRef.current?.value) return;

    // 確認ダイアログを表示して音声を再生するか確認する
    if (!window.confirm(content.textarea.moai.audio.dialog)) return;

    const utterance = new SpeechSynthesisUtterance(textareaRef.current.value);
    utterance.lang = 'ja-JP';
    utterance.pitch = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // 入力要素と表示要素のスクロールを連動させる
  useEffect(() => {
    const textMoaiElement = textareaRef.current;
    if (textMoaiElement) {
      const handleScrollDisplay = () => {
        const scrollTop = textMoaiElement.scrollTop;
        const displayAreaElement = displayAreaRef.current;
        if (displayAreaElement) {
          displayAreaElement.scrollTo({ top: scrollTop });
        }
      };
      textMoaiElement.addEventListener('scroll', handleScrollDisplay);
      return () => {
        textMoaiElement.removeEventListener('scroll', handleScrollDisplay);
      };
    }
  }, []);

  const styledMoaiLang = useMemo(() => {
    return moaiInfo.dividedMoai.map((text, index) => {
      const splitText = text.split('\n');
      const element = splitText.map((t, i) => (
        <React.Fragment key={i}>
          {i !== 0 && <br />}
          {t}
          {index === moaiInfo.dividedMoai.length - 1 &&
            i === splitText.length - 1 && <br />}
        </React.Fragment>
      ));
      if (index % 2 === (moaiInfo.isStartMoai ? 0 : 1)) {
        return (
          <span key={index} className="break-words whitespace-pre-wrap">
            {element}
          </span>
        );
      }
      return (
        <span
          key={index}
          className="text-error break-words whitespace-pre-wrap"
        >
          {element}
        </span>
      );
    });
  }, [moaiInfo]);

  useEffect(() => {
    setCount(value.length);
  }, [value]);

  return (
    <div className="w-full">
      <label
        htmlFor={`moai_textarea`}
        className="block w-fit font-bold text-white"
      >
        {content.textarea.moai.label}
      </label>
      <div className="bg-secondary relative mt-1 flex h-[150px] flex-col rounded-[8px] has-focus-within:outline-2 has-focus-within:outline-black">
        <img
          src={MoaiStroke.src}
          alt=""
          className="absolute top-0 right-[28px] z-0 h-full"
        />
        <textarea
          id={`moai_textarea`}
          ref={textareaRef}
          placeholder={content.textarea.moai.placeholder}
          onChange={(event) => handleChange(event.target.value)}
          maxLength={maxLength}
          className={clsx(
            styles.textarea,
            'placeholder:text-gray absolute h-[110px] w-full flex-1 resize-none p-2 pr-[28px] break-words whitespace-pre-wrap focus:outline-none',
            'z-2 bg-transparent text-transparent caret-black',
          )}
          value={value}
        />
        <div
          ref={displayAreaRef}
          className={clsx(
            styles.display,
            'z-1 box-border h-[110px] w-full overflow-y-scroll p-2 pr-[28px] break-words whitespace-pre-wrap',
          )}
        >
          {styledMoaiLang}
        </div>
        <img
          src={ClearButton.src}
          alt=""
          className="absolute top-2 right-2 z-2 cursor-pointer"
          onClick={handleClear}
        />
        <div className="z-2 my-2 flex h-[24px] items-center gap-4 px-2">
          <ToolTipButton
            text={content.textarea.moai.audio.hover}
            onClick={handleAudioPlay}
          >
            <img src={AudioButton.src} alt="" className="size-[20px]" />
          </ToolTipButton>
          <ToolTipButton
            text={content.textarea.moai.copy.hover}
            onClick={handleCopy}
            clickedText={content.textarea.moai.copy.clicked}
          >
            <img src={CopyButton.src} alt="" className="size-[20px]" />
          </ToolTipButton>
          <div className="text-small flex-1 text-right leading-[20px]">
            <span
              className={
                textareaRef.current &&
                textareaRef.current.value.length >= maxLength
                  ? 'text-error'
                  : ''
              }
            >
              {count}
            </span>
            <span>/{maxLength}</span>
          </div>
        </div>
      </div>
      {(moaiInfo.dividedMoai.length >= 2 ||
        (moaiInfo.dividedMoai.length === 1 && !moaiInfo.isStartMoai)) && (
        <div className="text-error mt-1 flex">
          <div>※</div>
          <p className="ml-[2px]">{content.textarea.error}</p>
        </div>
      )}
    </div>
  );
};

export default MoaiTextArea;
