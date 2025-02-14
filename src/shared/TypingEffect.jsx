import { useEffect, useState } from "react";

const TypingEffect = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState("");
  
    useEffect(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        index += 1;
        if (index === text.length) clearInterval(intervalId);
      }, speed);
  
      return () => clearInterval(intervalId);
    }, [text, speed]);
  
    return <span>{displayedText}</span>;
  };
  
  export default TypingEffect;
  