import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WordModal from "./WordModal";
import WordItem from "./WordItem";
import BackButton from "../../../shared/components/BackButton";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";
import {
  useGetWordsByDictionaryQuery,
  useDeleteWordMutation,
  useUpdateWordMutation,
} from "../services/wordApi";
import { Word, WordClass } from "../types/Word";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa";
import WordSearchBar from "./WordSearchBar";
import PaginationWrapper from "../../../shared/components/PaginationWrapper";

export default function WordList() {
  const { dictionaryId } = useParams();
  if (!dictionaryId) return null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [deletingWord, setDeletingWord] = useState<Word | null>(null);
  const [deleteWord] = useDeleteWordMutation();
  const [updateWord] = useUpdateWordMutation();

  // Search bar controls
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("name-asc");
  const [selectedClasses, setSelectedClasses] = useState<WordClass[]>([]);
  const [showStarred, setShowStarred] = useState(false);
  const [showLearned, setShowLearned] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12; //todo: move to constants

  const {
    data,
    isLoading,
    isError,
  } = useGetWordsByDictionaryQuery({
    dictionaryId,
    search,
    sort,
    page,
    limit,
    wordClass: selectedClasses,
    starred: showStarred,
    learned: showLearned,
  });

  const words = data?.items || [];
  const totalItems = data?.totalItems || 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(rawSearch);
      setPage(1); // reset to first page on new search
    }, 500); // 500ms debounce

    return () => clearTimeout(timeout);
  }, [rawSearch]);

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsModalOpen(true);
  };

  const onToggleStarred = async (word: Word) => {
    try {
      await updateWord({
        id: word.id,
        data: { isStarred: !word.isStarred },
      }).unwrap();
    } catch (error: any) {
      alert(error?.data?.error || "Failed to update word");
    }
  };

  const onToggleLearned = async (word: Word) => {
    try {
      await updateWord({
        id: word.id,
        data: { isLearned: !word.isLearned },
      }).unwrap();
    } catch (error: any) {
      alert(error?.data?.error || "Failed to update word");
    }
  };

  return (
    <div>
      <BackButton />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Words</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingWord(null);
            setIsModalOpen(true);
          }}
        >
          <span className="inline-flex items-center gap-2">
            <FaPlus className="text-base" />
            New Word
          </span>
        </Button>
      </div>

      <WordSearchBar
        searchValue={rawSearch}
        onSearchChange={setRawSearch}
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "name-asc", label: "Name A–Z" },
          { value: "name-desc", label: "Name Z–A" },
          { value: "date-desc", label: "Newest First" },
          { value: "date-asc", label: "Oldest First" },
        ]}
        selectedClasses={selectedClasses}
        onToggleClass={(cls) =>
          setSelectedClasses((prev) =>
            prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
          )
        }
        showStarred={showStarred}
        onToggleStarred={() => setShowStarred((prev) => !prev)}
        showLearned={showLearned}
        onToggleLearned={() => setShowLearned((prev) => !prev)}
      />

      {isLoading && <Spinner message="Loading words..." />}
      {isError && <p className="text-red-500">Failed to load words.</p>}
      {!isLoading && !isError && words.length === 0 && (
        <p className="text-gray-500">No words found.</p>
      )}

      {words.length > 0 && (
        <PaginationWrapper currentPage={page} totalItems={totalItems} itemsPerPage={limit} onPageChange={setPage}>
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          {words.map((word) => (
            <WordItem
              key={word.id}
              word={word}
              onEdit={handleEdit}
              onToggleStarred={onToggleStarred}
              onToggleLearned={onToggleLearned}
            />
          ))}
        </div>
      </PaginationWrapper>
      )}

      {isModalOpen && (
        <WordModal
          mode={editingWord ? "edit" : "create"}
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
