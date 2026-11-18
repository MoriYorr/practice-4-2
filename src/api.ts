import type { Book } from './task1-types';

const API_URL = import.meta.env.VITE_BOOKS_API_URL?.trim().replace(/\/+$/, '');

interface BookDTO {
  id: string;
  title: string;
  author: string;
  year?: number | null;
  rating?: number | null;
}

function mapFromServer(dto: BookDTO): Book {
  return {
    id: dto.id,
    title: dto.title,
    authors: dto.author ? [dto.author] : [],
    year: dto.year ?? undefined,
    rating: dto.rating ?? undefined,
  };
}

function mapToServer(book: Book): BookDTO {
  return {
    id: book.id,
    title: book.title,
    author: book.authors[0] ?? '',
    year: book.year,
    rating: book.rating,
  };
}

export async function fetchBooks(): Promise<Book[]> {
  if (!API_URL) {
    throw new Error('Укажите адрес ресурса books в VITE_BOOKS_API_URL в файле .env.local.');
  }
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const dtos: BookDTO[] = await response.json();
  return dtos.map(mapFromServer);
}

export async function saveBook(book: Book): Promise<Book> {
  const data = mapToServer(book);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Если поле не отправить, MockAPI заполнит его случайным числом.
    body: JSON.stringify({ ...data, year: data.year ?? null, rating: data.rating ?? null }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const dto: BookDTO = await response.json();
  return mapFromServer(dto);
}

export async function deleteBook(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}
