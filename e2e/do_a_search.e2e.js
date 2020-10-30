describe('Do a search', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('should see preview screen', async () => {
    const input = element(by.id('SearchInput'));
    await expect(input).toBeVisible();
    input.replaceText('mickael-h/colorpicker');

    const listItem = element(by.id('RepoItem:mickael-h/colorpicker'));
    await waitFor(listItem).toExist().withTimeout(1100);
    await listItem.tap();

    const repoScreen = element(by.id('RepositoryScreen'));
    await waitFor(repoScreen).toExist().withTimeout(1100);
  });

  test('should see new results when scrolling', async () => {
    await expect(element(by.id('SearchView'))).toBeVisible();
    await waitFor(element(by.id('RepoItem:torvalds/linux'))).toBeVisible()
      .whileElement(by.id('RepositoryList')).scroll(1000, 'down');
  });
});
