import { useParams } from "react-router-dom";
import { useState } from "react";
import WordModal from "./components/WordModal";
import WordItem from "./components/WordItem";
import BackButton from "../../shared/components/BackButton";
import ConfirmDeleteModal from "../../shared/components/ConfirmDeleteModal";
import { useGetWordsByDictionaryQuery, useDeleteWordMutation } from "./services/wordApi";
import { Word } from "./types/Word";

export default function WordList() {
  const { dictionaryId } = useParams();
  if (!dictionaryId) return null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deletingWord, setDeletingWord] = useState<Word | null>(null);
  const [deleteWord] = useDeleteWordMutation();

  const { data: words = [], isLoading, isError } = useGetWordsByDictionaryQuery(dictionaryId);

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsModalOpen(true);
  };

  const handleDelete = (word: Word) => {
    setDeletingWord(word);
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Words</h1>
        <button
          onClick={() => {
            setEditingWord(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + Add Word
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to load words.</p>}

      <ul className="space-y-4">
        {words.map(word => (
          <WordItem key={word.id} word={word} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </ul>

      {isModalOpen && (
        <WordModal
          mode={editingWord ? 'edit' : 'create'}
          initialData={editingWord || undefined}
          dictionaryId={dictionaryId}
          onClose={() => {
            setIsModalOpen(false);
            setEditingWord(null);
          }}
        />
      )}

      {deletingWord && (
        <ConfirmDeleteModal
          title="Delete Word"
          description={`Are you sure you want to delete "${deletingWord.writing}"?`}
          onCancel={() => setDeletingWord(null)}
          onConfirm={async () => {
            try {
              await deleteWord(deletingWord.id).unwrap();
              setDeletingWord(null);
            } catch (err) {
              console.error("Delete failed:", err);
            }
          }}
        />
      )}
    </div>
  );
}
