import { FC } from "react";
import moaiLogo from "../../assets/moai.png";

const Main: FC = () => {
  return (
    <div>
      <h1 clasName="text-center text-2xl">Hello, Moai!</h1>
      <p>test</p>
      <img src={moaiLogo} className="w-[100px]" alt="moai logo" />
    </div>
  );
};

export default Main;
