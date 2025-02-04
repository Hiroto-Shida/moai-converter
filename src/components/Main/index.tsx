import { FC } from "react";
import moaiLogo from "../../assets/moai.png";

const Main: FC = () => {
  return (
    <div>
      <h1 className="text-center text-2xl">Hello, Moai!</h1>
      <img src={moaiLogo} className="w-[100px]" alt="moai logo" />
    </div>
  );
};

export default Main;
