/* Real Spotify tracklists (scraped from Spotify's own embed pages) +
   real 30-second preview audio matched per track (iTunes Search API)
   + a YouTube search link per track. Baked in at build time. */
export interface SpotifyTrack {
  id: number;
  title: string;
  artist: string;
  album: string;
  art: string;
  preview: string;
  yt: string;
  seconds: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  cover: string;
  spotifyUrl: string;
  blurb: string;
  tracks: SpotifyTrack[];
}

export const spotifyPlaylists: SpotifyPlaylist[] = [
  {
    "id": "3HZvV6TpUavxQUA3IvyFa5",
    "name": "Metro Goonin'",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
    "spotifyUrl": "https://open.spotify.com/playlist/3HZvV6TpUavxQUA3IvyFa5",
    "blurb": "Metro Goonin'. The real tracklist, all in one playlist. In-app playback streams 30-second previews where available; every track also links to YouTube.",
    "tracks": [
      {
        "id": 1,
        "title": "Super Cell",
        "artist": "Trippie Redd",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f5/b1/06/f5b1063d-5d21-245f-e196-698e3d708ddb/842812156427.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/25/a8/04/25a804c2-705f-c94e-9f91-94e804c06641/mzaf_7946660476711170814.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Super%20Cell%20Trippie%20Redd",
        "seconds": 161
      },
      {
        "id": 2,
        "title": "Love Blur",
        "artist": "slayr",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Love%20Blur%20slayr",
        "seconds": 154
      },
      {
        "id": 3,
        "title": "Uzi Work",
        "artist": "Homixide Gang",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Uzi%20Work%20Homixide%20Gang",
        "seconds": 105
      },
      {
        "id": 4,
        "title": "INDIA",
        "artist": "Lancey Foux",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=INDIA%20Lancey%20Foux",
        "seconds": 109
      },
      {
        "id": 5,
        "title": "Respect",
        "artist": "FORBE$",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Respect%20FORBE%24",
        "seconds": 218
      },
      {
        "id": 6,
        "title": "Say",
        "artist": "keshi",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a6/a3/20/a6a32054-f43f-12b3-4019-1f201b6c56b2/24UMGIM70300.rgb.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/39/14/d5/3914d59f-1152-cf4f-3a8f-f96280fd47af/mzaf_4561919059289260910.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Say%20keshi",
        "seconds": 181
      },
      {
        "id": 7,
        "title": "PIXELATED KISSES",
        "artist": "Joji",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=PIXELATED%20KISSES%20Joji",
        "seconds": 110
      },
      {
        "id": 8,
        "title": "CALLS",
        "artist": "waera, trisss",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=CALLS%20waera%2C%20trisss",
        "seconds": 131
      },
      {
        "id": 9,
        "title": "Borrowed Love (feat. Swae Lee & WizKid)",
        "artist": "Metro Boomin, Swae Lee, Wizkid",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Borrowed%20Love%20%28feat.%20Swae%20Lee%20%26%20WizKid%29%20Metro%20Boomin%2C%20Swae%20Lee%2C%20Wizkid",
        "seconds": 230
      },
      {
        "id": 10,
        "title": "One More Time / Aerodynamic",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/15/5f/b7155f62-f93a-2fe7-d98d-cc19240b4bd0/5099951165857_1500x1500_300dpi.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/c7/bd/8ec7bd21-518c-75f6-94ca-aee568eada67/mzaf_3889652290707361174.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=One%20More%20Time%20/%20Aerodynamic%20Daft%20Punk",
        "seconds": 370
      },
      {
        "id": 11,
        "title": "either on or off the drugs",
        "artist": "JPEGMAFIA",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=either%20on%20or%20off%20the%20drugs%20JPEGMAFIA",
        "seconds": 140
      },
      {
        "id": 12,
        "title": "Giorgio by Moroder",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/06/62/df066260-84b2-afd6-8ac2-42ce1db00900/mzaf_7704112998481229652.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Giorgio%20by%20Moroder%20Daft%20Punk",
        "seconds": 544
      },
      {
        "id": 13,
        "title": "Amped",
        "artist": "Lil Uzi Vert",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Amped%20Lil%20Uzi%20Vert",
        "seconds": 173
      },
      {
        "id": 14,
        "title": "Save Me The Trouble",
        "artist": "Dan + Shay",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a5/8a/a7/a58aa7ac-53a7-e014-2563-36132e2b9ba9/093624852001.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9c/ac/85/9cac852c-58fb-4cb8-52a2-eb0a91a971ea/mzaf_2515902834184160596.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Save%20Me%20The%20Trouble%20Dan%20%2B%20Shay",
        "seconds": 200
      },
      {
        "id": 15,
        "title": "this is what heartbreak feels like",
        "artist": "JVKE",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/0a/02/7f/0a027f39-2abe-432a-e5d6-bfe6635ba254/5056167171577_1.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/04/f7/34/04f73400-6ffb-de14-bd05-59044df265c2/mzaf_12365859698983843194.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=this%20is%20what%20heartbreak%20feels%20like%20JVKE",
        "seconds": 157
      },
      {
        "id": 16,
        "title": "Bad and Boujee (feat. Lil Uzi Vert)",
        "artist": "Migos, Lil Uzi Vert",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Bad%20and%20Boujee%20%28feat.%20Lil%20Uzi%20Vert%29%20Migos%2C%20Lil%20Uzi%20Vert",
        "seconds": 343
      },
      {
        "id": 17,
        "title": "Burning Down (with Joe Jonas)",
        "artist": "Alex Warren, Joe Jonas",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fe/12/d1/fe12d189-6621-9ebe-f713-8a775b8e9896/075679624246.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/14/00/ae/1400aed8-8acb-6f14-5911-ef01d65ee8a8/mzaf_63174026242060599.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Burning%20Down%20%28with%20Joe%20Jonas%29%20Alex%20Warren%2C%20Joe%20Jonas",
        "seconds": 179
      },
      {
        "id": 18,
        "title": "The Housebuilding Song",
        "artist": "David Ferguson",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/6d/af/5a/6daf5a9d-a482-f83b-33e6-b493f1e58a16/780163573121.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a6/e4/5c/a6e45c2e-0aa3-0b9d-1040-8b74fceaa10c/mzaf_11456657794595636829.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=The%20Housebuilding%20Song%20David%20Ferguson",
        "seconds": 191
      },
      {
        "id": 19,
        "title": "FOREVER AGAIN",
        "artist": "Yeat",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ba/fd/e3/bafde3ca-baf0-8f9f-9c74-6b63f16db7a5/24UM1IM01097.rgb.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/92/08/4e9208af-200a-3162-c8be-0b5147230cc4/mzaf_4896179232991172244.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=FOREVER%20AGAIN%20Yeat",
        "seconds": 199
      },
      {
        "id": 20,
        "title": "SMUCKERS (feat. Lil Wayne & Kanye West)",
        "artist": "Tyler, The Creator, Lil Wayne, Kanye West",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=SMUCKERS%20%28feat.%20Lil%20Wayne%20%26%20Kanye%20West%29%20Tyler%2C%20The%20Creator%2C%20Lil%20Wayne%2C%20Kanye%20West",
        "seconds": 334
      },
      {
        "id": 21,
        "title": "Come & Get Me",
        "artist": "JPEGMAFIA",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Come%20%26%20Get%20Me%20JPEGMAFIA",
        "seconds": 165
      },
      {
        "id": 22,
        "title": "Young, Wild & Free (feat. Bruno Mars)",
        "artist": "Snoop Dogg, Wiz Khalifa, Bruno Mars",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b1/cc/48/b1cc4833-4fcc-7c21-2c31-25c7bd18daa1/mzi.rviprhvj.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2c/7a/88/2c7a88bf-bf3e-63b9-e980-1883d1a80c82/mzaf_5289868688628964358.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Young%2C%20Wild%20%26%20Free%20%28feat.%20Bruno%20Mars%29%20Snoop%20Dogg%2C%20Wiz%20Khalifa%2C%20Bruno%20Mars",
        "seconds": 207
      },
      {
        "id": 23,
        "title": "Drankin N Smokin",
        "artist": "Future, Lil Uzi Vert",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/fd/c0/34fdc05a-44cd-f3bb-36d0-0e9594002b31/075679797087.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/18/0d/db/180ddbf2-fff2-c408-457c-8d1c1a2e8eb5/mzaf_16764342985485972557.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Drankin%20N%20Smokin%20Future%2C%20Lil%20Uzi%20Vert",
        "seconds": 213
      },
      {
        "id": 24,
        "title": "On My Own",
        "artist": "Darci",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/46/66/ad/4666ad6e-8351-99fc-5dc3-2ed55f600ed9/15DMGIM06203.rgb.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b2/9b/df/b29bdf1e-4887-8317-7392-55003675a73c/mzaf_367965040008407189.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=On%20My%20Own%20Darci",
        "seconds": 171
      },
      {
        "id": 25,
        "title": "Potion (with Dua Lipa & Young Thug)",
        "artist": "Calvin Harris, Dua Lipa, Young Thug",
        "album": "",
        "art": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84ca3b540717dfd23f6cb8539f",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Potion%20%28with%20Dua%20Lipa%20%26%20Young%20Thug%29%20Calvin%20Harris%2C%20Dua%20Lipa%2C%20Young%20Thug",
        "seconds": 215
      }
    ]
  },
  {
    "id": "37i9dQZF1DZ06evO25rXbO",
    "name": "This Is Gorillaz",
    "cover": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
    "spotifyUrl": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO25rXbO",
    "blurb": "This Is Gorillaz. The real tracklist, all in one playlist. In-app playback streams 30-second previews where available; every track also links to YouTube.",
    "tracks": [
      {
        "id": 1001,
        "title": "Feel Good Inc.",
        "artist": "Gorillaz, De La Soul",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9a/a7/90/9aa790e3-651e-9674-26ac-14aba4d3b8d1/mzaf_10454527198707970464.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Feel%20Good%20Inc.%20Gorillaz%2C%20De%20La%20Soul",
        "seconds": 222
      },
      {
        "id": 1002,
        "title": "Clint Eastwood",
        "artist": "Gorillaz, Del The Funky Homosapien",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/8d/47/5b8d47da-71ea-93ab-dffc-733f11332659/825646290703.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/58/50/bc/5850bccc-b73f-f299-43d6-036da768b62c/mzaf_5837960104957576290.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Clint%20Eastwood%20Gorillaz%2C%20Del%20The%20Funky%20Homosapien",
        "seconds": 340
      },
      {
        "id": 1003,
        "title": "On Melancholy Hill",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/b8/f9/b9/b8f9b9f8-a609-bde2-0302-349436ffc508/825646291038.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/87/f2/8387f25a-10a5-555b-e92e-fdb847a8d4f3/mzaf_10224209639070324902.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=On%20Melancholy%20Hill%20Gorillaz",
        "seconds": 233
      },
      {
        "id": 1004,
        "title": "New Gold (feat. Tame Impala and Bootie Brown)",
        "artist": "Gorillaz, Tame Impala, Bootie Brown",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=New%20Gold%20%28feat.%20Tame%20Impala%20and%20Bootie%20Brown%29%20Gorillaz%2C%20Tame%20Impala%2C%20Bootie%20Brown",
        "seconds": 215
      },
      {
        "id": 1005,
        "title": "DARE (feat. Shaun Ryder & Roses Gabor)",
        "artist": "Gorillaz, Shaun Ryder, Roses Gabor",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/d5/99/e3d599a6-15c9-113d-65a1-f637c22de0e0/mzaf_11995878542823587618.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=DARE%20%28feat.%20Shaun%20Ryder%20%26%20Roses%20Gabor%29%20Gorillaz%2C%20Shaun%20Ryder%2C%20Roses%20Gabor",
        "seconds": 244
      },
      {
        "id": 1006,
        "title": "She's My Collar (feat. Kali Uchis)",
        "artist": "Gorillaz, Kali Uchis",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ad/f6/74/adf6743c-1aa7-c254-a503-b4d343be2d03/190295824822.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/79/49/e5/7949e5a5-14c4-2d8f-981e-f3640d511d42/mzaf_8609887615687365181.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=She%27s%20My%20Collar%20%28feat.%20Kali%20Uchis%29%20Gorillaz%2C%20Kali%20Uchis",
        "seconds": 209
      },
      {
        "id": 1007,
        "title": "Rhinestone Eyes",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/b8/f9/b9/b8f9b9f8-a609-bde2-0302-349436ffc508/825646291038.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a6/65/1a/a6651a37-68b2-8a03-9897-36f198c817ca/mzaf_2234845319721050972.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Rhinestone%20Eyes%20Gorillaz",
        "seconds": 200
      },
      {
        "id": 1008,
        "title": "Tormenta (feat. Bad Bunny)",
        "artist": "Gorillaz, Bad Bunny",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Tormenta%20%28feat.%20Bad%20Bunny%29%20Gorillaz%2C%20Bad%20Bunny",
        "seconds": 193
      },
      {
        "id": 1009,
        "title": "Dirty Harry (feat. Bootie Brown)",
        "artist": "Gorillaz, Bootie Brown",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/41/64/984164c9-72b6-b4f7-a668-dff684d73e3e/mzaf_15845482980303545922.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Dirty%20Harry%20%28feat.%20Bootie%20Brown%29%20Gorillaz%2C%20Bootie%20Brown",
        "seconds": 230
      },
      {
        "id": 1010,
        "title": "Orange County (feat. Bizarrap, Kara Jackson and Anoushka Shankar)",
        "artist": "Gorillaz, Bizarrap, Kara Jackson, Anoushka Shankar",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Orange%20County%20%28feat.%20Bizarrap%2C%20Kara%20Jackson%20and%20Anoushka%20Shankar%29%20Gorillaz%2C%20Bizarrap%2C%20Kara%20Jackson%2C%20Anoushka%20Shankar",
        "seconds": 208
      },
      {
        "id": 1011,
        "title": "19-2000",
        "artist": "Gorillaz, Miho Hatori, Tina Weymouth",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/8d/47/5b8d47da-71ea-93ab-dffc-733f11332659/825646290703.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ee/33/13/ee3313d1-bb7a-4384-9f27-a86270448e21/mzaf_12410614931071144796.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=19-2000%20Gorillaz%2C%20Miho%20Hatori%2C%20Tina%20Weymouth",
        "seconds": 210
      },
      {
        "id": 1012,
        "title": "Tranz",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c8/a2/c0/c8a2c0cc-28e9-c0c6-f425-f6aaf13191f4/190295620660.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/b1/6c/bab16c32-defb-45d7-3a09-d641239d88de/mzaf_3754494095911199211.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Tranz%20Gorillaz",
        "seconds": 162
      },
      {
        "id": 1013,
        "title": "Kids with Guns",
        "artist": "Gorillaz, Neneh Cherry",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e9/9f/9d/e99f9dda-71a2-af7a-9e29-7f04431f81af/mzaf_746406559793355886.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Kids%20with%20Guns%20Gorillaz%2C%20Neneh%20Cherry",
        "seconds": 225
      },
      {
        "id": 1014,
        "title": "Andromeda (feat. DRAM)",
        "artist": "Gorillaz, DRAM",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ad/f6/74/adf6743c-1aa7-c254-a503-b4d343be2d03/190295824822.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ce/2a/91/ce2a918a-6d4c-08be-acc5-0d0a93dde84e/mzaf_13502171394244276114.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Andromeda%20%28feat.%20DRAM%29%20Gorillaz%2C%20DRAM",
        "seconds": 197
      },
      {
        "id": 1015,
        "title": "Empire Ants (feat. Little Dragon)",
        "artist": "Gorillaz, Little Dragon",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7e/69/1f/7e691f10-3cc1-67ec-5dc3-df3d8df68fa7/5099962829359.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d4/85/0a/d4850aca-9aa5-23e9-b8a7-b1b35de8875a/mzaf_18227983270868467976.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Empire%20Ants%20%28feat.%20Little%20Dragon%29%20Gorillaz%2C%20Little%20Dragon",
        "seconds": 283
      },
      {
        "id": 1016,
        "title": "Cracker Island (feat. Thundercat)",
        "artist": "Gorillaz, Thundercat",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b3/b9/bb/b3b9bbdf-8d38-661e-f70b-2eb5e9765bb7/5054197315893.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f3/0a/f4/f30af472-f25a-b401-c1ae-33a5853db8bf/mzaf_9662424989556603614.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Cracker%20Island%20%28feat.%20Thundercat%29%20Gorillaz%2C%20Thundercat",
        "seconds": 213
      },
      {
        "id": 1017,
        "title": "El Mañana",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/60/6b/79/606b790a-2ba4-1ed1-8387-f9bdd1702abf/mzaf_6119505887471233739.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=El%20Ma%C3%B1ana%20Gorillaz",
        "seconds": 235
      },
      {
        "id": 1018,
        "title": "DARE",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e3/d5/99/e3d599a6-15c9-113d-65a1-f637c22de0e0/mzaf_11995878542823587618.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=DARE%20Gorillaz",
        "seconds": 213
      },
      {
        "id": 1019,
        "title": "The Moon Cave (feat. Asha Puthli, Bobby Womack, Dave Jolicoeur, Jalen Ngonda and Black Thought)",
        "artist": "Gorillaz, Asha Puthli, Bobby Womack, Dave Jolicoeur, Jalen Ngonda, Black Thought",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/b2/b9/7cb2b942-8688-a6a3-8cc1-8e8639650a7d/820200336705.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4a/0f/fb/4a0ffb9f-6e98-61a7-1261-5cfc35e571f7/mzaf_12084313497888243424.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=The%20Moon%20Cave%20%28feat.%20Asha%20Puthli%2C%20Bobby%20Womack%2C%20Dave%20Jolicoeur%2C%20Jalen%20Ngonda%20and%20Black%20Thought%29%20Gorillaz%2C%20Asha%20Puthli%2C%20Bobby%20Womack%2C%20Dave%20Jolicoeur%2C%20Jalen%20Ngonda%2C%20Black%20Thought",
        "seconds": 297
      },
      {
        "id": 1020,
        "title": "Silent Running (feat. Adeleye Omotayo)",
        "artist": "Gorillaz, Adeleye Omotayo",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Silent%20Running%20%28feat.%20Adeleye%20Omotayo%29%20Gorillaz%2C%20Adeleye%20Omotayo",
        "seconds": 266
      },
      {
        "id": 1021,
        "title": "November Has Come",
        "artist": "Gorillaz, MF DOOM",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1c/0f/81/1c0f818a-e458-dd84-6f1b-ccbdf5fe14d6/825646291045.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/87/22/88/872288a2-793e-5328-6f56-11a9db3775ca/mzaf_2818317313910899360.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=November%20Has%20Come%20Gorillaz%2C%20MF%20DOOM",
        "seconds": 165
      },
      {
        "id": 1022,
        "title": "Stylo (feat. Mos Def and Bobby Womack)",
        "artist": "Gorillaz, Bobby Womack, Mos Def",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Stylo%20%28feat.%20Mos%20Def%20and%20Bobby%20Womack%29%20Gorillaz%2C%20Bobby%20Womack%2C%20Mos%20Def",
        "seconds": 270
      },
      {
        "id": 1023,
        "title": "The Happy Dictator (feat. Sparks)",
        "artist": "Gorillaz, Sparks",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/86/b5/3f/86b53fc7-cc73-c735-17fb-549fc459edca/199538459005.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/6e/d4/116ed475-b7ec-d740-f9ee-b9107b7c1252/mzaf_4737547681153266904.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=The%20Happy%20Dictator%20%28feat.%20Sparks%29%20Gorillaz%2C%20Sparks",
        "seconds": 284
      },
      {
        "id": 1024,
        "title": "Tomorrow Comes Today",
        "artist": "Gorillaz",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/8d/47/5b8d47da-71ea-93ab-dffc-733f11332659/825646290703.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3c/e1/6f/3ce16fe4-3e28-e92a-77dd-1c7e3162b3f8/mzaf_8164803939893887730.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Tomorrow%20Comes%20Today%20Gorillaz",
        "seconds": 193
      },
      {
        "id": 1025,
        "title": "Oil (feat. Stevie Nicks)",
        "artist": "Gorillaz, Stevie Nicks",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3AA28KZvwAUcZuOKwyblJQ/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Oil%20%28feat.%20Stevie%20Nicks%29%20Gorillaz%2C%20Stevie%20Nicks",
        "seconds": 230
      }
    ]
  },
  {
    "id": "37i9dQZF1DZ06evO2CNgSk",
    "name": "This Is Daft Punk",
    "cover": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
    "spotifyUrl": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO2CNgSk",
    "blurb": "This Is Daft Punk. The real tracklist, all in one playlist. In-app playback streams 30-second previews where available; every track also links to YouTube.",
    "tracks": [
      {
        "id": 2001,
        "title": "Around the World",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Around%20the%20World%20Daft%20Punk",
        "seconds": 429
      },
      {
        "id": 2002,
        "title": "Da Funk",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/34/8d/c7/348dc71c-d75e-9baf-671a-994e9e74b018/dj.pimdxdmf.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a9/08/49/a9084936-30a1-7d97-cd3b-19f538e69652/mzaf_6633951522360529909.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Da%20Funk%20Daft%20Punk",
        "seconds": 328
      },
      {
        "id": 2003,
        "title": "One More Time",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=One%20More%20Time%20Daft%20Punk",
        "seconds": 320
      },
      {
        "id": 2004,
        "title": "Get Lucky (Radio Edit) [feat. Pharrell Williams and Nile Rodgers]",
        "artist": "Daft Punk, Pharrell Williams, Nile Rodgers",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c8/6d/11/c86d1183-9e36-fc2f-6490-80568ed056e0/196871342049.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/33/59/4e33591f-dea5-641d-5e8b-ad0a295c1592/mzaf_1787020353271673194.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Get%20Lucky%20%28Radio%20Edit%29%20%5Bfeat.%20Pharrell%20Williams%20and%20Nile%20Rodgers%5D%20Daft%20Punk%2C%20Pharrell%20Williams%2C%20Nile%20Rodgers",
        "seconds": 247
      },
      {
        "id": 2005,
        "title": "Digital Love",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/43/5b/df435bbf-129a-ec94-cebb-8c83e3a261e2/mzaf_13417326183095861767.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Digital%20Love%20Daft%20Punk",
        "seconds": 301
      },
      {
        "id": 2006,
        "title": "Starboy",
        "artist": "The Weeknd, Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Starboy%20The%20Weeknd%2C%20Daft%20Punk",
        "seconds": 230
      },
      {
        "id": 2007,
        "title": "Instant Crush (feat. Julian Casablancas)",
        "artist": "Daft Punk, Julian Casablancas",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c8/6d/11/c86d1183-9e36-fc2f-6490-80568ed056e0/196871342049.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/80/ec/9180ec16-05dd-9afb-8354-b9b5efefbe2f/mzaf_8683542672513085375.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Instant%20Crush%20%28feat.%20Julian%20Casablancas%29%20Daft%20Punk%2C%20Julian%20Casablancas",
        "seconds": 337
      },
      {
        "id": 2008,
        "title": "I Feel It Coming",
        "artist": "The Weeknd, Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/61/f8/e261f8c1-73db-9a7a-c89e-1068f19970e0/16UMGIM67863.rgb.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/71/af/e0/71afe07f-aae7-c4f0-db02-c05be07591d2/mzaf_5960554915698764959.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=I%20Feel%20It%20Coming%20The%20Weeknd%2C%20Daft%20Punk",
        "seconds": 269
      },
      {
        "id": 2009,
        "title": "Something About Us",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Something%20About%20Us%20Daft%20Punk",
        "seconds": 232
      },
      {
        "id": 2010,
        "title": "Lose Yourself to Dance (feat. Pharrell Williams)",
        "artist": "Daft Punk, Pharrell Williams",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c8/6d/11/c86d1183-9e36-fc2f-6490-80568ed056e0/196871342049.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/09/27/2e/09272e5a-7d4e-ad47-3f94-dbfa53aa1150/mzaf_6759488847418180690.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Lose%20Yourself%20to%20Dance%20%28feat.%20Pharrell%20Williams%29%20Daft%20Punk%2C%20Pharrell%20Williams",
        "seconds": 353
      },
      {
        "id": 2011,
        "title": "End of Line",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=End%20of%20Line%20Daft%20Punk",
        "seconds": 156
      },
      {
        "id": 2012,
        "title": "Veridis Quo",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/cc/c4/e0ccc4af-ad90-59fe-9a7c-9c32d1a3c380/mzaf_2643765405421046671.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Veridis%20Quo%20Daft%20Punk",
        "seconds": 345
      },
      {
        "id": 2013,
        "title": "Give Life Back to Music",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f1/20/87/f12087fe-44df-d6fa-9fc6-5cd87d56cfef/mzaf_17737854447914578103.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Give%20Life%20Back%20to%20Music%20Daft%20Punk",
        "seconds": 275
      },
      {
        "id": 2014,
        "title": "Around the World / Harder, Better, Faster, Stronger",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/15/5f/b7155f62-f93a-2fe7-d98d-cc19240b4bd0/5099951165857_1500x1500_300dpi.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ae/fc/c9/aefcc948-19fc-8158-5f89-93a0329c5fd7/mzaf_14311759840241024274.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Around%20the%20World%20/%20Harder%2C%20Better%2C%20Faster%2C%20Stronger%20Daft%20Punk",
        "seconds": 342
      },
      {
        "id": 2015,
        "title": "The Son of Flynn",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=The%20Son%20of%20Flynn%20Daft%20Punk",
        "seconds": 95
      },
      {
        "id": 2016,
        "title": "Harder, Better, Faster, Stronger",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8d/a4/4e/8da44e8f-9705-6182-686c-332714c54671/mzaf_17406318046701183138.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Harder%2C%20Better%2C%20Faster%2C%20Stronger%20Daft%20Punk",
        "seconds": 226
      },
      {
        "id": 2017,
        "title": "Fragments of Time (feat. Todd Edwards)",
        "artist": "Daft Punk, Todd Edwards",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c8/6d/11/c86d1183-9e36-fc2f-6490-80568ed056e0/196871342049.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/ab/c4/22abc4e4-bb31-77da-7a36-0e4e96176864/mzaf_6534942713709919610.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Fragments%20of%20Time%20%28feat.%20Todd%20Edwards%29%20Daft%20Punk%2C%20Todd%20Edwards",
        "seconds": 279
      },
      {
        "id": 2018,
        "title": "Infinity Repeating (2013 Demo) [feat. Julian Casablancas+The Voidz]",
        "artist": "Daft Punk, Julian Casablancas, The Voidz",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Infinity%20Repeating%20%282013%20Demo%29%20%5Bfeat.%20Julian%20Casablancas%2BThe%20Voidz%5D%20Daft%20Punk%2C%20Julian%20Casablancas%2C%20The%20Voidz",
        "seconds": 239
      },
      {
        "id": 2019,
        "title": "Television Rules the Nation / Crescendolls",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Television%20Rules%20the%20Nation%20/%20Crescendolls%20Daft%20Punk",
        "seconds": 290
      },
      {
        "id": 2020,
        "title": "Giorgio by Moroder",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/06/62/df066260-84b2-afd6-8ac2-42ce1db00900/mzaf_7704112998481229652.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Giorgio%20by%20Moroder%20Daft%20Punk",
        "seconds": 544
      },
      {
        "id": 2021,
        "title": "Derezzed",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Derezzed%20Daft%20Punk",
        "seconds": 104
      },
      {
        "id": 2022,
        "title": "Robot Rock",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Robot%20Rock%20Daft%20Punk",
        "seconds": 287
      },
      {
        "id": 2023,
        "title": "Voyager",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/4tZwfgrHOc3mvqYlEYSvVi/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Voyager%20Daft%20Punk",
        "seconds": 227
      },
      {
        "id": 2024,
        "title": "Doin' it Right (feat. Panda Bear)",
        "artist": "Daft Punk, Panda Bear",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c8/6d/11/c86d1183-9e36-fc2f-6490-80568ed056e0/196871342049.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/30/10/b5/3010b552-d479-1d83-174a-b3636932d037/mzaf_14944237147973341814.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Doin%27%20it%20Right%20%28feat.%20Panda%20Bear%29%20Daft%20Punk%2C%20Panda%20Bear",
        "seconds": 251
      },
      {
        "id": 2025,
        "title": "One More Time / Aerodynamic",
        "artist": "Daft Punk",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/15/5f/b7155f62-f93a-2fe7-d98d-cc19240b4bd0/5099951165857_1500x1500_300dpi.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/c7/bd/8ec7bd21-518c-75f6-94ca-aee568eada67/mzaf_3889652290707361174.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=One%20More%20Time%20/%20Aerodynamic%20Daft%20Punk",
        "seconds": 370
      }
    ]
  },
  {
    "id": "37i9dQZF1DZ06evO1ZgD0Q",
    "name": "This Is Yeat",
    "cover": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
    "spotifyUrl": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO1ZgD0Q",
    "blurb": "This Is Yeat. The real tracklist, all in one playlist. In-app playback streams 30-second previews where available; every track also links to YouTube.",
    "tracks": [
      {
        "id": 3001,
        "title": "As We Speak (feat. Drake)",
        "artist": "Yeat, Drake",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=As%20We%20Speak%20%28feat.%20Drake%29%20Yeat%2C%20Drake",
        "seconds": 240
      },
      {
        "id": 3002,
        "title": "Back Home",
        "artist": "Yeat, Joji",
        "album": "",
        "art": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/57/a7/e7/57a7e70c-f28e-8a0b-7cd8-42c3a2531a98/15UMGIM20065.rgb.jpg/600x600bb.jpg",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3e/0b/68/3e0b6893-9092-d8c1-8680-799deae904c4/mzaf_7438130481404576989.plus.aac.p.m4a",
        "yt": "https://www.youtube.com/results?search_query=Back%20Home%20Yeat%2C%20Joji",
        "seconds": 193
      },
      {
        "id": 3003,
        "title": "COMË N GO",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=COM%C3%8B%20N%20GO%20Yeat",
        "seconds": 198
      },
      {
        "id": 3004,
        "title": "Rendezvous (feat. Yeat)",
        "artist": "Don Toliver, Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Rendezvous%20%28feat.%20Yeat%29%20Don%20Toliver%2C%20Yeat",
        "seconds": 146
      },
      {
        "id": 3005,
        "title": "MISS MY DAWG (feat. Drake)",
        "artist": "Yeat, Drake",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=MISS%20MY%20DAWG%20%28feat.%20Drake%29%20Yeat%2C%20Drake",
        "seconds": 188
      },
      {
        "id": 3006,
        "title": "ON NOTHING",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=ON%20NOTHING%20Yeat",
        "seconds": 123
      },
      {
        "id": 3007,
        "title": "Griddlë",
        "artist": "Yeat, Don Toliver",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Griddl%C3%AB%20Yeat%2C%20Don%20Toliver",
        "seconds": 157
      },
      {
        "id": 3008,
        "title": "2TONE",
        "artist": "Yeat, Don Toliver",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=2TONE%20Yeat%2C%20Don%20Toliver",
        "seconds": 220
      },
      {
        "id": 3009,
        "title": "COCOON",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=COCOON%20Yeat",
        "seconds": 118
      },
      {
        "id": 3010,
        "title": "Out thë way",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Out%20th%C3%AB%20way%20Yeat",
        "seconds": 150
      },
      {
        "id": 3011,
        "title": "Monëy so big",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Mon%C3%ABy%20so%20big%20Yeat",
        "seconds": 160
      },
      {
        "id": 3012,
        "title": "If We Being Rëal",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=If%20We%20Being%20R%C3%ABal%20Yeat",
        "seconds": 172
      },
      {
        "id": 3013,
        "title": "TËNNIS",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=T%C3%8BNNIS%20Yeat",
        "seconds": 179
      },
      {
        "id": 3014,
        "title": "IDGAF (feat. Yeat)",
        "artist": "Drake, Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=IDGAF%20%28feat.%20Yeat%29%20Drake%2C%20Yeat",
        "seconds": 260
      },
      {
        "id": 3015,
        "title": "ORCHESTRATË",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=ORCHESTRAT%C3%8B%20Yeat",
        "seconds": 173
      },
      {
        "id": 3016,
        "title": "Sorry Bout That",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Sorry%20Bout%20That%20Yeat",
        "seconds": 186
      },
      {
        "id": 3017,
        "title": "EARNËD IT",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=EARN%C3%8BD%20IT%20Yeat",
        "seconds": 151
      },
      {
        "id": 3018,
        "title": "Breathe",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Breathe%20Yeat",
        "seconds": 170
      },
      {
        "id": 3019,
        "title": "Flawlëss (feat. Lil Uzi Vert)",
        "artist": "Yeat, Lil Uzi Vert",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Flawl%C3%ABss%20%28feat.%20Lil%20Uzi%20Vert%29%20Yeat%2C%20Lil%20Uzi%20Vert",
        "seconds": 176
      },
      {
        "id": 3020,
        "title": "On tha linë",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=On%20tha%20lin%C3%AB%20Yeat",
        "seconds": 154
      },
      {
        "id": 3021,
        "title": "HOLY WATËR",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=HOLY%20WAT%C3%8BR%20Yeat",
        "seconds": 137
      },
      {
        "id": 3022,
        "title": "DOG HOUSE (feat. Julia Wolf & Yeat)",
        "artist": "Drake, Julia Wolf, Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=DOG%20HOUSE%20%28feat.%20Julia%20Wolf%20%26%20Yeat%29%20Drake%2C%20Julia%20Wolf%2C%20Yeat",
        "seconds": 190
      },
      {
        "id": 3023,
        "title": "Gët Busy",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=G%C3%ABt%20Busy%20Yeat",
        "seconds": 157
      },
      {
        "id": 3024,
        "title": "Nun id change",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=Nun%20id%20change%20Yeat",
        "seconds": 211
      },
      {
        "id": 3025,
        "title": "LUH BIRK",
        "artist": "Yeat",
        "album": "",
        "art": "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/thisisv3/3qiHUAX7zY4Qnjx8TNUzVx/en",
        "preview": "",
        "yt": "https://www.youtube.com/results?search_query=LUH%20BIRK%20Yeat",
        "seconds": 99
      }
    ]
  }
];
