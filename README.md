# Github Explorer
This was fun to make. You can search for repositories, bookmark them, and check them in a preview that will display their readme file.
Search results will automatically update as you scroll through them.

When the readme is big, rendering the preview screen can take a lot of time.
This might be a good opportunity to try React's experimental concurrent mode... when it's available for React Native.

The code should be clean and self-explanatory. Classes, functions, and lines are kept short to ensure legibility.
I use SonarLint to ensure code consistency and cleanliness.

I'm usually not a big fan of Redux (I prefer MobX State Tree), but at least Redux has the advantage of being very easy to test.
I used React Native Navigation, which is definitely better for performance, but made testing navigation a little bit harder.

## Screenshots
![Screenshot1](https://i.imgur.com/hiV4Uxo.png "Screenshot 1")
![Screenshot2](https://i.imgur.com/yYwZqgE.png "Screenshot 2")
![Screenshot3](https://i.imgur.com/oUJQau4.png "Screenshot 3")
![Screenshot4](https://i.imgur.com/4FoML22.png "Screenshot 4")

## Unit / integration tests results
A good app is a well-tested app :)
![Test Results](https://i.imgur.com/8uegaPn.png "All clear!")
![Satisfaction](https://i.imgur.com/cLLOVbb.png "Feels good")

## End-to-end tests
I'm used to Appium for e2e testing but Detox seems to be pretty much the same thing.
I added 2 Detox scenarios :
- 1 that checks adding and removing bookmarks.
- 1 that checks searching for a repository, scrolling through search results, and previewing a repository.

## Features ideas (for later)
- AsyncStorage to keep bookmarks :heavy_check_mark:
- Localization
- Sharing to contacts
- Add more information to the preview screen top card
- Tabs on the preview screen to also see pull requests and issues
- A scrollToTop button
- Login to Github -> star repos, check private repos, create issues, etc.
- pullToRefresh on lists

## Other things to do
- Optimize rendering :heavy_check_mark:
- Fixing testing the RNShare wrapper :heavy_check_mark:
- Split the store's tests into several files :heavy_check_mark:
- Figure out why the SearchView makes a weird "act" warning in Jest
- Optimize rendering even more (still running slow on lower end devices)
