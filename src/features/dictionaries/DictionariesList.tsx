import { useState } from "react";
import DictionaryCard from "./components/DictionaryCard";
import { useDeleteDictionaryMutation, useGetUserDictionariesQuery } from "./services/dictionaryApi";
import { Dictionary } from "./types/Dictionary";
import DictionaryModal from "./components/DictionaryModal";
import ConfirmDeleteModal from "../../shared/components/ConfirmDeleteModal";

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
        <h1 className="text-2xl font-semibold text-text">Dictionaries</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + New Dictionary
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to load dictionaries.</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
