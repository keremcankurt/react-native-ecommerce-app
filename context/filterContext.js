import { useState } from 'react';
import { createContext, useContext } from 'react';

const FilterContext = createContext();

export function useFilterContext() {
    return useContext(FilterContext);
}

export function FilterProvider({ children }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [sortType, setSortType] = useState('The Newest');
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [search, setSearch] = useState('');
    const [apply, setApply] = useState(0);

    const reset =() => {
        setSelectedCategories([])
        setIsChecked(false)
        setSortType('The Newest')
        setMinPrice(null)
        setMaxPrice(null)
        setSearch('')
    }

    const contextValue = {
        selectedCategories,
        setSelectedCategories,
        isChecked,
        setIsChecked,
        sortType,
        setSortType,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        search,
        setSearch,
        apply,
        setApply,
        reset
    };

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
}
