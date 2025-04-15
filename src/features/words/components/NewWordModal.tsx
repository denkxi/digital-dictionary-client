type Props = {
    onClose: () => void;
    dictionaryId: number;
  };
  
  export default function NewWordModal({ onClose }: Props) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold text-text mb-4">Add New Word</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Writing
              </label>
              <input
                type="text"
                className="w-full border border-primary-1 rounded px-3 py-2 text-sm"
                placeholder="e.g. 猫"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Translation
              </label>
              <input
                type="text"
                className="w-full border border-primary-1 rounded px-3 py-2 text-sm"
                placeholder="e.g. cat"
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
                Add Word
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  