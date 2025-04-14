type Props = {
    word: {
      id: number;
      writing: string;
      translation: string;
    };
  };
  
  export default function WordItem({ word }: Props) {
    return (
      <div className="border border-primary-1 rounded p-4 bg-white shadow-sm">
        <div className="text-lg font-medium text-text">{word.writing}</div>
        <div className="text-sm text-gray-600">Translation: {word.translation}</div>
      </div>
    );
  }
  