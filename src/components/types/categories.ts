export type Category = 'code' | 'definition' | 'formula';

export const getCategoryTitle = (category: Category): string => {
  switch (category) {
    case 'code': return 'Code';
    case 'definition': return 'Definition';
    case 'formula': return 'Formula';
  }
};