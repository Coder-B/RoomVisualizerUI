import React from 'react';
import { categories } from './data';

interface CategorySelectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory }) => {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const newSubCategory = categories.find(c => c.name === category)?.subCategories[0];
    if (newSubCategory) {
      setSelectedSubCategory(newSubCategory);
    }
  };

  return (
    <div className="category-selection">
      <div className="main-categories">
        {categories.map((category) => (
          <button
            key={category.name}
            className={selectedCategory === category.name ? 'active' : ''}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <div className="sub-categories">
        {categories.find(c => c.name === selectedCategory)?.subCategories.map(subCategory => (
          <button
            key={subCategory}
            className={selectedSubCategory === subCategory ? 'active' : ''}
            onClick={() => setSelectedSubCategory(subCategory)}
          >
            {subCategory}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
