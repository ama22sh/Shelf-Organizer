import type { DailyFact, QuizQuestion, Story, StoryCategory } from "./types";

export const CATEGORIES: { id: StoryCategory; label: string }[] = [
  { id: "adventure", label: "Adventure" },
  { id: "mystery", label: "Mystery" },
  { id: "history", label: "History" },
  { id: "science", label: "Science" },
  { id: "fantasy", label: "Fantasy" },
  { id: "motivational", label: "Life Lessons" },
];

export const stories: Story[] = [
  {
    id: "lantern-keeper",
    title: "The Lantern Keeper",
    author: "M. Adler",
    category: "adventure",
    access: "free",
    readTime: 2,
    reward: 8,
    spine: "hsl(28 70% 45%)",
    blurb:
      "A young girl tends a lighthouse on a cliff that no captain has dared visit in years.",
    pages: [
      "Wren had kept the lantern since she was nine. Every night she climbed the spiral stair, polished the brass, and lit the great oil wick that warned ships away from the cliffs.",
      "But for two winters now, no ship had passed. The villagers said the route had been abandoned. Wren disagreed. She had seen lights on the horizon, faint and unmoving, almost as if waiting.",
      "On the third night of the third winter, she climbed the tower and found the lantern already lit. A note rested beneath the wick, written in careful, looping ink: \"You taught me where home was. — Captain Roe.\"",
      "Wren stood at the window for a long time. Out on the dark water, three small lights blinked twice in answer, and then turned, slowly, for the harbor.",
    ],
  },
  {
    id: "missing-bookmark",
    title: "The Case of the Missing Bookmark",
    author: "I. Brennan",
    category: "mystery",
    access: "free",
    readTime: 2,
    reward: 8,
    spine: "hsl(220 50% 45%)",
    blurb:
      "Every morning the librarian's bookmark is in a different book. She has decided to find out who is moving it.",
    pages: [
      "Mrs. Halpern had used the same green ribbon as a bookmark for twenty-two years. On Monday she left it in chapter four of a gardening book. On Tuesday she found it tucked inside a cookbook on the other side of the library.",
      "She tried hiding it in atlases, then in poetry, then in a thick guide to bird songs. By Friday it had travelled to seven different shelves. No one had a key but her.",
      "That evening she stayed late, lights off, and waited. Just before midnight she heard the smallest sound — a polite cough — and saw a small grey cat hop onto the desk, take the ribbon gently in its teeth, and pad away into the stacks.",
      "Mrs. Halpern decided not to mention it. The cat clearly had its own reading list.",
    ],
  },
  {
    id: "ink-and-rain",
    title: "Ink and Rain",
    author: "T. Okafor",
    category: "history",
    access: "free",
    readTime: 3,
    reward: 10,
    spine: "hsl(8 55% 40%)",
    blurb:
      "A monk in a remote scriptorium tries to save a single sentence from a flood.",
    pages: [
      "In the autumn of the long rains, water rose against the abbey walls. Brother Anselm was the youngest copyist, and he was alone in the scriptorium when the river finally broke through.",
      "He could only carry one page. He chose a single sheet from a half-finished manuscript: a sentence on kindness that had never been written down before.",
      "He wrapped it in oiled cloth and held it to his chest as he walked the long flooded road to the next village.",
      "Centuries later, that sentence appears in countless books, in countless languages. The original page is lost. The river took everything else. But the sentence remained — because one person decided it was worth saving.",
    ],
  },
  {
    id: "tiny-engines",
    title: "The Tiny Engines",
    author: "Dr. P. Linde",
    category: "science",
    access: "free",
    readTime: 2,
    reward: 8,
    spine: "hsl(160 45% 38%)",
    blurb:
      "Inside every cell in your body, microscopic motors are spinning right now. Here is how they work.",
    pages: [
      "Inside every one of your cells, there is a tiny machine called ATP synthase. It is so small that you could fit a million of them across the head of a pin.",
      "It is shaped like a stalk with a wheel on the bottom. Hydrogen ions push the wheel, which makes it spin — at about a hundred turns per second.",
      "Every spin produces a molecule called ATP, which is the fuel your cells use to do everything: think, grow, heal, and move. Right now, billions of these little engines inside you are spinning quietly.",
      "You are, in a very real sense, a city of motors humming softly in the dark.",
    ],
  },
  {
    id: "moonbirds",
    title: "The Moonbirds",
    author: "S. Calder",
    category: "fantasy",
    access: "free",
    readTime: 2,
    reward: 8,
    spine: "hsl(265 45% 50%)",
    blurb:
      "Birds made of moonlight visit a quiet garden, but only a child can see them.",
    pages: [
      "Every full moon, the birds came. They were the colour of frost on glass and they made no sound when they landed in the apple tree behind the cottage.",
      "Only Nia could see them. She sat on the back step in her grandmother's coat and counted: one, two, six, twelve. They tilted their heads at her and waited.",
      "She did not know what they wanted. She only knew that they came, and that as long as she watched them, the garden glowed faintly silver, and the night felt safe.",
      "When she grew up she did not forget. Sometimes, on the right kind of evening, she still saw a single white feather, drifting down through nothing at all.",
    ],
  },
  {
    id: "small-stones",
    title: "Small Stones",
    author: "E. Marsh",
    category: "motivational",
    access: "free",
    readTime: 2,
    reward: 8,
    spine: "hsl(45 65% 45%)",
    blurb:
      "A grandfather teaches his grandson that mountains are moved one pebble at a time.",
    pages: [
      "When his grandson asked how he had built his stone wall, the old man said, \"One stone a day.\" The grandson laughed. \"That's nothing.\" \"Yes,\" said the old man, \"each one is nothing.\"",
      "But the wall ran the whole length of the field, taller than the boy, and he could not see where it ended.",
      "The grandfather handed the boy a small grey stone. \"Today,\" he said, \"is your stone. Put it where you like.\" The boy looked at the wall, and then at the stone in his hand, and slowly, he began to understand.",
    ],
  },
  {
    id: "north-of-quiet",
    title: "North of Quiet",
    author: "K. Voss",
    category: "adventure",
    access: "premium",
    cost: 30,
    readTime: 3,
    reward: 14,
    spine: "hsl(195 55% 40%)",
    blurb:
      "An ice-cartographer follows a line on a map that no one else admits exists.",
    pages: [
      "There was a line on the old chart that no one else admitted existed. It ran north past the last marked island, past the last named bay, and ended at a single word in faint pencil: WAIT.",
      "Inga packed for six weeks and went anyway. The dogs were patient. The wind was not.",
      "On the eleventh day she crested a ridge of blue-white ice and saw the thing the chart had been pointing at: a stone, taller than a house, with words carved on every side. They were in a language she had never seen.",
      "She copied them down, all of them, and turned for home. She would spend the rest of her life learning what they said. She thought it was a fair trade.",
    ],
  },
  {
    id: "clockmaker-letter",
    title: "The Clockmaker's Letter",
    author: "I. Brennan",
    category: "mystery",
    access: "premium",
    cost: 30,
    readTime: 3,
    reward: 14,
    spine: "hsl(0 50% 35%)",
    blurb:
      "A locked clock arrives in the mail with no return address. Inside it: a letter dated tomorrow.",
    pages: [
      "The clock arrived in a wooden crate, wrapped in straw. There was no return address and no note — only a small brass key taped to the lid.",
      "When she wound it, the clock began to keep time perfectly. When she opened the back, she found a folded letter inside, dated the next day, in her own handwriting.",
      "The letter said only: \"Don't go to the station tomorrow. Trust me.\" She did not go. The next morning the eight o'clock train derailed half a mile out of town.",
      "She kept the clock for the rest of her life, and never opened the back again. She was not sure she wanted to know who she had been writing to.",
    ],
  },
  {
    id: "two-minutes-of-stars",
    title: "Two Minutes of Stars",
    author: "Dr. P. Linde",
    category: "science",
    access: "premium",
    cost: 30,
    readTime: 3,
    reward: 14,
    spine: "hsl(240 40% 38%)",
    blurb:
      "Light from the nearest star takes four years to reach you. From the farthest, billions. What does that mean?",
    pages: [
      "Light is fast — about 300,000 kilometres per second — but the universe is patient. Light from the Sun takes eight minutes to arrive. By the time you see it, the Sun has already moved on.",
      "Light from the nearest star, Proxima Centauri, takes four years and three months. So when you look at it, you are seeing it as it was when you were four years younger than today.",
      "The most distant galaxies we can see are over thirteen billion years away. Their light has been travelling almost since the universe began. Some of those galaxies no longer exist.",
      "The night sky is not a place. It is a memory of one — a quiet, glowing letter from the past, addressed to anyone patient enough to look up.",
    ],
  },
  {
    id: "girl-who-grew-a-tower",
    title: "The Girl Who Grew a Tower",
    author: "S. Calder",
    category: "fantasy",
    access: "premium",
    cost: 30,
    readTime: 3,
    reward: 14,
    spine: "hsl(310 40% 45%)",
    blurb:
      "A girl plants a single seed and waits. By winter, the tower is taller than the church.",
    pages: [
      "The seed had come from her great-aunt, in an envelope marked: \"Plant where you want a window.\" She did not understand the instruction, so she planted it in the corner of the back garden and forgot about it.",
      "By summer, the seed had grown into a tower of pale green stone, as tall as the apple tree. By autumn it had a spiral stair inside, and a single round window near the top.",
      "By winter, the tower was taller than the church. From the window she could see the river, the road, the far hills, and a thin line of smoke from her great-aunt's chimney, three valleys away.",
      "The window had been the gift. The tower had been her, growing toward it.",
    ],
  },
];

