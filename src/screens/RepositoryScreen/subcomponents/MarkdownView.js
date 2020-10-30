import React from 'react';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';

export const isUrl = str => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');
  return Boolean(pattern.test(str));
};

const MarkdownView = ({ content }) =>
  <View testID='Markdown'>
    <Markdown onLinkPress={isUrl}>{content}</Markdown>
  </View>;

export default MarkdownView;
