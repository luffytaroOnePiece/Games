# 🎮 GameVault

A modern, glossy personal gaming tracker — deployed on **GitHub Pages**.

## Features
- 🎭 Game cards with Steam banner + portrait cover art fetched live from Steam CDN
- 📸 Screenshot gallery with chapter-based accordion viewer
- 🔍 Full-screen lightbox with keyboard & swipe navigation
- 📊 Progress tracking per game
- 🔗 Filter by status: Playing · Completed · Wishlist · Paused
- ✈️ Zero dependencies — pure HTML, CSS, JavaScript

## Games Tracked
| Game | Status | Platform |
|---|---|---|
| God of War Ragnarök | 🟡 Playing | PS5 |
| The Last of Us Part I | 🟣 Wishlist | PS5 |

## Adding a New Game
Edit [`data/games.js`](data/games.js) and add an entry to the `GAMES` array:
```js
{
  id: "my-game",
  title: "My Game",
  steamAppId: 12345,           // Steam App ID for cover/banner art
  ...STEAM_CDN(12345),         // auto-generates coverArt + bannerArt URLs
  dataSourceUrl: null,         // URL to a dataSource.json, or null
  status: "wishlist",          // playing | completed | wishlist | paused
  progress: 0,
  ...
}
```

## Deployment
Automatically deployed to GitHub Pages via **GitHub Actions** on every push to `main`.

Go to **Settings → Pages → Source → GitHub Actions** to enable.

---
Built with ❤️ by [luffytaroOnePiece](https://github.com/luffytaroOnePiece)
