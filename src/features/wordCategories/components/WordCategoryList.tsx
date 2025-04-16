import { useState } from "react";
import NewCategoryModal from "./NewCategoryModal";
import { useGetWordCategoriesQuery } from "../services/wordCategoryApi";
import CategoryCard from "./CategoryCard";

export default function WordCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useGetWordCategoriesQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Word Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + New Category
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to load categories.</p>}

      <ul className="space-y-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ul>

      {isModalOpen && (
        <NewCategoryModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
