
import { Book, FileText, Calculator } from 'lucide-react';
import { Category } from '../types/categories.ts';

export const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'code': return <FileText className="h-6 w-6 text-indigo-600" />;
    case 'definition': return <Book className="h-6 w-6 text-indigo-600" />;
    case 'formula': return <Calculator className="h-6 w-6 text-indigo-600" />;
  }
};