import React from 'react';

interface CategorySelectionProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  onCategorySelect: () => void;
}

const mainCategories = ['Flooring', 'Walls', 'Furniture'];

const icons: { [key: string]: React.ReactNode } = {
  Flooring: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 19L21 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 5L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>,
  Walls: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20V20H4V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>,
  Furniture: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7H22V17H2V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 17V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 17V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>,
};

const CategorySelection: React.FC<CategorySelectionProps> = ({ selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory, onCategorySelect }) => {
  return (
    <div className="category-selection">
      <div className="main-categories">
        {mainCategories.map(category => (
          <button 
            key={category} 
            className={selectedCategory === category ? 'active' : ''} 
            onClick={() => {
              setSelectedCategory(category);
              onCategorySelect();
            }}
          >
            {icons[category]}
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
