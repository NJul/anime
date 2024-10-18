interface SearchBoxProps {
  setSearch: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ setSearch }) => {
  return (
    <div className='search-box'>
      <input
        type='search'
        placeholder='Search your anime'
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  );
};
