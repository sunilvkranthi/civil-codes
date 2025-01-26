import React from 'react';
import { Book, FileText, HeartHandshake } from 'lucide-react';
import { Category } from './types/categories';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories: Array<{
    id: Category;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'code', label: 'Codes', icon: <FileText className="h-5 w-5" /> },
    { id: 'definition', label: 'Definitions', icon: <Book className="h-5 w-5" /> },
    { id: 'formula', label: 'Contribute PDF', icon: <HeartHandshake className="h-5 w-5" /> },
  ];

  return (
    <div className="flex space-x-4 mb-8">
      {categories.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onCategoryChange(id)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            activeCategory === id
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </button>
      ))}
    </div>
  );
}