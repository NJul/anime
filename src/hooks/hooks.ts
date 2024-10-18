import { useEffect, useState } from 'react';
import { Anime } from '../types/animeTypes';

//  useFetchAnime
export const useFetchAnime = (search: string) => {
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!search) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${search}&limit=10`
        );
        if (!res.ok) throw new Error('Failed to fetch data');
        const resData = await res.json();
        setAnimeData(resData.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(fetchData, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return { animeData, loading, error };
};

// useLocalStorage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as [
    T,
    React.Dispatch<React.SetStateAction<T>>
  ];
};
