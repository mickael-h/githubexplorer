# Github Explorer
This was fun to make. You can search for repositories, bookmark them, and check them in a preview that will display their readme file.
Search results will automatically update as you scroll through them.

When the readme is big, rendering the preview screen can take a lot of time.
This might be a good opportunity to try React's experimental concurrent mode.

The code should be clean and self-explanatory. Classes, functions, and lines are kept short to ensure legibility.
I use SonarLint to ensure code consistency and cleanliness.

I'm usually not a big fan of Redux (I prefer MobX State Tree), but at least Redux has the advantage of being very easy to test.
I used React Native Navigation, which is definitely better for performance, but made testing navigation a little bit harder.

## Unit / integration tests results
A good app is a well-tested app :)
Not everything is represented in there though: I had to mock my entire Share wrapper to avoid some problems where it's used.
The Share module uses NativeModules in static variables, so the simple fact of importing it in Jest will result in a crash, even if you mock it...
![Test Results](https://i.imgur.com/cOqFIEc.png "All clear!")
![Satisfaction](https://i.imgur.com/cLLOVbb.png "Feels good")

## End-to-end tests
I'm used to Appium for e2e testing but Detox seems to be pretty much the same thing.
I added 2 Detox scenarios :
- 1 that checks adding and removing bookmarks.
- 1 that checks searching for a repository, scrolling through search results, and previewing a repository.

## Features ideas (for later)
- AsyncStorage to keep bookmarks
- Localization
- Sharing to contacts
- Add more information to the preview screen top card
- Tabs on the preview screen to also see pull requests and issues
- A scrollToTop button
- Login to Github -> star repos, check private repos, create issues, etc.
- pullToRefresh on lists

## Other things to do
- Optimize rendering
- Split the store's tests into several files
- Figure out why the SearchView makes a weird "act" warning in Jest
