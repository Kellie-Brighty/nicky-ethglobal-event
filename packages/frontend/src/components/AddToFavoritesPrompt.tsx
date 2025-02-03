import { OrderItem } from '../types';
import { motion } from 'framer-motion';

interface AddToFavoritesPromptProps {
  order: OrderItem;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AddToFavoritesPrompt: React.FC<AddToFavoritesPromptProps> = ({
  order,
  onConfirm,
  onCancel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <div className="bg-dark-secondary p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 text-light-gray">
          Add to Favorites?
        </h3>
        <p className="text-light-gray/80 mb-6">
          Would you like to add {order.name} to your favorites?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-neon-blue hover:bg-neon-blue/10 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-green"
          >
            Add to Favorites
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 