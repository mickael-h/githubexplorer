import Share from 'react-native-share';
import { Platform } from 'react-native';

const share = repoHttp => {
  const title = 'Github Repository';
  const message = 'Please check this out:';
  const options = Platform.select({
    ios: {
      activityItemSources: [
        {
          placeholderItem: { type: 'url', content: repoHttp },
          item: {
            default: { type: 'url', content: repoHttp },
          },
          subject: {
            default: title,
          },
          linkMetadata: { originalUrl: repoHttp, url: repoHttp, title },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${message}\n${repoHttp}`,
    },
  });

  Share.open(options)
    .catch(e => { });
};

export default share;
