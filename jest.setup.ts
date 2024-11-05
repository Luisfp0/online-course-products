import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: React.ComponentProps<'img'>) {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return React.createElement('img', { ...props });
  },
}))