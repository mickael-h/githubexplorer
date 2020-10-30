describe('Do a search', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('should only see bookmarked repositories in bookmarks', async () => {
    const input = element(by.id('SearchInput'));
    await expect(input).toBeVisible();
    input.replaceText('flutter/flutter');

    const listItem = element(by.id('RepoItem:flutter/flutter'));
    await waitFor(listItem).toExist().withTimeout(1100);

    let bookmarkButton = element(
      by.id('BookmarkButton').withAncestor(
        by.id('RepoItem:flutter/flutter')
      )
    );
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.tap();

    const filterBookmarkButtons = element(by.id('FloatingButton'));
    await expect(filterBookmarkButtons).toBeVisible();
    await filterBookmarkButtons.tap();

    bookmarkButton = element(
      by.id('BookmarkButton').withAncestor(
        by.id('RepoItem:flutter/flutter')
      )
    );
    await expect(bookmarkButton).toBeVisible();
    await bookmarkButton.tap();

    await expect(element(by.id('RepoItem:flutter/flutter'))).toBeNotVisible();
  });
});
