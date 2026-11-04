import type { SVGProps } from 'react';

/* The AK monogram as a vector, traced from public/logo/black.png (43KB as a
   PNG, about 1KB as a path). It takes currentColor, so it sits in ink on both
   themes and can turn electric blue with no second asset. Used where weight
   matters: /live/ and stream mode. The nav keeps its PNG. */

const PATH =
  'M38.3 98.7C31.6 88.0 27.5 73.6 26.9 58.8L26.8 55.8L19.6 59.6L12.3 63.3L12.3 73.0L12.3 82.7L10.4 80.3C5.7 74.3 2.1 69.1 0.8 66.5L0.1 65.1L0.0 57.4L-0.0 49.7L6.1 45.4L12.3 41.1L12.3 45.4L12.4 49.7L19.6 45.4L26.9 41.2L26.9 31.6C26.9 24.0 26.8 22.0 26.7 22.1C26.6 22.2 20.6 26.2 13.4 31.0C6.2 35.8 0.2 39.8 0.1 39.8C0.0 39.9 0.6 38.6 1.4 37.1C6.3 27.2 11.7 20.1 16.7 16.8C17.6 16.3 26.5 10.9 37.9 4.0C41.0 2.1 43.7 0.4 44.0 0.3C44.5 -0.1 44.0 -0.3 49.6 3.0C52.2 4.6 56.1 7.0 58.2 8.3L62.2 10.7L62.2 25.8L62.2 40.9L70.3 37.3L78.4 33.6L78.4 24.4C78.4 19.3 78.5 15.2 78.5 15.2C79.3 15.2 82.3 19.0 86.8 25.7L89.1 29.1L89.0 34.9L89.0 40.8L82.6 44.6C79.1 46.6 75.6 48.6 74.9 49.0C73.8 49.6 73.7 49.7 74.0 49.9C74.1 50.0 77.6 51.9 81.6 54.1L89.0 58.1L89.0 62.1C89.1 66.5 88.9 68.4 88.0 71.6C86.5 77.1 83.0 83.3 79.0 87.6L77.9 88.8L77.8 82.3C77.7 78.8 77.7 73.9 77.7 71.4C77.7 69.0 77.6 66.3 77.6 65.5L77.5 64.0L70.0 59.5C65.8 57.0 62.4 54.9 62.3 54.9C62.3 54.9 62.2 56.4 62.1 58.2C61.8 68.9 59.9 78.5 56.1 88.2C55.0 90.9 52.1 96.6 50.9 98.5L49.9 100.1L49.8 58.6L49.8 17.1L47.3 15.0C45.9 13.8 44.6 12.9 44.6 12.9C44.5 12.8 43.3 13.8 41.8 14.9L39.2 17.1L39.2 58.6L39.1 100.1L38.3 98.7Z';

export function AkMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 89.1 100.0" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path fillRule="evenodd" d={PATH} />
    </svg>
  );
}
