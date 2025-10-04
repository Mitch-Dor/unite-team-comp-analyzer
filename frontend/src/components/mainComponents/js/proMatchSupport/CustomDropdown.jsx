import '../../css/proMatchSupport/customDropdown.css';
import React, { useState, useEffect, useRef } from 'react';

// Custom dropdown component
function CustomDropdown({ value, onChange, options, placeholder, disabled, path, character_name }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTarget, setCurrentTarget] = useState(-1);
    const dropdownRef = useRef(null);
    const isFocusedRef = useRef(false);
    const optionsRef = useRef(null);

    // Scroll to current target when it changes
    useEffect(() => {
        if (isOpen && currentTarget !== -1 && optionsRef.current) {
            const options = optionsRef.current.children;
            if (options[currentTarget]) {
                options[currentTarget].scrollIntoView({ 
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTarget, isOpen]);

    // Set up event listeners once on mount
    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                isFocusedRef.current = false;
            }
        }

        // Handle keyboard navigation and use this to track input
        const handleKeyDown = (e) => {
            // Only handle keyboard events if this dropdown is focused
            if (!isFocusedRef.current) return;

            if (e.key === 'Enter') { // Submit the targeted option
                if (currentTarget !== -1) {
                    const selectedOption = options[currentTarget];
                    onChange(selectedOption);
                    setSearchTerm('');
                    e.preventDefault();
                    setIsOpen(false);
                } else {
                    setSearchTerm('');
                    setIsOpen(false);
                }
            } else if (e.key === 'Escape') { // Close the dropdown
                setIsOpen(false);
                setSearchTerm('');
            } else if (e.key === 'Backspace') { // Clear the input
                setSearchTerm('');
            } else if (e.key === 'ArrowDown') { // Move down the list
                // Prevent moving the page up
                e.preventDefault();
                setCurrentTarget(prev => Math.min(prev + 1, options.length - 1));
            } else if (e.key === 'ArrowUp') { // Move up the list
                // Prevent moving the page down
                e.preventDefault();
                setCurrentTarget(prev => Math.max(prev - 1, 0));
            } else if (/^[a-zA-Z]$/.test(e.key)) { // If the user enters any letter update searchTerm
                setSearchTerm(prev => prev + e.key);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [options, onChange, currentTarget]);

    // Update current target based on search term
    useEffect(() => {
        if (searchTerm) {
            let target = -1;
            let earliestAppearance = -1;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const name = option.pokemon_name ? option.pokemon_name : option.move_name;
                const index = name.toLowerCase().indexOf(searchTerm.toLowerCase());
                if (index !== -1 && (target === -1 || index < earliestAppearance)) {
                    target = i;
                    earliestAppearance = index;
                }
            }
            setCurrentTarget(target);
        } else {
            setCurrentTarget(-1);
        }
    }, [searchTerm, options]);

    function getImagePath(name) {
        if (character_name) {
            const formattedName = name.replace(/\s+/g, '_');
            return `${path}/${character_name}_${formattedName}.png`;
        }
        return `${path}/${name}.png`;
    }

    return (
        <div 
            className="custom-dropdown" 
            ref={dropdownRef}
            onFocus={() => {
                isFocusedRef.current = true;
            }}
            onBlur={() => {
                isFocusedRef.current = false;
            }}
        >
            <button 
                className="custom-dropdown-dropdown-button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    isFocusedRef.current = true;
                }}
                disabled={disabled}
            >
                {/* Display the selected option */}
                {value && (value && ((value?.pokemon_name ?? "") !== "" || (value?.move_name ?? "") !== "")) ? (
                    <div className="custom-dropdown-selected-option">
                        <img 
                            src={getImagePath(value.pokemon_name ? value.pokemon_name : value.move_name)} 
                            alt={value.pokemon_name ? value.pokemon_name : value.move_name}
                            className="custom-dropdown-dropdown-icon"
                        />
                        <span>{value.pokemon_name ? value.pokemon_name : value.move_name}</span>
                    </div>
                ) : searchTerm ? (
                    <span>{searchTerm}</span>
                ) :  (
                    <span>{placeholder}</span>
                )}
            </button>
            {isOpen && (
                <div className="custom-dropdown-dropdown-options" ref={optionsRef}>
                    <div
                        className="custom-dropdown-dropdown-option"
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                    >
                        <span>{placeholder}</span>
                    </div>
                    {options.map((option, index) => (
                        <div
                            key={option.pokemon_id || option.move_id || option.pokemon_name || option.move_name || index}
                            className={`custom-dropdown-dropdown-option ${index === currentTarget ? 'target' : ''}`}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            <img 
                                src={getImagePath(option.pokemon_name ? option.pokemon_name : option.move_name)} 
                                alt={option.pokemon_name ? option.pokemon_name : option.move_name}
                                className="custom-dropdown-dropdown-icon"
                            />
                            <span>{option.pokemon_name ? option.pokemon_name : option.move_name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;