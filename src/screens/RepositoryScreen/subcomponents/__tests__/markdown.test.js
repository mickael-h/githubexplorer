import { render } from '@testing-library/react-native';
import MarkdownView, { isUrl } from '../MarkdownView';
import React from 'react';

describe('MardownView tests', () => {
  test('renders', () => {
    const { queryByTestId } = render(
      <MarkdownView content={'# some title \n## some subtitle'} />
    );
    expect(queryByTestId('Markdown')).not.toBeNull();
  });

  test('isUrl works', () => {
    expect(isUrl('http://example.com?arg1=1&arg2=2')).toBe(true);
    expect(isUrl('#sectionlink')).toBe(false);
  });
});
