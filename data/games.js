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
    rating: 0,
    steamAppId: 2322010,
    ...STEAM_CDN(2322010),
    dataSourceUrl:
      "https://raw.githubusercontent.com/luffytaroOnePiece/God-of-War-Ragnarok/main/dataSource.json",
    imageBaseUrl:
      "https://raw.githubusercontent.com/luffytaroOnePiece/God-of-War-Ragnarok/main/",
    accentColor: "#c0392b",
    accentGlow: "rgba(192, 57, 43, 0.45)",
    description:
      "From Santa Monica Studio comes the sequel to the critically acclaimed God of War (2018). Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world. Along the way they will explore stunning, mythical landscapes, and face fearsome enemies in the form of Norse gods and monsters. The threat of Ragnarök grows ever closer. Kratos and Atreus must choose between their own safety and the safety of the realms.",
    tags: [
      "Action-Adventure",
      "Norse Mythology",
      "Story-Driven",
      "Melee Combat",
      "Exploration",
    ],
  },
  {
    id: "last-of-us-part-1",
    title: "The Last of Us Part I",
    subtitle: "Naughty Dog · 2022",
    platform: "PS5",
    genre: "Survival Horror",
    status: "completed",
    progress: 100,
    rating: 9,
    steamAppId: 1888930,
    ...STEAM_CDN(1888930),
    dataSourceUrl: null,
    imageBaseUrl: null,
    accentColor: "#27ae60",
    accentGlow: "rgba(39, 174, 96, 0.45)",
    description:
      "In a ravaged civilisation, where infected and hardened survivors run rampant, Joel, a weary protagonist, is hired to smuggle 14-year-old Ellie out of a military quarantine zone. However, what starts as a small job soon transforms into a brutal cross-country journey.",
    tags: [
      "Action-Adventure",
      "Survival",
      "Story Rich",
      "Post-Apocalyptic",
      "Stealth",
    ],
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    subtitle: "FromSoftware · 2022",
    platform: "PS5",
    genre: "Soulslike - Action RPG",
    status: "playing",
    progress: 50,
    rating: 10,
    steamAppId: 1245620,
    ...STEAM_CDN(1245620),
    dataSourceUrl: null,
    imageBaseUrl: null,
    accentColor: "#8e44ad",
    accentGlow: "rgba(142, 68, 173, 0.45)",
    description:
      "In the Lands Between ruled by Queen Marika the Eternal, the Elden Ring, the source of the Erdtree, has been shattered. Marika's offspring, demigods all, claimed the shards of the Elden Ring known as the Great Runes, and the mad taint of their newfound strength triggered a war: The Shattering. A war that meant abandonment by the Greater Will. And now the guidance of grace will be brought to the Tarnished who were spurned by the grace of gold and exiled from the Lands Between. Ye dead who yet live, your grace long lost, follow the path to the Lands Between beyond the foggy sea to stand before the Elden Ring. And become the Elden Lord.",
    tags: ["Open World", "Action RPG", "Soulslike", "Dark Fantasy"],
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima",
    subtitle: "Sucker Punch Productions · 2020",
    platform: "PS5",
    genre: "Action-Adventure",
    status: "completed",
    progress: 100,
    rating: 9,
    steamAppId: 2215430,
    ...STEAM_CDN(2215430),
    dataSourceUrl: null,
    imageBaseUrl: null,
    accentColor: "#d35400",
    accentGlow: "rgba(211, 84, 0, 0.45)",
    description:
      "In the late 13th century, the Mongol Empire invades the island of Tsushima. As one of the last surviving samurai, Jin Sakai must set aside his traditional training and forge a new path to become the Ghost and fight back to save his home.",
    tags: [
      "Action-Adventure",
      "Open World",
      "Samurai",
      "Stealth",
      "Story Rich",
    ],
  },
];
