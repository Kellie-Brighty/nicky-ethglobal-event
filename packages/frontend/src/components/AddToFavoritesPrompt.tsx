import { OrderItem } from '../types';
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AddToFavoritesPromptProps {
  order: OrderItem;
  onClose: () => void;
  onAdd: () => void;
}

export const AddToFavoritesPrompt = ({ order, onClose, onAdd }: AddToFavoritesPromptProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Add to Favorites?
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            {order.imageUrl && (
              <img
                src={order.imageUrl}
                alt={order.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{order.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{order.description}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Maybe Later
          </button>
          <button
            onClick={onAdd}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
          >
            <HeartIcon className="w-5 h-5" />
            Add to Favorites
          </button>
        </div>
      </div>
    </div>
  );
}; 