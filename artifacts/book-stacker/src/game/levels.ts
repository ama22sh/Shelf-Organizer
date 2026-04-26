import { Level } from "./types";

export const levels: Level[] = [
  {
    id: 1,
    name: "A Quiet Start",
    shelves: [{ id: "s1", width: 6, height: 1 }],
    books: [
      { id: "b1", width: 1, height: 1, color: "bg-amber-800", title: "Poetry", pattern: "lines" },
      { id: "b2", width: 1, height: 1, color: "bg-emerald-800", title: "Botany", pattern: "dots" },
      { id: "b3", width: 2, height: 1, color: "bg-red-900", title: "History of Rome", pattern: "double-lines" },
      { id: "b4", width: 2, height: 1, color: "bg-blue-900", title: "Astronomy", pattern: "stars" },
    ],
  },
  {
    id: 2,
    name: "Sorting the Shelf",
    shelves: [{ id: "s1", width: 8, height: 1 }],
    books: [
      { id: "b1", width: 1, height: 1, color: "bg-amber-800", title: "Sonnet I", pattern: "lines" },
      { id: "b2", width: 3, height: 1, color: "bg-emerald-900", title: "Encyclopedia", pattern: "diamonds" },
      { id: "b3", width: 2, height: 1, color: "bg-stone-700", title: "Memoirs", pattern: "none" },
      { id: "b4", width: 2, height: 1, color: "bg-red-800", title: "Philosophy", pattern: "double-lines" },
    ],
  },
  {
    id: 3,
    name: "Tall Orders",
    shelves: [{ id: "s1", width: 4, height: 2 }],
    books: [
      { id: "b1", width: 1, height: 2, color: "bg-amber-700", title: "Atlas", pattern: "lines" },
      { id: "b2", width: 1, height: 2, color: "bg-red-900", title: "Recipes", pattern: "dots" },
      { id: "b3", width: 2, height: 1, color: "bg-blue-800", title: "Fiction", pattern: "stars" },
      { id: "b4", width: 2, height: 1, color: "bg-emerald-800", title: "Nature", pattern: "none" },
    ],
  },
  {
    id: 4,
    name: "Two Shelves",
    shelves: [
      { id: "s1", width: 5, height: 1 },
      { id: "s2", width: 5, height: 1 },
    ],
    books: [
      { id: "b1", width: 3, height: 1, color: "bg-stone-800", title: "The Old Man", pattern: "lines" },
      { id: "b2", width: 2, height: 1, color: "bg-amber-900", title: "Sea", pattern: "dots" },
      { id: "b3", width: 1, height: 1, color: "bg-red-800", title: "Art", pattern: "none" },
      { id: "b4", width: 4, height: 1, color: "bg-blue-900", title: "Complete Works", pattern: "diamonds" },
    ],
  },
  {
    id: 5,
    name: "The Perfect Fit",
    shelves: [
      { id: "s1", width: 6, height: 2 },
      { id: "s2", width: 4, height: 1 },
    ],
    books: [
      { id: "b1", width: 2, height: 2, color: "bg-amber-800", title: "Almanac", pattern: "stars" },
      { id: "b2", width: 1, height: 2, color: "bg-stone-700", title: "Spells", pattern: "lines" },
      { id: "b3", width: 3, height: 1, color: "bg-emerald-900", title: "Beasts", pattern: "double-lines" },
      { id: "b4", width: 3, height: 1, color: "bg-red-900", title: "Potions", pattern: "dots" },
      { id: "b5", width: 4, height: 1, color: "bg-blue-800", title: "Journals", pattern: "none" },
    ],
  },
  {
    id: 6,
    name: "Tight Spaces",
    shelves: [
      { id: "s1", width: 3, height: 3 },
      { id: "s2", width: 3, height: 3 },
    ],
    books: [
      { id: "b1", width: 1, height: 3, color: "bg-stone-800", title: "Tome", pattern: "diamonds" },
      { id: "b2", width: 2, height: 2, color: "bg-amber-700", title: "Ledger", pattern: "lines" },
      { id: "b3", width: 3, height: 1, color: "bg-emerald-800", title: "Index", pattern: "dots" },
      { id: "b4", width: 2, height: 1, color: "bg-red-800", title: "Letters", pattern: "none" },
      { id: "b5", width: 1, height: 2, color: "bg-blue-900", title: "Notes", pattern: "stars" },
      { id: "b6", width: 1, height: 1, color: "bg-stone-600", title: "Keys", pattern: "double-lines" },
    ],
  },
  {
    id: 7,
    name: "The Reading Lamp",
    shelves: [
      { id: "s1", width: 8, height: 2, blockedCells: [{x: 4, y: 0}, {x: 4, y: 1}, {x: 5, y: 1}] },
    ],
    books: [
      { id: "b1", width: 2, height: 2, color: "bg-emerald-900", title: "Herbology", pattern: "lines" },
      { id: "b2", width: 2, height: 2, color: "bg-amber-900", title: "Geology", pattern: "diamonds" },
      { id: "b3", width: 1, height: 2, color: "bg-red-800", title: "Myths", pattern: "dots" },
      { id: "b4", width: 3, height: 1, color: "bg-stone-700", title: "Fables", pattern: "none" },
      { id: "b5", width: 2, height: 1, color: "bg-blue-800", title: "Tales", pattern: "stars" },
    ],
  },
  {
    id: 8,
    name: "A Cluttered Desk",
    shelves: [
      { id: "s1", width: 6, height: 3, blockedCells: [{x: 1, y: 1}, {x: 4, y: 0}, {x: 5, y: 0}] },
    ],
    books: [
      { id: "b1", width: 1, height: 3, color: "bg-stone-900", title: "Obscura", pattern: "double-lines" },
      { id: "b2", width: 2, height: 1, color: "bg-amber-800", title: "Lore", pattern: "none" },
      { id: "b3", width: 1, height: 2, color: "bg-red-900", title: "Truths", pattern: "dots" },
      { id: "b4", width: 3, height: 1, color: "bg-blue-900", title: "Lies", pattern: "lines" },
      { id: "b5", width: 2, height: 1, color: "bg-emerald-800", title: "Secrets", pattern: "diamonds" },
      { id: "b6", width: 3, height: 1, color: "bg-stone-700", title: "Rumors", pattern: "stars" },
    ],
  },
  {
    id: 9,
    name: "The Globe",
    shelves: [
      { id: "s1", width: 5, height: 2, blockedCells: [{x: 2, y: 0}, {x: 2, y: 1}] },
      { id: "s2", width: 5, height: 2, blockedCells: [{x: 2, y: 0}, {x: 2, y: 1}] },
    ],
    books: [
      { id: "b1", width: 2, height: 2, color: "bg-blue-800", title: "Oceans", pattern: "lines" },
      { id: "b2", width: 2, height: 2, color: "bg-emerald-900", title: "Forests", pattern: "dots" },
      { id: "b3", width: 2, height: 2, color: "bg-amber-800", title: "Deserts", pattern: "diamonds" },
      { id: "b4", width: 2, height: 2, color: "bg-stone-800", title: "Mountains", pattern: "double-lines" },
    ],
  },
  {
    id: 10,
    name: "Handle with Care",
    shelves: [
      { id: "s1", width: 4, height: 3 },
    ],
    books: [
      { id: "b1", width: 2, height: 1, color: "bg-red-800", title: "Glass", pattern: "none", fragile: true },
      { id: "b2", width: 2, height: 1, color: "bg-red-900", title: "Porcelain", pattern: "none", fragile: true },
      { id: "b3", width: 2, height: 1, color: "bg-stone-900", title: "Iron", pattern: "lines", heavy: true },
      { id: "b4", width: 2, height: 1, color: "bg-stone-800", title: "Lead", pattern: "lines", heavy: true },
      { id: "b5", width: 2, height: 1, color: "bg-amber-700", title: "Wood", pattern: "dots" },
      { id: "b6", width: 2, height: 1, color: "bg-amber-800", title: "Stone", pattern: "dots" },
    ],
  },
  {
    id: 11,
    name: "Spinning Words",
    shelves: [
      { id: "s1", width: 4, height: 4 },
    ],
    books: [
      { id: "b1", width: 1, height: 3, color: "bg-blue-900", title: "Tall Tales", pattern: "stars", rotatable: true },
      { id: "b2", width: 2, height: 1, color: "bg-emerald-800", title: "Wide World", pattern: "lines", rotatable: true },
      { id: "b3", width: 1, height: 2, color: "bg-red-900", title: "Short Stories", pattern: "dots", rotatable: true },
      { id: "b4", width: 2, height: 2, color: "bg-amber-800", title: "Square Pegs", pattern: "diamonds" },
      { id: "b5", width: 3, height: 1, color: "bg-stone-700", title: "Long Form", pattern: "none", rotatable: true },
      { id: "b6", width: 1, height: 1, color: "bg-stone-900", title: "Dot", pattern: "none" },
    ],
  },
  {
    id: 12,
    name: "The Master Librarian",
    constraints: { timeLimit: 60, moveLimit: 10 },
    shelves: [
      { id: "s1", width: 5, height: 3, blockedCells: [{x: 2, y: 1}] },
      { id: "s2", width: 4, height: 2 },
    ],
    books: [
      { id: "b1", width: 2, height: 2, color: "bg-stone-900", title: "Encyclopedia I", pattern: "lines", heavy: true, rotatable: true },
      { id: "b2", width: 2, height: 2, color: "bg-stone-800", title: "Encyclopedia II", pattern: "lines", heavy: true, rotatable: true },
      { id: "b3", width: 3, height: 1, color: "bg-red-800", title: "Poems", pattern: "dots", fragile: true },
      { id: "b4", width: 1, height: 3, color: "bg-blue-900", title: "Atlas", pattern: "stars", rotatable: true },
      { id: "b5", width: 2, height: 1, color: "bg-emerald-900", title: "Recipes", pattern: "diamonds" },
      { id: "b6", width: 1, height: 2, color: "bg-amber-700", title: "Diary", pattern: "none", fragile: true },
      { id: "b7", width: 2, height: 1, color: "bg-amber-900", title: "Ledger", pattern: "double-lines" },
      { id: "b8", width: 1, height: 1, color: "bg-red-900", title: "Notes", pattern: "none" },
    ],
  },
];
