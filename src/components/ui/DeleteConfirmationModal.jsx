// src/components/ui/DeleteConfirmationModal.jsx

import { FaTrash, FaTimes } from "react-icons/fa";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  isDeleting,
  itemType = "item",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
              <FaTrash className="text-red-600 text-lg" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Delete {itemType}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this {itemType.toLowerCase()}?
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-800 truncate">
              "{itemTitle || "Untitled"}"
            </p>
          </div>
          <p className="text-sm text-red-600 mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash size={14} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
