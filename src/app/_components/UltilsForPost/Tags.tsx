import React, { useEffect, useRef, useState } from 'react';

interface InputTagsProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const InputTags: React.FC<InputTagsProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  // Define colors and darker shades
  const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300'];
  const darkerColors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600']; // Darker shades

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '' && tags.length < 4) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
        inputRef.current?.focus();
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    if (tags.length === 4) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [tags]);

  return (
    <div className='flex flex-col'>
      <div className="flex flex-wrap items-center rounded p-2 text-xl text-black">
        {tags.map((tag, index) => {
          const colorClass = `${colors[index % colors.length]} bg-opacity-15`;
          const darkerColorClass = darkerColors[index % darkerColors.length];

          return (
            <div
              key={index}
              className={`${colorClass} text-black text-xl px-4 py-2 rounded-lg mr-2 mb-2 flex items-center`}
            >
              <span className={`${darkerColorClass} px-1 text-xl`}>#</span> {/* Darker text color for # */}
              <span className='mx-2 text-xl'>{tag}</span>
              <button
                type="button"
                className="ml-2 text-black text-xl hover:text-red-500"
                onClick={() => removeTag(index)}
              >
                x
              </button>
            </div>
          );
        })}

        {tags.length < 4 && (
          <input
            type="text"
            className="outline-none text-black flex-1 placeholder:font-light"
            placeholder={tags.length > 0 ? "Add another tag..." : "Add up to 4 tags..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        )}
      </div>
      {showMessage && (
        <p className="text-black mt-2">Only 4 selections are allowed.</p>
      )}
    </div>
  );
};

export default InputTags;
