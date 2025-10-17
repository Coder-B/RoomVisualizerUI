import React, { useState, useEffect } from 'react';

interface ProductInstructionProps {
  onClose: () => void;
}

const instructions = [
  {
    title: 'Welcome to the Room Renovation Visualizer',
    text: 'See how different products look in your room. Upload a photo, choose a product, and see the result in seconds.',
    selector: '',
    position: 'center',
  },
  {
    title: 'Step 1: Upload Your Room Photo',
    text: '',
    selector: '.room-photo-display',
    position: 'top',
  },
  {
    title: 'Step 2: Search Products or browse by category',
    text: '',
    selector: '.category-selection',
    position: 'bottom',
  },
  {
    title: 'Step 3: Apply a product',
    text: '',
    selector: '.product-grid',
    position: 'top',
  },
];

const ProductInstruction: React.FC<ProductInstructionProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementStyle, setElementStyle] = useState({ highlight: {}, content: {} });

  const instruction = instructions[currentStep];

  useEffect(() => {
    if (instruction.selector) {
      setElementStyle(getElementStyle(instruction.selector, instruction.position));
    } else {
      setElementStyle({ highlight: {}, content: {} });
    }
  }, [instruction.selector, instruction.position]);

  const handleNext = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="instruction-overlay" onClick={onClose}>
      <div
        className={`instruction-box ${instruction.selector ? 'highlight-element' : ''}`}
        style={elementStyle.highlight}
      >
        <div
          className={`instruction-content instruction-${instruction.position}`}
          style={elementStyle.content}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>{instruction.title}</h3>
          {currentStep === 0 && <p>{instruction.text}</p>}
          <div className="instruction-buttons">
            {currentStep > 0 && <button onClick={handlePrev} className="skip-button">Previous</button>}
            <button onClick={handleNext}>{currentStep === instructions.length - 1 ? 'Done' : 'Next'}</button>
            <button onClick={onClose} className="skip-button">Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getElementStyle = (selector: string, position: string) => {
  const element = document.querySelector(selector);
  if (element) {
    const rect = element.getBoundingClientRect();
    const contentStyle: React.CSSProperties = {};

    if (position === 'top') {
      contentStyle.bottom = `${window.innerHeight - rect.top + 20}px`;
      contentStyle.left = '50%';
      contentStyle.transform = 'translateX(-50%)';
    } else if (position === 'bottom') {
      contentStyle.top = `${rect.bottom + 20}px`;
      contentStyle.left = '50%';
      contentStyle.transform = 'translateX(-50%)';
    }

    return {
      highlight: {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
      },
      content: contentStyle,
    };
  }
  return { highlight: {}, content: {} };
};

export default ProductInstruction;