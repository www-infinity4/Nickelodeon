(function () {
  "use strict";

  // Every entry is a full-length episode/program source. The app rejects clips by design.
  // eraLabel describes the Nickelodeon-era fit when a series originally premiered elsewhere.
  window.INFINITY_CHANNEL = {
    name: "Nickelodeon",
    slug: "Nickelodeon",
    era: "1986–1996",
    slotSeconds: 1800,
    fullEpisodesOnly: true
  };

  window.NICKELODEON_CATALOG = [
    {id:"nick-dd-classic",show:"Double Dare",title:"Classic Full Episode",year:1986,eraLabel:"Nickelodeon · 1986",videoId:"XEZCY95JliY",runtimeSeconds:1380,source:"Nickelodeon",cleared:true},

    {id:"cd-01",show:"Count Duckula",title:"No Sax Please, We're Egyptian!",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"7ZP1fGikI3k",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-02",show:"Count Duckula",title:"Restoration Comedy",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"Hl_x_KzZUpM",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-03",show:"Count Duckula",title:"Castle Duckula: Open to the Public",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"16hL0M9-xds",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-04",show:"Count Duckula",title:"Vampire Vacation",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"iB-Ckw_wnAU",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-05",show:"Count Duckula",title:"Town Hall Terrors",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"jB5uweDys4w",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-06",show:"Count Duckula",title:"Prime-Time Duck",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"FNlv07krtMc",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-07",show:"Count Duckula",title:"The Ghost of McCastle McDuckula",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"7PIedVnG6Sc",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-08",show:"Count Duckula",title:"Jungle Duck",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"1hxVvKdRK1c",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-09",show:"Count Duckula",title:"Dear Diary",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"RgXtj-DwLGw",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-10",show:"Count Duckula",title:"One Stormy Night",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"tB6Bu6aiGsc",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-11",show:"Count Duckula",title:"The Vampire Strikes Back",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"NEchV6BXCeY",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-12",show:"Count Duckula",title:"Transylvanian Homesick Blues",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"oUkVpIcho38",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-13",show:"Count Duckula",title:"Dr. Von Goosewing's Invisible Ray",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"Q3TveDBPGyQ",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-14",show:"Count Duckula",title:"All in a Fog",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"obv_U8mR3bQ",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-15",show:"Count Duckula",title:"Igor's Busy Day",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"HkgCBHVK9KA",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-16",show:"Count Duckula",title:"Mobile Home",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"j9CmMrdQIRs",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-17",show:"Count Duckula",title:"The Mutinous Penguins",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"Ow2HEc2ohkk",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-18",show:"Count Duckula",title:"Hard Luck Hotel",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"fIQa2NMr6lY",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-19",show:"Count Duckula",title:"A Fright at the Opera",year:1989,eraLabel:"Nickelodeon era · 1988–1993",videoId:"gSgpOtvqSGM",runtimeSeconds:1320,source:"Count Duckula",cleared:true},
    {id:"cd-20",show:"Count Duckula",title:"Down Under Duckula",year:1988,eraLabel:"Nickelodeon era · 1988–1993",videoId:"4ZOcerTYw3I",runtimeSeconds:1320,source:"Count Duckula",cleared:true},

    {id:"ig-01",show:"Inspector Gadget",title:"Volcano Island",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"ysknP4biyyk",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-02",show:"Inspector Gadget",title:"Luxury Cruise Jewels Rescue!",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"QUdwG9h74QM",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-03",show:"Inspector Gadget",title:"Gadget's Replacement",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"7OwwiHHFZX4",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-04",show:"Inspector Gadget",title:"Funny Money",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"UqTzJpTwFFc",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-05",show:"Inspector Gadget",title:"Amusement Park",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"r9prNsqs-yQ",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-06",show:"Inspector Gadget",title:"A Bad Altitude",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"jZ5vTfauv3M",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-07",show:"Inspector Gadget",title:"Snakin' All Over",year:1985,eraLabel:"Nickelodeon · 1987–1992",videoId:"gyefry5JVW0",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-08",show:"Inspector Gadget",title:"The Infiltration",year:1983,eraLabel:"Nickelodeon · 1987–1992",videoId:"rJKht7IY-Xg",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},
    {id:"ig-09",show:"Inspector Gadget",title:"Dry Spell",year:1985,eraLabel:"Nickelodeon · 1987–1992",videoId:"NfD0Y8q8LFs",runtimeSeconds:1350,source:"Inspector Gadget",cleared:true},

    {id:"hc-01",show:"Heathcliff",title:"Break an Egg",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"vKotqUUvXdg",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-02",show:"Heathcliff",title:"Heathcliff's Double",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"pSPGv3oAmDk",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-03",show:"Heathcliff",title:"Heathcliff and the Catillac Cats — Part 2",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"f9GQk4CRiFw",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-04",show:"Heathcliff",title:"Cat vs. Gophers: The Ultimate Park War!",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"RjuzqitWuAI",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-05",show:"Heathcliff",title:"Riff Raff's Mom",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"bZEI5Mav42I",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-06",show:"Heathcliff",title:"Heathcliff Gets Canned",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"gsOw9UKeaj4",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-07",show:"Heathcliff",title:"Hector the Detector",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"y4Vwhj9TrBI",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-08",show:"Heathcliff",title:"Nightmare in Beverly Hills",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"R77u0zotdMY",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},
    {id:"hc-09",show:"Heathcliff",title:"Time Warped",year:1984,eraLabel:"Nickelodeon · 1988–1993",videoId:"Ip6F1kSu7sk",runtimeSeconds:1320,source:"Heathcliff - WildBrain",cleared:true},

    {id:"aya-01",show:"Are You Afraid of the Dark?",title:"The Tale of the Phone Police",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"BhDdblNRtsI",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-02",show:"Are You Afraid of the Dark?",title:"The Tale of the Bookish Babysitter",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"bb4g7ux_Fq0",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-03",show:"Are You Afraid of the Dark?",title:"The Tale of the Curious Camera",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"4nmWEWdESgs",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-04",show:"Are You Afraid of the Dark?",title:"The Tale of the Guardian's Curse",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"1HdO_aNtH_I",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-05",show:"Are You Afraid of the Dark?",title:"The Tale of Watcher's Woods",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"CreYMjRJUvs",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-06",show:"Are You Afraid of the Dark?",title:"The Tale of the Dream Girl",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"qtZzTDRSdZ4",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-07",show:"Are You Afraid of the Dark?",title:"The Tale of the Carved Stone",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"BUtCogdzyC4",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-08",show:"Are You Afraid of the Dark?",title:"The Tale of the Dollmaker",year:1994,eraLabel:"Nickelodeon · 1992–1996",videoId:"1aES3gk5-Q8",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true},
    {id:"aya-09",show:"Are You Afraid of the Dark?",title:"The Tale of the Whispering Walls",year:1993,eraLabel:"Nickelodeon · 1992–1996",videoId:"qntSIcZO9zI",runtimeSeconds:1440,source:"Are You Afraid of the Dark? - WildBrain",cleared:true}
  ];

  // The shared channel remote expects these legacy names when it calculates live programming.
  window.HERMIT_CATALOG = window.NICKELODEON_CATALOG.map((program) => ({...program, collection:program.show}));
  window.HERMIT_COMMERCIALS = [];
})();