export const dailyFacts: DailyFact[] = [
  {
    id: "fact-octopus",
    title: "An Octopus Has Three Hearts",
    body: "Two pump blood through the gills, and the third pumps it through the rest of the body. The third heart actually stops beating when the octopus swims, which is why they prefer to crawl.",
    category: "science",
  },
  {
    id: "fact-honey",
    title: "Honey Never Spoils",
    body: "Archaeologists have found pots of honey in ancient Egyptian tombs that are over three thousand years old — and still perfectly edible. Honey's chemistry is hostile to almost every microorganism.",
    category: "science",
  },
  {
    id: "fact-library-of-alexandria",
    title: "Walking Through the Library of Alexandria",
    body: "The lost Library of Alexandria did not burn down all at once. It declined slowly over centuries through war, neglect, and budget cuts. The lesson historians draw from it: nothing is permanent without daily care.",
    category: "history",
  },
  {
    id: "fact-bamboo",
    title: "Bamboo Grows Almost a Metre a Day",
    body: "Some species of bamboo grow nearly 91 centimetres in a single day. If you sat quietly enough beside a stalk in spring, you could actually watch it rise.",
    category: "science",
  },
  {
    id: "fact-trees-talk",
    title: "Trees Talk Through Their Roots",
    body: "Beneath a forest, trees share sugars, water, and warning signals through a vast network of fungi connecting their roots. Old trees feed seedlings. Healthy trees support sick ones. The forest is a slow, patient conversation.",
    category: "science",
  },
  {
    id: "fact-tiny-improvements",
    title: "One Percent a Day",
    body: "Improving by just one percent each day compounds into thirty-seven times better in a year. Most lasting change is not dramatic. It is quiet, patient, and made of small honest stones.",
    category: "motivational",
  },
  {
    id: "fact-sea-glass",
    title: "Sea Glass Is Just Patience",
    body: "Every smooth, frosted piece of sea glass on a beach was once a sharp shard of broken bottle. It took the ocean an average of thirty years to round each edge. Some of the most beautiful things take time.",
    category: "motivational",
  },
];

