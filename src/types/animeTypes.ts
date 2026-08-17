export interface Anime {
  mal_id: number;

  title: string;
  title_japanese: string | null;

  images: {
    jpg: {
      image_url: string | null;
      small_image_url: string | null;
      large_image_url: string | null;
    };
  };

  synopsis: string | null;

  source: string | null;

  score: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;

  status: string | null;
  duration: string | null;
  rating: string | null;
}
