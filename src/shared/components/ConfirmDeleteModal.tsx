import Button from "./Button";

type ConfirmDeleteModalProps = {
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
  };
  
  export default function ConfirmDeleteModal({
    title = 'Confirm Deletion',
    description = 'Are you sure you want to delete this item?',
    onConfirm,
    onCancel,
  }: ConfirmDeleteModalProps) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Delete</Button>
          </div>
        </div>
      </div>
    );
  }
  