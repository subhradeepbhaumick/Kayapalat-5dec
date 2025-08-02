// File: src/types/react-masonry-css.d.ts

declare module 'react-masonry-css' {
    import * as React from 'react';
  
    interface MasonryProps extends React.HTMLAttributes<HTMLElement> {
      breakpointCols: { [key: number]: number } | number;
      columnClassName?: string;
    }
  
    const Masonry: React.FC<MasonryProps>;
    export default Masonry;
  }