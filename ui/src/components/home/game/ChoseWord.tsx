import React from "react";
import generateWords from "@/utils/wordsGenerator";
import { socket } from "@/tools/socket";
import selectWords from "@/services/selectWords";

const ChoseWord = () => {
  const [words, setWords] = React.useState<SelectWordsResponse[]>([]);
  const handleChooseWord = (word: string) => {
    socket.emit("choose-word", word);
  };
  React.useEffect(() => {
    (async () => {
      const { data } = await selectWords();
      if (data) {
        setWords(data);
      }
    })();
  }, []);
  return (
    <>
      <p className="text-center text-2xl">Choose a word</p>
      <br />
      <div className="flex gap-2 flex-wrap all-center">
        {words.map((item, idx) => (
          <button
            key={idx}
            className="p-3 border-pr-text bg-gray-400 rounded blur-0"
            onClick={() => handleChooseWord(item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default ChoseWord;
