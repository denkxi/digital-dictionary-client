type Props = {
    onClose: () => void;
  };
  
  export default function WordCategoryModal({ onClose }: Props) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-text mb-4">New Category</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-primary-1 rounded px-3 py-2 text-sm"
                placeholder="e.g. Food"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Description (optional)
              </label>
              <textarea
                rows={3}
                className="w-full border border-primary-1 rounded px-3 py-2 text-sm resize-none"
                placeholder="Additional info..."
              />
            </div>
  
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm bg-accent-2 hover:bg-green-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary-2 hover:bg-primary-1 rounded font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  