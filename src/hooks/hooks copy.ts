import { useEffect, useState } from 'react';
import { Anime } from '../types/animeTypes';

const API_URL = 'https://api.jikan.moe/v4/anime';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1500, 3000, 5000];

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

// useFetchAnime
export const useFetchAnime = (search: string) => {
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const query = search.trim();

    // Не выполняем запрос для пустого поиска
    if (!query) {
      setAnimeData([]);
      setError(null);
      setLoading(false);

      return () => {
        controller.abort();
      };
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        q: query,
        limit: '10',
      });

      const url = `${API_URL}?${params.toString()}`;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(url, {
            signal: controller.signal,
          });

          // Успешный ответ
          if (response.ok) {
            const result = await response.json();

            setAnimeData(result.data ?? []);
            setError(null);
            setLoading(false);

            return;
          }

          // Слишком много запросов
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');

            const retryDelay = retryAfter
              ? Number(retryAfter) * 1000
              : RETRY_DELAYS[attempt - 1];

            if (attempt < MAX_RETRIES) {
              await sleep(retryDelay);
              continue;
            }

            setAnimeData([]);
            setError('Too many requests. Please wait a moment and try again.');
            setLoading(false);

            return;
          }

          // Временные ошибки Jikan
          if ([500, 502, 503, 504].includes(response.status)) {
            if (attempt < MAX_RETRIES) {
              await sleep(RETRY_DELAYS[attempt - 1]);
              continue;
            }

            setAnimeData([]);

            if (response.status === 504) {
              setError(
                'Jikan is temporarily unable to get data from MyAnimeList. Please try again later.'
              );
            } else {
              setError(
                'The anime service is temporarily unavailable. Please try again later.'
              );
            }

            setLoading(false);

            return;
          }

          // Другие HTTP ошибки
          setAnimeData([]);
          setError(`Request failed with status ${response.status}.`);
          setLoading(false);

          return;
        } catch (error) {
          // Запрос был отменён
          if (error instanceof DOMException && error.name === 'AbortError') {
            setLoading(false);
            return;
          }

          // Для сетевых ошибок тоже пробуем повторить
          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAYS[attempt - 1]);
            continue;
          }

          setAnimeData([]);
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to fetch anime data.'
          );
          setLoading(false);

          return;
        }
      }

      // Защита на случай, если цикл завершился неожиданно
      setLoading(false);
    };

    // Debounce
    const handler = setTimeout(fetchData, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
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
    React.Dispatch<React.SetStateAction<T>>,
  ];
};
