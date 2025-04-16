import { useParams } from "react-router-dom";
import { useState } from "react";
import NewWordModal from "./components/NewWordModal";
import WordItem from "./components/WordItem";
import BackButton from "../../shared/components/BackButton";
import { useGetWordsByDictionaryQuery } from "./services/wordApi";

export default function WordList() {
  const { dictionaryId } = useParams();
  const parsedId = Number(dictionaryId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: words = [],
    isLoading,
    isError,
  } = useGetWordsByDictionaryQuery(parsedId);

  return (
    <div>
      <BackButton />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-text">Words</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
          >
            + Add Word
          </button>
        </div>

        {isLoading && <p>Loading...</p>}
        {isError && <p className="text-red-500">Failed to load words.</p>}

        <ul className="space-y-4">
          {words.map((word) => (
            <WordItem key={word.id} word={word} />
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <NewWordModal
          dictionaryId={parsedId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
