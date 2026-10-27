import type { RoomSlug } from './product';

export interface Review {
  id: string;
  /** `null` for showroom-level reviews not tied to a product. */
  product_id: string | null;
  author: string;
  city: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  room: RoomSlug | null;
  photo: string | null;
  /** All bundled reviews are demonstration content and are labelled as such. */
  is_demo: boolean;
}