export const quiz: QuizQuestion[] = [
  {
    id: "q1",
    sentence: "The cat sat on the ___.",
    options: ["mat", "cloud", "river", "moon"],
    answer: "mat",
    hint: "It rhymes with cat.",
  },
  {
    id: "q2",
    sentence: "Bees make sweet ___.",
    options: ["bread", "honey", "soup", "rain"],
    answer: "honey",
    hint: "It comes from flowers.",
  },
  {
    id: "q3",
    sentence: "We see stars at ___.",
    options: ["lunch", "noon", "night", "dawn"],
    answer: "night",
    hint: "When the sun is gone.",
  },
  {
    id: "q4",
    sentence: "A baby dog is called a ___.",
    options: ["kitten", "puppy", "calf", "chick"],
    answer: "puppy",
    hint: "It barks softly.",
  },
  {
    id: "q5",
    sentence: "Fish live in the ___.",
    options: ["sky", "tree", "water", "fire"],
    answer: "water",
    hint: "They swim in it.",
  },
  {
    id: "q6",
    sentence: "The opposite of cold is ___.",
    options: ["wet", "loud", "hot", "tall"],
    answer: "hot",
    hint: "Like the sun.",
  },
  {
    id: "q7",
    sentence: "We read books in a ___.",
    options: ["pool", "library", "garage", "kitchen"],
    answer: "library",
    hint: "Lots of shelves.",
  },
  {
    id: "q8",
    sentence: "Bread is baked in an ___.",
    options: ["oven", "ocean", "engine", "umbrella"],
    answer: "oven",
    hint: "It is hot inside.",
  },
  {
    id: "q9",
    sentence: "Plants need water and ___.",
    options: ["snow", "sunlight", "salt", "noise"],
    answer: "sunlight",
    hint: "It comes from the sky in the day.",
  },
  {
    id: "q10",
    sentence: "Birds use wings to ___.",
    options: ["dig", "fly", "swim", "sleep"],
    answer: "fly",
    hint: "Up in the air.",
  },
  {
    id: "q11",
    sentence: "Snow is cold and ___.",
    options: ["green", "white", "loud", "round"],
    answer: "white",
    hint: "The colour of milk.",
  },
  {
    id: "q12",
    sentence: "We sleep at ___.",
    options: ["work", "school", "night", "lunch"],
    answer: "night",
    hint: "When stars come out.",
  },
];

/** Deterministic daily story / fact picker, based on the local date. */
export function pickDaily(): { story?: Story; fact?: DailyFact } {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Alternate days: even seed → fact, odd seed → free story.
  const useFact = seed % 2 === 0;
  if (useFact) {
    const f = dailyFacts[seed % dailyFacts.length];
    return { fact: f };
  } else {
    const free = stories.filter((s) => s.access === "free");
    const s = free[seed % free.length];
    return { story: s };
  }
}

export function dailyKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
