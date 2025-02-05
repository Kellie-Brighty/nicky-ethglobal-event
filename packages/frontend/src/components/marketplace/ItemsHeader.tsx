import React from "react";

interface ItemsHeaderProps {
  title: string;
}

export const ItemsHeader: React.FC<ItemsHeaderProps> = ({ title }) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold text-light-gray">{title}</h2>
    </div>
  );
};
