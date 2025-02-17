import clsx from "clsx";
import { useState } from "react";
import { useDebounce } from "src/hooks/useDebounce";

type ToolTipButtonProps = {
  children: React.ReactNode;
  text?: string;
  onClick?: () => void;
  clickedText?: string;
  disabled?: boolean;
  className?: string;
};

const ToolTipButton: React.FC<ToolTipButtonProps> = ({
  children,
  text = "",
  onClick = () => {},
  clickedText,
  disabled = false,
  className = "",
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const debounce = useDebounce(1000);

  return (
    <div
      className={
        disabled
          ? "cursor-not-allowed opacity-25"
          : "group relative cursor-pointer"
      }
    >
      {/* Button */}
      <div
        onClick={() => {
          if (disabled) return;
          onClick();
          setIsClicked(true);
          debounce(() => setIsClicked(false));
        }}
        className={clsx(
          "relative z-1 group-hover:block",
          "group-hover:before:bg-gray before:absolute before:top-[50%] before:left-[50%] before:z-[-1] before:size-[30px] before:translate-[-50%] before:rounded-[50%] before:bg-inherit before:opacity-30 before:duration-200 before:ease-in-out before:content-['']",
          className,
        )}
      >
        {children}
      </div>
      {/* Tooltip */}
      {text && (
        <div
          className={clsx(
            "absolute top-[calc(100%+5px)] left-[-4px] z-2 rounded-[8px] bg-black p-1 whitespace-nowrap text-white group-hover:block",
            isClicked ? "block" : "hidden",
            "before:absolute before:top-[-10px] before:left-[10px] before:border-[5px] before:border-b-[5px] before:border-solid before:border-transparent before:border-b-black before:content-['']",
          )}
        >
          <p className="text-xs">
            {isClicked && clickedText ? clickedText : text}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolTipButton;
