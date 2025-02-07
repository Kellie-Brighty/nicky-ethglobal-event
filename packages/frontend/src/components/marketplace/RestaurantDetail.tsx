import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  MenuIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { Restaurant } from "../../data/products";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
}

interface TabInfo {
  id: "menu" | "info" | "reviews";
  label: string;
  icon: React.ComponentType<{ className: string }>;
}

const TABS: TabInfo[] = [
  {
    id: "menu",
    label: "Menu",
    icon: MenuIcon,
  },
  {
    id: "info",
    label: "Info",
    icon: InformationCircleIcon,
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: ChatBubbleBottomCenterTextIcon,
  },
] as const;

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg"
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="relative h-full flex items-center justify-center">
        <button
          onClick={handlePrev}
          className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-[80vw] object-contain"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        <button
          onClick={handleNext}
          className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-neon-blue" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onClose,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"menu" | "info" | "reviews">(
    "menu"
  );

  // Mock data - replace with actual data from your restaurant type
  const restaurantImages = [
    restaurant.image,
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1599458252573-56ae36120de1",
  ];

  const restaurantInfo = {
    address: "123 Cyber Street, Neo City",
    phone: "+1 (555) 123-4567",
    email:
      "contact@" + restaurant.name.toLowerCase().replace(/\s+/g, "") + ".com",
    hours: [
      { day: "Monday - Friday", hours: "11:00 AM - 10:00 PM" },
      { day: "Saturday - Sunday", hours: "10:00 AM - 11:00 PM" },
    ],
    features: ["Online Ordering", "Delivery", "Takeout", "Outdoor Seating"],
    paymentMethods: ["Credit Card", "Crypto", "Cash"],
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-dark-secondary rounded-lg overflow-hidden">
          {/* Header Image Section */}
          <div className="relative h-[40vh] overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-secondary to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/50 text-white hover:bg-black/70 flex items-center gap-2"
            >
              <PhotoIcon className="w-5 h-5" />
              <span>View Gallery</span>
            </button>
          </div>

          {/* Restaurant Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-light-gray mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-neon-blue/60 text-lg mb-4">
                  {restaurant.description}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-light-gray">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-5 h-5 text-neon-blue" />
                    <span className="text-light-gray">
                      {restaurant.deliveryTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                    <span className="text-light-gray">
                      Min {restaurant.minimumOrder}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-5 h-5 text-red-400" />
                    <span className="text-light-gray">
                      {restaurantInfo.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-neon-blue/10 mb-6">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`pb-4 px-2 text-sm font-medium relative ${
                      selectedTab === tab.id
                        ? "text-neon-blue"
                        : "text-neon-blue/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {selectedTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {selectedTab === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {restaurant.categories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 rounded-lg border border-neon-blue/10 hover:border-neon-blue/30 transition-colors"
                    >
                      <h3 className="text-xl font-semibold text-light-gray mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-neon-blue/60">
                          {category.description}
                        </p>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {selectedTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-light-gray mb-4">
                      Hours of Operation
                    </h3>
                    {restaurantInfo.hours.map((schedule) => (
                      <div
                        key={schedule.day}
                        className="flex justify-between text-neon-blue/60 mb-2"
                      >
                        <span>{schedule.day}</span>
                        <span>{schedule.hours}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-light-gray mb-4">
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurantInfo.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-light-gray mb-4">
                      Payment Methods
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurantInfo.paymentMethods.map((method) => (
                        <span
                          key={method}
                          className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-sm"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-light-gray mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-neon-blue/60">
                      <p>Phone: {restaurantInfo.phone}</p>
                      <p>Email: {restaurantInfo.email}</p>
                      <p>Address: {restaurantInfo.address}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 text-neon-blue/60"
                >
                  <InformationCircleIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Reviews coming soon!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <ImageGallery
            images={restaurantImages}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
