// Book interface as provided
export default interface Book {
  id: string;
  goodreads_book_id: number;
  best_book_id: number;
  work_id: number;
  books_count: number;
  isbn: string;
  isbn13: string;
  authors: string[];
  original_publication_year: number;
  original_title: string;
  title: string;
  language_code: string | null;
  average_rating: number;
  ratings_count: number;
  work_ratings_count: number;
  work_text_reviews_count: number;
  ratings_1: number;
  ratings_2: number;
  ratings_3: number;
  ratings_4: number;
  ratings_5: number;
  image_url: string;
  small_image_url: string;
}
