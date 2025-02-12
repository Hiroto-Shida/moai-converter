import React, { useState } from "react";

type TextAreaProps = {
  label: string;
};

const TextArea: React.FC<TextAreaProps> = ({ label }) => {
  const [text, setText] = useState("");

  const handleInputChange = (text: string) => {
    setText(text);
  };

  return (
    <div>
      <label htmlFor="textarea">{label}</label>
      <input
        type="text"
        id="textarea"
        // onChange={handleInputChange}
        onChange={(event) => handleInputChange(event.target.value)}
        className="bg-amber-100"
      />
      <p>{text}</p>
    </div>
  );
};

export default TextArea;
