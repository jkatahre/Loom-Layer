import type { Review } from '../types/review';

/**
 * DEMONSTRATION REVIEWS — written to show the layout. They are not real
 * customer reviews and are labelled "Demo review" in the UI. Replace them with
 * genuine, verifiable reviews before launch.
 */
const r = (
  id: string,
  product_id: string | null,
  author: string,
  city: string,
  rating: Review['rating'],
  title: string,
  body: string,
  date: string,
  room: Review['room'] = null,
  photo: string | null = null,
): Review => ({ id, product_id, author, city, rating, title, body, date, room, photo, is_demo: true });

export const reviews: Review[] = [
  r('r-01', 'p-001', 'Ananya R.', 'Your City', 5, 'Exactly the soft light we wanted', 'The sandstone sheer filters the afternoon sun beautifully. Eyelets slide smoothly and the length was spot on.', '2026-09-12', 'living-room', '/images/rooms/project-1.webp'),
  r('r-02', 'p-001', 'Karthik M.', 'Town A', 4, 'Lovely texture', 'Feels like real linen. Creases a little after washing but steam fixes it quickly.', '2026-08-30', 'bedroom'),
  r('r-03', 'p-002', 'Meera & Vikram', 'Your City', 5, 'Finally sleeping past sunrise', 'Our bedroom faces east and these block almost everything. The navy looks rich, not flat.', '2026-09-20', 'bedroom', '/images/rooms/project-2.webp'),
  r('r-04', 'p-002', 'Farah K.', 'Town B', 5, 'Great for the kids room', 'Ordered two pairs in stone. Even the light colour darkens the room properly.', '2026-07-18', 'kids-room'),
  r('r-05', 'p-002', 'Rohit P.', 'Your City', 4, 'Solid blackout', 'Very good blackout. A little light comes in at the sides, so we added a wraparound rod.', '2026-06-25', 'bedroom'),
  r('r-06', 'p-003', 'Sneha D.', 'Your City', 5, 'Texture looks premium', 'The basket weave gives the living room so much warmth. Light still comes through softly.', '2026-08-14', 'living-room'),
  r('r-07', 'p-004', 'Lakshmi N.', 'Town A', 5, 'Prettier in person', 'The sage print is delicate and the cotton feels soft. We added cotton lining and it hangs well.', '2026-09-03', 'bedroom'),
  r('r-08', 'p-005', 'Arjun & Tara', 'Your City', 5, 'The room feels finished', 'Olive velvet with pinch pleats in our dining room — guests always ask about them. Fitting team was careful and quick.', '2026-10-01', 'dining-room', '/images/rooms/project-3.webp'),
  r('r-09', 'p-005', 'Deepa V.', 'Town B', 4, 'Heavy and luxurious', 'Beautiful velvet. Needs a sturdy rod — the team recommended one and installed it.', '2026-09-17', 'living-room'),
  r('r-10', 'p-006', 'Imran S.', 'Your City', 5, 'Room is noticeably cooler', 'West-facing bedroom used to be very hot in the evening. These help a lot and block light too.', '2026-05-29', 'bedroom'),
  r('r-11', 'p-007', 'Nikhil J.', 'Your City', 5, 'Custom fit, great estimate', 'The online estimate was within a few hundred rupees of the final quote. The stripe makes the study feel taller.', '2026-10-10', 'home-office', '/images/rooms/project-5.webp'),
  r('r-12', 'p-008', 'Priyanka G.', 'Town A', 4, 'Statement curtains', 'The gold jacquard shimmers at night. Took a couple of extra days for stitching but worth it.', '2026-09-25', 'living-room'),
  r('r-13', 'p-009', 'Sunita B.', 'Your City', 5, 'Simple and good value', 'Bought four pairs for the whole flat. Washes easily and looks fresh.', '2026-04-11', 'living-room'),
  r('r-14', 'p-012', 'Aditi & Rahul', 'Your City', 5, 'Nap time saviour', 'Our toddler sleeps so much better. The stars are cute without being too busy.', '2026-07-30', 'kids-room', '/images/rooms/project-4.webp'),
  r('r-15', 'p-014', 'Gopal R.', 'Town B', 4, 'Cheerful kitchen', 'Nice gingham, fits our small kitchen window perfectly.', '2026-03-09', 'kitchen'),
  r('r-16', 'p-016', 'Kavya H.', 'Your City', 5, 'Real hand-block print', 'You can see the craft in the print. The terracotta goes beautifully with our wooden furniture.', '2026-09-28', 'living-room'),
  r('r-17', 'p-021', 'Pooja T.', 'Town A', 5, 'Everyday favourite', 'Soft, washable and the dusty rose is so calming.', '2026-06-08', 'bedroom'),
  r('r-18', 'p-022', 'Hotel manager', 'Town A', 5, 'Reliable for our rooms', 'We fitted twelve rooms. Guests mention how dark and cool the rooms are.', '2026-09-30', 'hospitality', '/images/rooms/project-6.webp'),
  r('r-19', 'p-027', 'Isha M.', 'Your City', 5, 'Worth every rupee', 'The linen drapes are stunning, and the team helped us choose the right fullness for our tall windows.', '2026-10-14', 'living-room'),
  r('r-20', 'p-033', 'Vivek & Anu', 'Your City', 5, 'Smooth custom process', 'Measurement visit, quote on WhatsApp, installation — everything happened as promised.', '2026-10-18', 'living-room'),
  r('r-21', 'p-036', 'Sameer A.', 'Town B', 4, 'Tailored and dark', 'Pinch pleats look very neat. Delivery took a day longer than expected.', '2026-08-22', 'bedroom'),
  r('r-22', 'p-039', 'Neha L.', 'Your City', 5, 'Warm, earthy colour', 'Rust slub looks lovely against white walls. Good weight for unlined cotton.', '2026-09-06', 'living-room'),
  r('r-23', null, 'Ritu K.', 'Your City', 5, 'Helpful showroom', 'Spent an hour comparing swatches with no pressure. They lent us samples to try at home.', '2026-10-05'),
  r('r-24', null, 'Manoj S.', 'Town A', 5, 'Clear pricing', 'Every quote was itemised — fabric, stitching, lining. No surprises at the end.', '2026-09-15'),
];
