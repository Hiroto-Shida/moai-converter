import GlobalIcon from '@assets/global.svg';

const LanguageMenu: React.FC = () => {
  return (
    <div className="w-full">
      {/* TODO: 言語切り替え機能を実装 */}
      <img
        src={GlobalIcon.src}
        alt=""
        className="m-0 ml-auto size-[20px] cursor-pointer"
      />
    </div>
  );
};

export default LanguageMenu;
