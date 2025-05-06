import { useState } from "react";
import DictionaryCard from "./components/DictionaryCard";
import {
  useDeleteDictionaryMutation,
  useGetUserDictionariesQuery,
} from "./services/dictionaryApi";
import { Dictionary } from "./types/Dictionary";
import DictionaryModal from "./components/DictionaryModal";
import ConfirmDeleteModal from "../../shared/components/ConfirmDeleteModal";
import Spinner from "../../shared/components/Spinner";
import Button from "../../shared/components/Button";
import { FaPlus } from "react-icons/fa";

export default function DictionariesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: dictionaries = [],
    isLoading,
    isError,
  } = useGetUserDictionariesQuery();
  const [deleteDictionary] = useDeleteDictionaryMutation();

  const [editingDict, setEditingDict] = useState<Dictionary | null>(null);
  const [deletingDict, setDeletingDict] = useState<Dictionary | null>(null);

  const handleEdit = (dict: Dictionary) => {
    setEditingDict(dict);
    setIsModalOpen(true);
  };

  const handleDelete = (dict: Dictionary) => {
    setDeletingDict(dict);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text select-none">Your Dictionaries</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="inline-flex items-center gap-2">
            <FaPlus className="text-base" />
            New Dictionary
          </span>
        </Button>
      </div>

      {isLoading && <Spinner message="Loading dictionaries..." />}
      {isError && <p className="text-red-500">Failed to load dictionaries.</p>}

      <div className="flex flex-wrap gap-4">
        {dictionaries.map((dict) => (
          <DictionaryCard
            key={dict.id}
            dictionary={dict}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <DictionaryModal
          mode={editingDict ? "edit" : "create"}
          initialData={editingDict || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDict(null);
          }}
        />
      )}

      {deletingDict && (
        <ConfirmDeleteModal
          title="Delete Dictionary"
          description={`Are you sure you want to delete "${deletingDict.name}"?`}
          onCancel={() => setDeletingDict(null)}
          onConfirm={async () => {
            try {
              await deleteDictionary(deletingDict.id).unwrap();
              setDeletingDict(null);
            } catch (err) {
              console.error("Delete failed", err);
            }
          }}
        />
      )}
    </div>
  );
}
