import { useEffect, useState } from 'react';
import { Anime } from '../types/animeTypes';

const API_URL = 'https://graphql.anilist.co';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1500, 3000, 5000];

const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const SEARCH_ANIME_QUERY = `
  query SearchAnime($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) {
        id
        idMal

        title {
          romaji
          english
          native
        }

        coverImage {
          large
          medium
        }

        description

        source

        averageScore
        popularity

        status
        duration

        rankings {
          rank
          type
        }
      }
    }
  }
`;

interface AniListRanking {
  rank: number | null;
  type: string | null;
}

interface AniListMedia {
  id: number;
  idMal: number | null;

  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
  };

  coverImage: {
    large: string | null;
    medium: string | null;
  } | null;

  description: string | null;

  source: string | null;

  averageScore: number | null;
  popularity: number | null;

  status: string | null;
  duration: number | null;

  rankings: AniListRanking[] | null;
}

interface AniListResponse {
  data?: {
    Page?: {
      media?: AniListMedia[];
    };
  };

  errors?: Array<{
    message: string;
  }>;
}

const convertMediaToAnime = (media: AniListMedia): Anime => {
  const imageUrl = media.coverImage?.large ?? media.coverImage?.medium ?? null;

  const rank =
    media.rankings?.find(
      ranking => ranking.type === 'RATED' || ranking.type === 'POPULAR'
    )?.rank ?? null;

  return {
    // AniList иногда не имеет MAL ID.
    // В таком случае используем внутренний AniList ID,
    // чтобы сохранить ваш существующий интерфейс Anime.
    mal_id: media.idMal ?? media.id,

    title:
      media.title.english ??
      media.title.romaji ??
      media.title.native ??
      'Unknown title',

    title_japanese: media.title.native ?? null,

    images: {
      jpg: {
        image_url: imageUrl,
        small_image_url: media.coverImage?.medium ?? imageUrl,
        large_image_url: imageUrl,
      },
    },

    synopsis: media.description
      ? media.description.replace(/<[^>]*>/g, '').trim()
      : null,

    source: media.source,

    score: media.averageScore !== null ? media.averageScore / 10 : null,

    rank,

    popularity: media.popularity,

    members: media.popularity,

    status: media.status,

    duration: media.duration !== null ? `${media.duration} min` : null,

    // AniList не имеет прямого аналога Jikan "rating".
    rating: null,
  };
};

// useFetchAnime
export const useFetchAnime = (search: string) => {
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const query = search.trim();

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

      const variables = {
        search: query,
        page: 1,
        perPage: 10,
      };

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(API_URL, {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },

            body: JSON.stringify({
              query: SEARCH_ANIME_QUERY,
              variables,
            }),

            signal: controller.signal,
          });

          // Rate limit / server errors
          if (
            response.status === 429 ||
            response.status === 500 ||
            response.status === 502 ||
            response.status === 503 ||
            response.status === 504
          ) {
            if (attempt < MAX_RETRIES) {
              const retryAfter = response.headers.get('Retry-After');

              const retryDelay = retryAfter
                ? Number(retryAfter) * 1000
                : RETRY_DELAYS[attempt - 1];

              await sleep(retryDelay);

              continue;
            }

            if (response.status === 429) {
              setError(
                'AniList rate limit reached. Please wait a moment and try again.'
              );
            } else {
              setError(
                'AniList is temporarily unavailable. Please try again later.'
              );
            }

            setAnimeData([]);
            setLoading(false);

            return;
          }

          if (!response.ok) {
            setError(`AniList request failed with status ${response.status}.`);

            setAnimeData([]);
            setLoading(false);

            return;
          }

          const result: AniListResponse = await response.json();

          // GraphQL может вернуть HTTP 200,
          // но одновременно содержать errors.
          if (result.errors && result.errors.length > 0) {
            const message = result.errors
              .map(error => error.message)
              .join('. ');

            throw new Error(message);
          }

          const media = result.data?.Page?.media ?? [];

          const convertedAnime = media.map(convertMediaToAnime);

          setAnimeData(convertedAnime);
          setError(null);
          setLoading(false);

          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            setLoading(false);

            return;
          }

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

      setLoading(false);
    };

    const handler = setTimeout(fetchData, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [search]);

  return {
    animeData,
    loading,
    error,
  };
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
