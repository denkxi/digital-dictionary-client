import { useEffect, useState } from "react";
import {
  useGetWordCategoriesQuery,
  useDeleteWordCategoryMutation,
} from "../services/wordCategoryApi";
import CategoryCard from "./CategoryCard";
import { WordCategory } from "../types/WordCategory";
import CategoryModal from "./CategoryModal";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";
import Spinner from "../../../shared/components/Spinner";
import Button from "../../../shared/components/Button";
import { FaPlus } from "react-icons/fa";
import CategorySearchBar from "./CategorySearchBar";
import PaginationWrapper from "../../../shared/components/PaginationWrapper";

const ITEMS_PER_PAGE = 10; // todo: move to config/constants

export default function WordCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WordCategory | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<WordCategory | null>(
    null
  );
  const [rawSearch, setRawSearch] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>("name-asc");
  const [page, setPage] = useState(1);


  const {
    data,
    isLoading,
    isError,
  } = useGetWordCategoriesQuery({ search, sort, page, limit: ITEMS_PER_PAGE });

  const categories = data?.items || [];
  const totalItems = data?.totalItems || 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(rawSearch);
      setPage(1); // reset to first page on new search
    }, 500); // 500ms debounce
  
    return () => clearTimeout(timeout);
  }, [rawSearch]);
  

  const [deleteCategory] = useDeleteWordCategoryMutation();

  const handleEdit = (category: WordCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category: WordCategory) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-text">Word Categories</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="inline-flex items-center gap-2">
            <FaPlus className="text-base" />
            New Category
          </span>
        </Button>
      </div>

      <CategorySearchBar
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
      />

      {isLoading && <Spinner message="Loading categories..." />}
      {isError && <p className="text-red-500">Failed to load categories.</p>}
      {categories.length === 0 && !isLoading && (
        <p className="text-gray-500">No categories found.</p>
      )}

      <PaginationWrapper
        currentPage={page}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setPage}
      >
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </PaginationWrapper>

      {isModalOpen && (
        <CategoryModal
          mode={editingCategory ? "edit" : "create"}
          initialData={editingCategory || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      {categoryToDelete && (
        <ConfirmDeleteModal
          title="Delete Category"
          description={`Are you sure you want to delete "${categoryToDelete.name}"?`}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
