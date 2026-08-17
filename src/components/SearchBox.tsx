import { useState } from 'react';

interface SearchBoxProps {
  setSearch: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ setSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedValue = value.trim();

    setSearch(trimmedValue);
  };

  return (
    <form className='search-box' onSubmit={handleSubmit}>
      <input
        type='search'
        value={value}
        placeholder='Search your anime'
        onChange={e => setValue(e.target.value)}
      />

      <button type='submit'>Search</button>
    </form>
  );
};
