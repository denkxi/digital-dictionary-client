import { useState } from "react";
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
import { FiPlus } from "react-icons/fi";

export default function WordCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WordCategory | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<WordCategory | null>(
    null
  );
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetWordCategoriesQuery();

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
            <FiPlus className="text-base" />
            New Category
          </span>
        </Button>
      </div>

      {isLoading && <Spinner message="Loading categories..." />}
      {isError && <p className="text-red-500">Failed to load categories.</p>}

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
