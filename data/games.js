/**
 * Central game configuration for the Gaming Tracker.
 * Images are fetched on demand from Steam's CDN — no local assets needed.
 *
 * Steam CDN pattern:
 *   Cover  (portrait 600×900): https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appId}/library_600x900_2x.jpg
 *   Banner (landscape hero):   https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{appId}/library_hero.jpg
 */

const STEAM_CDN = (appId) => ({
  coverArt: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`,
  bannerArt: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appId}/library_hero.jpg`,
});

const GAMES = [
  {
    id: "god-of-war-ragnarok",
    title: "God of War Ragnarök",
    subtitle: "Santa Monica Studio · 2022",
    platform: "PS5",
    genre: "Action-Adventure",
    status: "playing",
    progress: 30,
    chaptersTotal: 9,
    chaptersCompleted: 3,
    rating: 0,
    steamAppId: 2322010,
    ...STEAM_CDN(2322010),
    dataSourceUrl: "https://raw.githubusercontent.com/luffytaroOnePiece/God-of-War-Ragnarok/main/dataSource.json",
    imageBaseUrl: "https://raw.githubusercontent.com/luffytaroOnePiece/God-of-War-Ragnarok/main/",
    accentColor: "#c0392b",
    accentGlow: "rgba(192, 57, 43, 0.45)",
    description: "From Santa Monica Studio comes the sequel to the critically acclaimed God of War (2018). Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world. Along the way they will explore stunning, mythical landscapes, and face fearsome enemies in the form of Norse gods and monsters. The threat of Ragnarök grows ever closer. Kratos and Atreus must choose between their own safety and the safety of the realms.",
    tags: [
      "Action-Adventure",
      "Norse Mythology",
      "Story-Driven",
      "Melee Combat",
      "Exploration"
    ]
  },
  {
    id: "last-of-us-part-1",
    title: "The Last of Us Part I",
    subtitle: "Naughty Dog · 2022",
    platform: "PS5",
    genre: "Survival Horror",
    status: "completed",
    progress: 100,
    chaptersTotal: 12,
    chaptersCompleted: 12,
    rating: 9,
    steamAppId: 1888930,
    ...STEAM_CDN(1888930),
    dataSourceUrl: null,
    imageBaseUrl: null,
    accentColor: "#27ae60",
    accentGlow: "rgba(39, 174, 96, 0.45)",
    description: "In a ravaged civilisation, where infected and hardened survivors run rampant, Joel, a weary protagonist, is hired to smuggle 14-year-old Ellie out of a military quarantine zone. However, what starts as a small job soon transforms into a brutal cross-country journey.",
    tags: [
      "Action-Adventure",
      "Survival",
      "Story Rich",
      "Post-Apocalyptic",
      "Stealth",
    ]
  }
];
