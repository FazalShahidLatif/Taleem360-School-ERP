import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Search, 
  BookOpen, 
  Gift, 
  ArrowRight,
  Printer,
  Lightbulb,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Heart as HeartIcon,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { jsPDF } from "jspdf";

// ==========================================
// DATA STRUCTURES & DEFINITIONS
// ==========================================

interface ResourcePack {
  id: string;
  title: string;
  category: "phonics" | "numbers" | "coloring";
  categoryLabel: string;
  ageGroup: string;
  pages: number;
  description: string;
  highlights: string[];
  skills: string[];
}

const RESOURCE_PACKS: ResourcePack[] = [
  {
    id: "alphabet-aa-mega",
    title: "Phonics & Alphabet A-Z Mega Pack",
    category: "phonics",
    categoryLabel: "Phonics & Alphabet",
    ageGroup: "Ages 3-6 (Pre-K / Kindergarten)",
    pages: 52,
    description: "A comprehensive worksheet compilation for teaching letter identification, sound correlation, tracing grids, and vocabulary associations for all 26 letters of the English alphabet.",
    highlights: ["Interactive letter tracing templates", "Initial sound recognition grids", "Hands-on vocabulary illustrations"],
    skills: ["Phonemic Awareness", "Fine Motor Skills", "Letter Writing"]
  },
  {
    id: "alphabet-v1",
    title: "Alphabet Tracing Workbook (Edition 1)",
    category: "phonics",
    categoryLabel: "Phonics & Alphabet",
    ageGroup: "Ages 3-5 (Toddler / Pre-K)",
    pages: 28,
    description: "Simple, spacious stroke-by-stroke guides to help early learners master the upper and lower-case shapes with friendly guided tracing dots.",
    highlights: ["Symmetrical tracking indicators", "Uppercase and lowercase pairing", "Large fonts for small fingers"],
    skills: ["Alphabet Shape Recognition", "Grip & Pen Control", "Tracing Fundamentals"]
  },
  {
    id: "alphabet-v2",
    title: "Phonics & Spelling Workbook (Edition 2)",
    category: "phonics",
    categoryLabel: "Phonics & Alphabet",
    ageGroup: "Ages 4-6 (Kindergarten / Grade 1)",
    pages: 32,
    description: "Advanced phonics worksheets focused on blending letter sounds, short vowels, and recognizing sight words through visual associations.",
    highlights: ["Short-vowel matching exercises", "Easy sight-word puzzles", "Letter-blending workbook"],
    skills: ["Phonics Blending", "Early Vocabulary", "Sight Word Identification"]
  },
  {
    id: "alphabet-v3",
    title: "Letter Sound & Picture Match (Edition 3)",
    category: "phonics",
    categoryLabel: "Phonics & Alphabet",
    ageGroup: "Ages 4-6 (Kindergarten)",
    pages: 24,
    description: "Fun pictorial worksheets designed to connect initial phonetic letter sounds to everyday objects, animals, and fruits.",
    highlights: ["Connect-the-dots visual matching", "Phonetic audio-cue associations", "Letter-to-picture coloring prompts"],
    skills: ["Initial Sounds", "Auditory Discrimination", "Association Logic"]
  },
  {
    id: "numbers-v1",
    title: "Numbers 1-10 Counting Workbook (Edition 1)",
    category: "numbers",
    categoryLabel: "Numbers & Math",
    ageGroup: "Ages 3-5 (Pre-K)",
    pages: 15,
    description: "Gentle introduction to quantities and early counting. High-contrast tracing shapes paired with visual block counts.",
    highlights: ["Visual hand-sign blocks", "Ten-frame grid representations", "Large number tracing sheets"],
    skills: ["Number Concept 1-10", "One-to-One Correspondence", "Numeral Tracing"]
  },
  {
    id: "numbers-v2",
    title: "Math & Counting Match-Up (Edition 2)",
    category: "numbers",
    categoryLabel: "Numbers & Math",
    ageGroup: "Ages 4-6 (Pre-K / Kindergarten)",
    pages: 20,
    description: "Exciting count-and-match exercises. Prompts children to count sets of objects and draw lines to correct numeric characters.",
    highlights: ["Diverse icon groups for counting", "Number line navigation", "Dynamic coloring elements"],
    skills: ["Cardinality", "Set Matching", "Basic Numeric Literacy"]
  },
  {
    id: "numbers-v3",
    title: "Simple Addition & Math Flashcards (Edition 3)",
    category: "numbers",
    categoryLabel: "Numbers & Math",
    ageGroup: "Ages 5-7 (Kindergarten / Grade 1)",
    pages: 25,
    description: "Ready-to-print math cards and worksheets that teach simple addition equations using real-life objects and counting shapes.",
    highlights: ["Printable cut-out math flashcards", "Simple single-digit additions", "Illustrated equation grids"],
    skills: ["Basic Addition", "Visual Arithmetic", "Fast Number Facts"]
  },
  {
    id: "shapes-pack",
    title: "Geometric Shapes & Pattern Play",
    category: "numbers",
    categoryLabel: "Numbers & Math",
    ageGroup: "Ages 3-6 (Pre-K / Kindergarten)",
    pages: 18,
    description: "Interactive sheets for recognizing, tracing, coloring, and finding fundamental shapes in everyday environments.",
    highlights: ["Identify circles, squares, and triangles", "Pattern completion challenges", "Symmetry tracing exercises"],
    skills: ["Geometry Basics", "Pattern Tracking", "Visual Sorting"]
  },
  {
    id: "fruits-pack",
    title: "Fruits Vocabulary, Trace & Color",
    category: "coloring",
    categoryLabel: "Vocabulary & Coloring",
    ageGroup: "Ages 2-5 (Toddlers / Pre-K)",
    pages: 16,
    description: "A wonderful sensory activity packet to teach fruit vocabulary names while practicing fine coloring inside bold borders.",
    highlights: ["Extra-bold borders for coloring", "Dotted name tracing beneath drawings", "Fruity color-by-numbers page"],
    skills: ["Fruit Nomenclature", "Hand-Eye Coordination", "Color Discrimination"]
  },
  {
    id: "vegetables-pack",
    title: "Vegetables Trace, Match & Workbook",
    category: "coloring",
    categoryLabel: "Vocabulary & Coloring",
    ageGroup: "Ages 3-6 (Pre-K / Kindergarten)",
    pages: 18,
    description: "Help youngsters learn about nutritious garden vegetables with these high-contrast identification and spelling tracing worksheets.",
    highlights: ["Letter tracing for vegetable names", "Match the veggie to its shadow", "Fun gardening illustrations"],
    skills: ["Vegetable Recognition", "Shadow Matching", "Beginning Spelling"]
  },
  {
    id: "vehicles-pack",
    title: "Vehicles & Transport Coloring Book",
    category: "coloring",
    categoryLabel: "Vocabulary & Coloring",
    ageGroup: "Ages 3-6 (Pre-K / Kindergarten)",
    pages: 22,
    description: "Printable transportation flashcards and full-page coloring illustrations featuring cars, trains, airplanes, and ships.",
    highlights: ["Air, water, and road categorization", "Action tracing sounds (Choo choo!)", "Full-sheet detailed coloring"],
    skills: ["Vehicle Classification", "Sound Association", "Creative Coloring"]
  }
];

// List of alphabetic words & simple illustrations mapped
const ALPHABET_DATA = [
  { char: "A", word: "Apple", desc: "A is for Apple, sweet and red!" },
  { char: "B", word: "Banana", desc: "B is for Banana, peeling is fun!" },
  { char: "C", word: "Car", desc: "C is for Car, beep beep!" },
  { char: "D", word: "Dog", desc: "D is for Dog, wagging its tail!" },
  { char: "E", word: "Egg", desc: "E is for Egg, oval and white!" },
  { char: "F", word: "Fish", desc: "F is for Fish, swimming around!" },
  { char: "G", word: "Grapes", desc: "G is for Grapes, juicy and sweet!" },
  { char: "H", word: "Heart", desc: "H is for Heart, full of love!" },
  { char: "I", word: "Ice", desc: "I is for Ice, cold and chilly!" },
  { char: "J", word: "Jar", desc: "J is for Jar, holding honey!" },
  { char: "K", word: "Kite", desc: "K is for Kite, flying high!" },
  { char: "L", word: "Leaf", desc: "L is for Leaf, falling down!" },
  { char: "M", word: "Melon", desc: "M is for Melon, fresh and green!" },
  { char: "N", word: "Net", desc: "N is for Net, catch the ball!" },
  { char: "O", word: "Orange", desc: "O is for Orange, round and bright!" },
  { char: "P", word: "Pen", desc: "P is for Pen, write your name!" },
  { char: "Q", word: "Queen", desc: "Q is for Queen, wears a crown!" },
  { char: "R", word: "Rocket", desc: "R is for Rocket, blast off!" },
  { char: "S", word: "Star", desc: "S is for Star, shining bright!" },
  { char: "T", word: "Tomato", desc: "T is for Tomato, red and round!" },
  { char: "U", word: "Umbrella", desc: "U is for Umbrella, blocks the rain!" },
  { char: "V", word: "Van", desc: "V is for Van, driving down!" },
  { char: "W", word: "Water", desc: "W is for Water, splash splash!" },
  { char: "X", word: "Xylophone", desc: "X is for Xylophone, play a tune!" },
  { char: "Y", word: "Yarn", desc: "Y is for Yarn, cozy and warm!" },
  { char: "Z", word: "Zebra", desc: "Z is for Zebra, black and white stripes!" }
];

const NUMBERS_DATA = [
  { num: "1", word: "One", item: "Star" },
  { num: "2", word: "Two", item: "Hearts" },
  { num: "3", word: "Three", item: "Apples" },
  { num: "4", word: "Four", item: "Blocks" },
  { num: "5", word: "Five", item: "Grapes" },
  { num: "6", word: "Six", item: "Stars" },
  { num: "7", word: "Seven", item: "Hearts" },
  { num: "8", word: "Eight", item: "Apples" },
  { num: "9", word: "Nine", item: "Blocks" },
  { num: "10", word: "Ten", item: "Grapes" }
];

const SHAPES_DATA = [
  "Circle", "Square", "Triangle", "Star", "Heart", "Oval", "Hexagon", "Pentagon"
];

const FRUITS_DATA = [
  "Apple", "Banana", "Orange", "Strawberry", "Grapes", "Watermelon", "Mango", "Cherry"
];

const VEGETABLES_DATA = [
  "Carrot", "Tomato", "Potato", "Broccoli", "Peas", "Corn", "Eggplant", "Onion"
];

const VEHICLES_DATA = [
  "Car", "Bus", "Train", "Airplane", "Boat", "Rocket", "Truck", "Helicopter"
];

// ==========================================
// DYNAMIC WORKsheet SOLVER (PAGE RESOLVER)
// ==========================================

interface PageDetails {
  title: string;
  subtitle: string;
  type: "dedication" | "tracing" | "coloring" | "math" | "matching" | "certificate";
  payload: any;
}

function resolvePageDetails(packId: string, pageNum: number, childName: string): PageDetails {
  const nameToUse = childName.trim() || "Your Name";

  // Page 1 is ALWAYS the custom dedication page
  if (pageNum === 1) {
    return {
      title: "This Workbook Belongs To",
      subtitle: "Personalized Educational Printable Workbook",
      type: "dedication",
      payload: { childName: nameToUse }
    };
  }

  switch (packId) {
    case "alphabet-aa-mega": {
      // 52 pages: Page 1 Dedication, Pages 2-51 are Letters A-Z (2 pages per letter), Page 52 is Certificate
      if (pageNum === 52) {
        return {
          title: "Certificate of Achievement",
          subtitle: "Phonics & Alphabet Mastery",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for completing the 52-page Phonics & Alphabet Mega Worksheets" }
        };
      }
      const letterIndex = Math.floor((pageNum - 2) / 2);
      const isOdd = (pageNum - 2) % 2 === 0; // Page 2, 4, 6...
      const data = ALPHABET_DATA[letterIndex % ALPHABET_DATA.length];

      if (isOdd) {
        return {
          title: `Letter ${data.char} Capital Tracing`,
          subtitle: `${data.char} is for ${data.word}`,
          type: "tracing",
          payload: { char: data.char, lowercase: data.char.toLowerCase(), word: data.word, uppercaseOnly: true }
        };
      } else {
        return {
          title: `Letter ${data.char.toLowerCase()} Practice & Coloring`,
          subtitle: `${data.desc}`,
          type: "coloring",
          payload: { char: data.char, word: data.word, lowercaseOnly: true }
        };
      }
    }

    case "alphabet-v1": {
      // 28 pages: Page 1 Dedication, Page 2-27 are letters A-Z (1 per page), Page 28 is Certificate
      if (pageNum === 28) {
        return {
          title: "Certificate of Handwriting",
          subtitle: "Alphabet Pen Control Completed",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for successfully mastering uppercase and lowercase line tracing" }
        };
      }
      const data = ALPHABET_DATA[(pageNum - 2) % ALPHABET_DATA.length];
      return {
        title: `Alphabet Tracing - Letter ${data.char}`,
        subtitle: `Practice tracing upper and lower-case '${data.char}' inside the school guidelines.`,
        type: "tracing",
        payload: { char: data.char, lowercase: data.char.toLowerCase(), word: data.word }
      };
    }

    case "alphabet-v2": {
      // 32 pages: Page 1 Dedication, 2-6 Vowels, 7-16 Sight words, 17-31 Blends, 32 Certificate
      if (pageNum === 32) {
        return {
          title: "Spelling Star Award",
          subtitle: "Sight Words & Blends Accomplished",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for completing the advanced Letter-Blending and Phonics workbook" }
        };
      }
      if (pageNum >= 2 && pageNum <= 6) {
        const vowels = ["A", "E", "I", "O", "U"];
        const v = vowels[pageNum - 2];
        const vWord = v === "A" ? "Ant" : v === "E" ? "Elk" : v === "I" ? "Ink" : v === "O" ? "Owl" : "Urn";
        return {
          title: `Vowel Practice: Letter ${v}`,
          subtitle: `Trace the vowel sound and color the ${vWord}!`,
          type: "tracing",
          payload: { char: v, lowercase: v.toLowerCase(), word: vWord }
        };
      }
      if (pageNum >= 7 && pageNum <= 16) {
        const sightWords = ["THE", "AND", "LIKE", "YOU", "SHE", "HAVE", "WITH", "THIS", "PLAY", "HERE"];
        const word = sightWords[pageNum - 7];
        return {
          title: `Sight Word: ${word}`,
          subtitle: `Trace the high-frequency sight word and write it in the empty block.`,
          type: "tracing",
          payload: { char: word[0], lowercase: word.toLowerCase(), word: word, isSightWord: true }
        };
      }
      // Blends (17-31)
      const blends = ["at", "an", "op", "ig", "un", "ed", "ip", "og", "ub", "et", "ad", "ox", "in", "ap", "ug"];
      const blend = blends[pageNum - 17];
      return {
        title: `Phonics Blend: -${blend}`,
        subtitle: `Complete words ending with -${blend} (e.g. c-${blend}, m-${blend}, h-${blend})`,
        type: "matching",
        payload: { blend: blend, examples: [`c${blend}`, `m${blend}`, `b${blend}`, `p${blend}`] }
      };
    }

    case "alphabet-v3": {
      // 24 pages: Page 1 Dedication, 2-23 letters (A to V), 24 Certificate
      if (pageNum === 24) {
        return {
          title: "Phonics Sound Award",
          subtitle: "Initial Sounds Mastery Certificate",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for connecting letters to their phoneme sounds correctly" }
        };
      }
      const data = ALPHABET_DATA[(pageNum - 2) % ALPHABET_DATA.length];
      return {
        title: `Phonics Match: Letter ${data.char}`,
        subtitle: `Identify the letter sound, trace the word, and connect the dots.`,
        type: "coloring",
        payload: { char: data.char, word: data.word, withConnectLine: true }
      };
    }

    case "numbers-v1": {
      // 15 pages: Page 1 Dedication, 2-11 numbers (1-10), 12-14 math blocks, 15 Certificate
      if (pageNum === 15) {
        return {
          title: "Math Wizard Certificate",
          subtitle: "Numbers 1-10 counting mastery",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for counting, drawing and writing numerals from 1 to 10" }
        };
      }
      if (pageNum >= 2 && pageNum <= 11) {
        const data = NUMBERS_DATA[pageNum - 2];
        return {
          title: `Number ${data.num} Writing & Counting`,
          subtitle: `Trace the numeral ${data.num} and count the ${data.item}!`,
          type: "math",
          payload: { num: data.num, word: data.word, count: parseInt(data.num), item: data.item }
        };
      }
      // 12-14 math blocks
      const countIndex = pageNum - 12 + 4;
      return {
        title: `Math Practice: Set Comparison`,
        subtitle: `Compare quantities and color the box with more shapes.`,
        type: "math",
        payload: { num: `${countIndex}`, word: "Comparison", count: countIndex, item: "Star", compareMode: true }
      };
    }

    case "numbers-v2": {
      // 20 pages: Page 1 Dedication, 2-19 Math counting match-ups, 20 Certificate
      if (pageNum === 20) {
        return {
          title: "Super Counter Badge",
          subtitle: "Advanced counting exercises completed",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for completing 20 printable worksheets of sets and counting matches" }
        };
      }
      const count = ((pageNum - 2) % 10) + 1;
      const shapes = ["Heart", "Star", "Circle", "Apple", "Leaf"];
      const shape = shapes[pageNum % shapes.length];
      return {
        title: `Count and Match: ${shape}s`,
        subtitle: `Draw lines to connect the groups on the left with the numerals on the right.`,
        type: "matching",
        payload: { leftItems: Array(count).fill(shape), rightValue: count }
      };
    }

    case "numbers-v3": {
      // 25 pages: Page 1 Dedication, 2-24 Additions, 25 Cert
      if (pageNum === 25) {
        return {
          title: "Addition Champion Certificate",
          subtitle: "Single Digit Adding Accomplishment",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for completing single-digit math equation worksheets" }
        };
      }
      const a = ((pageNum - 1) % 5) + 1;
      const b = ((pageNum * 2) % 4) + 1;
      return {
        title: `Visual Addition: ${a} + ${b}`,
        subtitle: `Count the stars in both groups, add them up, and write the answer in the box!`,
        type: "math",
        payload: { equation: `${a} + ${b} = ?`, valA: a, valB: b, sum: a + b }
      };
    }

    case "shapes-pack": {
      if (pageNum === 18) {
        return {
          title: "Geometry Genius Badge",
          subtitle: "Shapes & Pattern Mastery",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for identifying and writing shapes like Circles, Squares, and Triangles" }
        };
      }
      const idx = (pageNum - 2) % SHAPES_DATA.length;
      const shape = SHAPES_DATA[idx];
      return {
        title: `Trace & Draw: ${shape}`,
        subtitle: `Trace the dotted outline of the ${shape} and color it in!`,
        type: "coloring",
        payload: { isShape: true, name: shape }
      };
    }

    case "fruits-pack": {
      if (pageNum === 16) {
        return {
          title: "Healthy Fruits Explorer",
          subtitle: "Fruit Vocabulary & Trace Certificate",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for tracing and coloring 16 delicious varieties of harvest fruits" }
        };
      }
      const idx = (pageNum - 2) % FRUITS_DATA.length;
      const fruit = FRUITS_DATA[idx];
      return {
        title: `Fruit Tracing: ${fruit}`,
        subtitle: `Trace the fruit word '${fruit}' and color the outline of the crop.`,
        type: "coloring",
        payload: { isFruit: true, name: fruit }
      };
    }

    case "vegetables-pack": {
      if (pageNum === 18) {
        return {
          title: "Garden Expert Award",
          subtitle: "Vegetables trace and match complete",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for learning the spellings and shapes of key garden vegetables" }
        };
      }
      const idx = (pageNum - 2) % VEGETABLES_DATA.length;
      const veg = VEGETABLES_DATA[idx];
      return {
        title: `Vegetable Tracing: ${veg}`,
        subtitle: `Trace the vegetable name and fill in the outline with matching garden colors.`,
        type: "coloring",
        payload: { isVegetable: true, name: veg }
      };
    }

    case "vehicles-pack": {
      if (pageNum === 22) {
        return {
          title: "Master Transportation Pilot",
          subtitle: "Vehicles & Craft Coloring Complete",
          type: "certificate",
          payload: { childName: nameToUse, desc: "for coloring and spelling various terrestrial, marine, and aerospace vehicles" }
        };
      }
      const idx = (pageNum - 2) % VEHICLES_DATA.length;
      const vehicle = VEHICLES_DATA[idx];
      return {
        title: `Vehicle Tracing: ${vehicle}`,
        subtitle: `Color the outline of the vehicle and trace the letters beneath.`,
        type: "coloring",
        payload: { isVehicle: true, name: vehicle }
      };
    }

    default:
      return {
        title: "Standard Worksheet Page",
        subtitle: "Interactive Learning Workbook",
        type: "dedication",
        payload: { childName: nameToUse }
      };
  }
}

// ==========================================
// HIGH-FIDELITY INLINE OUTLINE DRAWINGS (SVG)
// ==========================================

const OutlineIllustrator: React.FC<{ type: string; name: string }> = ({ type, name }) => {
  const norm = name.toLowerCase();

  // Draw simple recognizable vectors
  if (norm === "apple") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Apple body */}
        <path d="M50,35 C35,22 15,35 15,60 C15,85 35,90 50,82 C65,90 85,85 85,60 C85,35 65,22 50,35 Z" strokeDasharray="3,3" />
        {/* Stem */}
        <path d="M50,30 C50,20 60,15 62,15" />
        {/* Leaf */}
        <path d="M50,25 C55,20 65,22 62,28 C57,30 52,28 50,25 Z" fill="none" />
      </svg>
    );
  }

  if (norm === "banana") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20,25 C45,22 75,40 80,75 C60,75 35,55 20,25 Z" strokeDasharray="3,3" />
        <path d="M18,22 C22,23 20,28 20,25" />
      </svg>
    );
  }

  if (norm === "orange" || norm === "circle") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="50" cy="50" r="35" strokeDasharray="3,3" />
        {norm === "orange" && (
          <>
            <path d="M50,15 C52,10 58,12 56,15" />
            <circle cx="50" cy="40" r="1" fill="currentColor" />
            <circle cx="60" cy="55" r="1" fill="currentColor" />
            <circle cx="40" cy="60" r="1" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  if (norm === "strawberry") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M50,20 C75,20 80,50 65,80 C55,90 45,90 35,80 C20,50 25,20 50,20 Z" strokeDasharray="3,3" />
        {/* Seeds */}
        <circle cx="40" cy="40" r="1" fill="currentColor" />
        <circle cx="60" cy="40" r="1" fill="currentColor" />
        <circle cx="50" cy="55" r="1" fill="currentColor" />
        <circle cx="45" cy="70" r="1" fill="currentColor" />
        <circle cx="55" cy="70" r="1" fill="currentColor" />
        {/* Crown leaves */}
        <path d="M35,20 C45,25 55,25 65,20 C60,15 50,18 35,20 Z" />
      </svg>
    );
  }

  if (norm === "star") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M50,10 L62,38 L92,38 L68,56 L78,85 L50,67 L22,85 L32,56 L8,38 L38,38 Z" strokeDasharray="3,3" />
      </svg>
    );
  }

  if (norm === "heart" || norm === "hearts") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M50,30 C50,15 25,15 25,35 C25,60 50,85 50,85 C50,85 75,60 75,35 C75,15 50,15 50,30 Z" strokeDasharray="3,3" />
      </svg>
    );
  }

  if (norm === "square") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="20" y="20" width="60" height="60" strokeDasharray="3,3" rx="4" />
      </svg>
    );
  }

  if (norm === "triangle") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polygon points="50,15 15,80 85,80" strokeDasharray="3,3" />
      </svg>
    );
  }

  if (norm === "car") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M15,60 H85 V45 C85,45 75,42 68,35 H32 L22,45 C22,45 15,48 15,60 Z" strokeDasharray="3,3" />
        <circle cx="32" cy="65" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="68" cy="65" r="10" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    );
  }

  if (norm === "rocket") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        {/* Nose cone */}
        <path d="M50,10 C42,25 40,40 40,65 H60 C60,40 58,25 50,10 Z" strokeDasharray="3,3" />
        {/* Fins */}
        <path d="M40,55 L25,70 L30,80 L40,75" />
        <path d="M60,55 L75,70 L70,80 L60,75" />
        {/* Thruster fire */}
        <path d="M45,80 L50,95 L55,80 Z" />
      </svg>
    );
  }

  if (norm === "carrot") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M50,15 C60,15 62,25 55,60 L50,90 L45,60 C38,25 40,15 50,15 Z" strokeDasharray="3,3" />
        <path d="M50,15 C52,5 58,10 55,15" />
        <path d="M50,15 C48,5 42,10 45,15" />
      </svg>
    );
  }

  if (norm === "tomato") {
    return (
      <svg className="w-36 h-36 mx-auto text-slate-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="50" cy="55" rx="35" ry="28" strokeDasharray="3,3" />
        <path d="M50,27 L53,20 L47,20 Z" />
        <path d="M50,27 C54,23 60,25 60,27" />
        <path d="M50,27 C46,23 40,25 40,27" />
      </svg>
    );
  }

  // Fallback visual illustration
  return (
    <div className="w-36 h-36 mx-auto border-4 border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center p-4">
      <FileText className="w-10 h-10 text-slate-400 mb-1" />
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center truncate w-full">
        {name}
      </span>
    </div>
  );
};

// ==========================================
// DYNAMIC WORKBOOK COMPILER (jsPDF BUILDER)
// ==========================================

function compileWorkbookPDF(pack: ResourcePack, childName: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const totalPages = pack.pages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const details = resolvePageDetails(pack.id, pageNum, childName);

    // Page Border and Header
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, 194, 281); // standard high border

    // Brand and series
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("TALEEM360 EARLY LEARNING WORKBOOKS", 12, 14);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`Workbook ID: ${pack.id} | Page ${pageNum} of ${totalPages}`, 190 - doc.getTextWidth(`Workbook ID: ${pack.id} | Page ${pageNum} of ${totalPages}`) / 2, 14);

    // Main Header Divider Line
    doc.setDrawColor(230, 230, 230);
    doc.line(10, 17, 200, 17);

    // Page Title
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(20, 30, 40);
    doc.text(details.title.toUpperCase(), 15, 26);

    // Subtitle
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(80, 90, 100);
    doc.text(details.subtitle, 15, 31);

    // RENDER SPECIFIC CONTENT TYPES
    if (details.type === "dedication") {
      // Large beautifully centered dedication frame
      doc.setDrawColor(16, 185, 129); // Emerald border
      doc.setLineWidth(1.5);
      doc.rect(20, 50, 170, 180);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(16, 185, 129);
      doc.text("THIS WORKBOOK", 105 - doc.getTextWidth("THIS WORKBOOK") / 2, 85);
      doc.text("BELONGS TO:", 105 - doc.getTextWidth("BELONGS TO:") / 2, 100);

      // Child name line
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.8);
      doc.line(35, 145, 175, 145);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(20, 30, 40);
      const name = details.payload.childName;
      doc.text(name, 105 - doc.getTextWidth(name) / 2, 140);

      // Footer notice inside frame
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text("Print this book at home or classroom for fine pen tracing and coloring.", 105 - doc.getTextWidth("Print this book at home or classroom for fine pen tracing and coloring.") / 2, 180);
      doc.text("Approved & Compiled by Taleem360 Academics Platform", 105 - doc.getTextWidth("Approved & Compiled by Taleem360 Academics Platform") / 2, 192);

    } else if (details.type === "tracing") {
      const p = details.payload;
      
      // Top guidance block
      doc.setDrawColor(240, 240, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 38, 180, 45, "F");

      // Giant Letter Display
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(54);
      doc.setTextColor(20, 30, 40);
      doc.text(`${p.char} ${p.lowercase || ""}`, 25, 72);

      // Keyword block
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(16, 185, 129);
      doc.text(p.word || "", 110, 60);

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Trace letter ${p.char} inside guidelines.`, 110, 68);

      // Handwriting tracing grids (Draw 4-line guidelines)
      let startY = 100;
      for (let gridIdx = 0; gridIdx < 4; gridIdx++) {
        // Draw the 4 lines
        const gy = startY + gridIdx * 40;
        doc.setLineWidth(0.2);
        
        // Line 1: Top blue
        doc.setDrawColor(173, 216, 230);
        doc.line(15, gy, 195, gy);

        // Line 2: Mid dashed
        doc.setDrawColor(200, 200, 200);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(15, gy + 8, 195, gy + 8);

        // Line 3: Mid solid
        doc.setLineDashPattern([], 0);
        doc.setDrawColor(255, 182, 193); // Pink
        doc.line(15, gy + 16, 195, gy + 16);

        // Line 4: Bottom blue
        doc.setDrawColor(173, 216, 230);
        doc.line(15, gy + 24, 195, gy + 24);

        // Draw dotted target character
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(200, 200, 200); // Light gray for tracing
        
        for (let col = 0; col < 6; col++) {
          const colX = 25 + col * 30;
          doc.text(`${p.char}`, colX, gy + 15);
        }
      }

    } else if (details.type === "coloring") {
      const p = details.payload;
      
      // Word Tracing line at top
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(220, 220, 220); // Dotted trace font color
      doc.text(p.word.toUpperCase(), 105 - doc.getTextWidth(p.word.toUpperCase()) / 2, 60);

      doc.setLineWidth(0.3);
      doc.setDrawColor(150, 150, 150);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(20, 65, 190, 65);

      // Outline drawings frame
      doc.setLineDashPattern([], 0);
      doc.setDrawColor(220, 220, 220);
      doc.rect(20, 80, 170, 140);

      // Draw simple geometric shapes/outlines programmatically
      const normName = (p.name || p.word || "").toLowerCase();
      doc.setLineWidth(1.5);
      doc.setDrawColor(40, 40, 40);

      if (normName.includes("apple")) {
        doc.ellipse(105, 150, 40, 35);
        doc.line(105, 115, 115, 100); // stem
      } else if (normName.includes("star")) {
        // Draw 5-point star
        const cx = 105, cy = 150, r = 40;
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const currR = i % 2 === 0 ? r : r / 2;
          points.push({ x: cx + currR * Math.cos(angle), y: cy + currR * Math.sin(angle) });
        }
        for (let i = 0; i < 10; i++) {
          const next = (i + 1) % 10;
          doc.line(points[i].x, points[i].y, points[next].x, points[next].y);
        }
      } else if (normName.includes("circle")) {
        doc.ellipse(105, 150, 40, 40);
      } else if (normName.includes("square")) {
        doc.rect(65, 110, 80, 80);
      } else if (normName.includes("triangle")) {
        doc.triangle(105, 110, 65, 190, 145, 190);
      } else if (normName.includes("heart")) {
        doc.ellipse(90, 140, 20, 20);
        doc.ellipse(120, 140, 20, 20);
        doc.triangle(71, 146, 139, 146, 105, 190);
      } else {
        // Simple rectangular block to color in
        doc.rect(60, 110, 90, 80);
        doc.setFontSize(10);
        doc.text("COLOR ME!", 105 - doc.getTextWidth("COLOR ME!") / 2, 150);
      }

      // Tracing prompts at the bottom
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("Trace the spelling letters above, then color the graphic inside the borders.", 105 - doc.getTextWidth("Trace the spelling letters above, then color the graphic inside the borders.") / 2, 245);

    } else if (details.type === "math") {
      const p = details.payload;

      if (p.compareMode) {
        // Group columns
        doc.setDrawColor(220, 220, 220);
        doc.rect(20, 50, 75, 120);
        doc.rect(115, 50, 75, 120);

        // Draw counting items
        doc.setLineWidth(0.5);
        doc.setDrawColor(60, 60, 60);
        for (let i = 0; i < parseInt(p.num); i++) {
          const cy1 = 65 + i * 18;
          doc.ellipse(57, cy1, 6, 6);
          if (i < 3) {
            doc.ellipse(152, cy1, 6, 6);
          }
        }

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(30, 40, 50);
        doc.text(`Set A: ${p.num} items`, 30, 185);
        doc.text(`Set B: 3 items`, 128, 185);

      } else if (p.equation) {
        // Big equation presentation
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(36);
        doc.setTextColor(20, 30, 40);
        doc.text(p.equation, 105 - doc.getTextWidth(p.equation) / 2, 80);

        // Drawing calculation blocks
        doc.setLineWidth(1);
        doc.setDrawColor(16, 185, 129);
        doc.rect(40, 110, 50, 50);
        doc.rect(120, 110, 50, 50);

        // Math symbols
        doc.setFontSize(28);
        doc.text("+", 102, 140);
        doc.text("=", 180, 140);

        // Little visual dots to count
        doc.setDrawColor(100, 100, 100);
        for (let i = 0; i < p.valA; i++) {
          const offset = i * 8;
          doc.ellipse(50 + offset, 135, 3, 3);
        }
        for (let i = 0; i < p.valB; i++) {
          const offset = i * 8;
          doc.ellipse(130 + offset, 135, 3, 3);
        }

        // Answer input block
        doc.setDrawColor(16, 185, 129);
        doc.rect(75, 190, 60, 40);
        doc.setFontSize(10);
        doc.text("WRITE ANSWER", 90, 212);
      } else {
        // Simple numeric card
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(80);
        doc.text(`${p.num}`, 105 - doc.getTextWidth(`${p.num}`) / 2, 100);

        doc.setFontSize(24);
        doc.text(`${p.word.toUpperCase()}`, 105 - doc.getTextWidth(`${p.word.toUpperCase()}`) / 2, 130);

        // Set representation
        doc.setLineWidth(0.5);
        doc.setDrawColor(100, 100, 100);
        for (let i = 0; i < p.count; i++) {
          const colX = 35 + (i % 5) * 30;
          const rowY = 170 + Math.floor(i / 5) * 30;
          doc.ellipse(colX, rowY, 8, 8);
        }
      }

    } else if (details.type === "matching") {
      const p = details.payload;
      
      // Interactive matching columns
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("ITEMS ON THE LEFT", 20, 60);
      doc.text("NUMBERS ON THE RIGHT", 140, 60);

      doc.setLineWidth(0.5);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 65, 190, 65);

      // Draw rows
      for (let row = 0; row < 5; row++) {
        const ry = 90 + row * 35;
        doc.ellipse(30, ry, 6, 6);
        doc.circle(45, ry, 1, "F");

        doc.circle(150, ry, 1, "F");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`${row + 1}`, 165, ry + 4);
      }

    } else if (details.type === "certificate") {
      const p = details.payload;
      
      // Beautiful certificate border
      doc.setDrawColor(218, 165, 32); // Golden borders
      doc.setLineWidth(2);
      doc.rect(15, 45, 180, 190);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(218, 165, 32);
      doc.text("CERTIFICATE OF ACHIEVEMENT", 105 - doc.getTextWidth("CERTIFICATE OF ACHIEVEMENT") / 2, 75);

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Proudly Awarded To:", 105 - doc.getTextWidth("Proudly Awarded To:") / 2, 105);

      // Child name
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(20, 30, 40);
      doc.text(p.childName, 105 - doc.getTextWidth(p.childName) / 2, 125);

      // Certificate underline
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(35, 132, 175, 132);

      // Course text
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 90, 100);
      doc.text(p.desc, 105 - doc.getTextWidth(p.desc) / 2, 150);

      // Bottom seals and sign blocks
      doc.line(35, 200, 85, 200);
      doc.line(125, 200, 175, 200);

      doc.setFontSize(8);
      doc.text("ACADEMIC SUPERVISOR", 60 - doc.getTextWidth("ACADEMIC SUPERVISOR") / 2, 205);
      doc.text("TALEEM360 ERP PLATFORM", 150 - doc.getTextWidth("TALEEM360 ERP PLATFORM") / 2, 205);

      // Cute golden star seal
      doc.setFillColor(218, 165, 32);
      doc.triangle(105, 180, 98, 195, 112, 195, "F");
    }

    // Add new page if not the last page
    if (pageNum < totalPages) {
      doc.addPage();
    }
  }

  // Save the customized printable document
  doc.save(`${pack.id}-${childName.replace(/\s+/g, "_") || "workbook"}.pdf`);
}

// ==========================================
// REACT PRESENTATION MODULE
// ==========================================

export const FreeResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "phonics" | "numbers" | "coloring">("all");
  const [activePack, setActivePack] = useState<ResourcePack | null>(RESOURCE_PACKS[0]);

  // Customizable properties
  const [childName, setChildName] = useState("");
  const [previewPage, setPreviewPage] = useState(1);
  const [isCompiling, setIsCompiling] = useState(false);
  const [tracingLineStyle, setTracingLineStyle] = useState<"dotted" | "solid" | "light">("dotted");

  const filteredPacks = RESOURCE_PACKS.filter((pack) => {
    const matchesSearch = 
      pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || pack.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePackSelect = (pack: ResourcePack) => {
    setActivePack(pack);
    setPreviewPage(1); // Reset page selection on workbook switch
  };

  const handleDownload = () => {
    if (!activePack) return;
    setIsCompiling(true);
    try {
      compileWorkbookPDF(activePack, childName);
    } catch (err) {
      console.error("PDF Compilation failed", err);
    } finally {
      setIsCompiling(false);
    }
  };

  // Resolve the details for the currently active page in the preview pane
  const activePageDetails = activePack 
    ? resolvePageDetails(activePack.id, previewPage, childName)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER AREA */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold mb-4">
            <Gift className="w-3.5 h-3.5" />
            100% Free Educational Printables
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-none mb-4">
            Free Printable Workbooks & Learning Packs
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Support early childhood development at home or in class with phonics grids, vocabulary tracings, number additions, and coloring sheets. Select a pack to view, print, or adapt.
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 transition-colors"
                placeholder="Search resources, skills or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                All Resources
              </button>
              <button
                onClick={() => setSelectedCategory("phonics")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === "phonics"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                Alphabet & Phonics
              </button>
              <button
                onClick={() => setSelectedCategory("numbers")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === "numbers"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                Numbers & Math
              </button>
              <button
                onClick={() => setSelectedCategory("coloring")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === "coloring"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                Coloring & Vocabulary
              </button>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: RESOURCES GRID */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-emerald-400">
                Available Resource Packs ({filteredPacks.length})
              </h2>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear search
                </button>
              )}
            </div>

            {filteredPacks.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-300 mb-1">No packs found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try adjusting your search terms or select another category filter above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPacks.map((pack) => {
                  const isActive = activePack?.id === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => handlePackSelect(pack)}
                      className={`group p-5 bg-slate-900/40 hover:bg-slate-900/80 border rounded-2xl cursor-pointer text-left transition-all duration-300 hover:border-emerald-500/30 ${
                        isActive 
                          ? "border-emerald-500 ring-1 ring-emerald-500/20 bg-slate-900/90" 
                          : "border-slate-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="inline-block px-2.5 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                          {pack.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <FileText className="w-3 h-3 text-slate-600" />
                          {pack.pages} Pages
                        </span>
                      </div>

                      <h3 className="text-xs font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-1">
                        {pack.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-4">
                        {pack.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] text-slate-500 italic">
                          {pack.ageGroup}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Inspect Pack
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DYNAMIC COMPILER WORKBENCH AREA */}
            {activePack && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Printable Document Configurator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Custom Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-emerald-400" />
                      Add Child's Name (Custom Dedication)
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-white placeholder-slate-500"
                      placeholder="e.g. Ayaan, Emma, Sarah..."
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Dynamically auto-formats onto the frontpage dedication grid!
                    </p>
                  </div>

                  {/* Line Style */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Handwriting Guideline Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTracingLineStyle("dotted")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          tracingLineStyle === "dotted"
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        Dotted Guide
                      </button>
                      <button
                        onClick={() => setTracingLineStyle("solid")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          tracingLineStyle === "solid"
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        Classic Solid
                      </button>
                      <button
                        onClick={() => setTracingLineStyle("light")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          tracingLineStyle === "light"
                            ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        Light Grey
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compilation Status & Core Actions */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-800 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                      <Printer className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Compile {activePack.pages} Printable Pages
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-none mt-1">
                        Client-side high-resolution vector layout assembly.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isCompiling}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black py-3 px-6 rounded-xl text-xs transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/10"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Assembling Pages...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Compile & Download PDF ({activePack.pages} Pages)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: HIGH-FIDELITY WORKSHEET SHEET PREVIEW */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            {activePack && activePageDetails ? (
              <div className="space-y-4">
                
                {/* Visual Sheet Preview Panel */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-900 flex flex-col min-h-[580px] relative">
                  
                  {/* Decorative punch holes for realistic workbook vibe */}
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex flex-col gap-6">
                    <div className="w-3.5 h-3.5 bg-slate-950 border-2 border-slate-200 rounded-full shadow-inner" />
                    <div className="w-3.5 h-3.5 bg-slate-950 border-2 border-slate-200 rounded-full shadow-inner" />
                    <div className="w-3.5 h-3.5 bg-slate-950 border-2 border-slate-200 rounded-full shadow-inner" />
                  </div>

                  {/* Header Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    <span>Taleem360 Early Learners Series</span>
                    <span>Page {previewPage} of {activePack.pages}</span>
                  </div>

                  {/* Main Worksheet Body Area */}
                  <div className="py-6 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                        {activePageDetails.title}
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1.5 font-medium">
                        {activePageDetails.subtitle}
                      </p>
                    </div>

                    {/* DYNAMIC RENDER BY PAGE TYPE */}
                    <div className="my-8 flex-1 flex items-center justify-center">
                      
                      {activePageDetails.type === "dedication" && (
                        <div className="border-4 border-emerald-500 border-double p-6 rounded-xl w-full text-center space-y-4">
                          <h3 className="text-lg font-black text-emerald-600 tracking-wide uppercase">
                            This Worksheet Pack
                          </h3>
                          <div className="text-2xl font-black text-slate-800 tracking-tight">
                            BELONGS TO:
                          </div>
                          
                          {/* Tracing guide style line for name */}
                          <div className="py-3 border-b-2 border-slate-300 font-serif italic text-2xl font-black text-slate-800 min-h-[48px]">
                            {activePageDetails.payload.childName}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            A customized selection of printable educational games, letters, traces, spelling helper cards, and coloring templates.
                          </p>
                        </div>
                      )}

                      {activePageDetails.type === "tracing" && (
                        <div className="w-full space-y-6">
                          
                          {/* Top display card */}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                            <span className="text-6xl font-black font-sans text-slate-950">
                              {activePageDetails.payload.char}
                              <span className="text-slate-400 text-4xl ml-2">
                                {activePageDetails.payload.lowercase}
                              </span>
                            </span>
                            <div className="text-right">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 block">
                                Association Word
                              </span>
                              <span className="text-lg font-black text-slate-800 block">
                                {activePageDetails.payload.word}
                              </span>
                            </div>
                          </div>

                          {/* Handwriting Guides lines */}
                          <div className="space-y-4">
                            {[1, 2, 3].map((g) => (
                              <div key={g} className="relative py-2.5">
                                {/* Top Line (Blue) */}
                                <div className="border-t border-sky-200 w-full" />
                                {/* Dash Line */}
                                <div className="border-t border-dashed border-slate-300 w-full my-2.5" />
                                {/* Bottom Guideline (Pink) */}
                                <div className="border-t-2 border-rose-200 w-full" />
                                {/* Base Guideline (Blue) */}
                                <div className="border-t border-sky-200 w-full mt-2.5" />

                                {/* Dotted Letter Tracing Overlays */}
                                <div className="absolute inset-y-0 left-0 right-0 flex justify-around items-center pt-1">
                                  {[1, 2, 3, 4, 5].map((c) => (
                                    <span 
                                      key={c} 
                                      className={`text-lg font-bold select-none ${
                                        tracingLineStyle === "dotted" 
                                          ? "text-slate-300 stroke-dash" 
                                          : tracingLineStyle === "light" 
                                            ? "text-slate-200" 
                                            : "text-slate-400"
                                      }`}
                                      style={tracingLineStyle === "dotted" ? { letterSpacing: "1px", borderBottom: "none" } : undefined}
                                    >
                                      {activePageDetails.payload.char}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePageDetails.type === "coloring" && (
                        <div className="w-full space-y-4 text-center">
                          {/* Trace word display */}
                          <div className="text-3xl font-bold tracking-widest text-slate-300 uppercase select-none border-b border-dashed border-slate-200 py-2 inline-block">
                            {activePageDetails.payload.word}
                          </div>
                          
                          {/* Beautiful dynamic inline outline drawings */}
                          <OutlineIllustrator type="coloring" name={activePageDetails.payload.name || activePageDetails.payload.word} />

                          <p className="text-[10px] text-slate-400 font-medium italic">
                            Trace the capital letters at the top, then custom-color the outline below.
                          </p>
                        </div>
                      )}

                      {activePageDetails.type === "math" && (
                        <div className="w-full space-y-6 text-center">
                          {activePageDetails.payload.compareMode ? (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center min-h-[140px]">
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {Array.from({ length: parseInt(activePageDetails.payload.num) }).map((_, i) => (
                                    <div key={i} className="w-6 h-6 border-2 border-slate-800 rounded-full" />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-slate-500 mt-3">Group A ({activePageDetails.payload.num})</span>
                              </div>
                              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center min-h-[140px]">
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                  {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="w-6 h-6 border-2 border-slate-800 rounded-full" />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-slate-500 mt-3">Group B (3)</span>
                              </div>
                            </div>
                          ) : activePageDetails.payload.equation ? (
                            <div className="space-y-4">
                              <div className="text-4xl font-extrabold text-slate-900">
                                {activePageDetails.payload.valA} + {activePageDetails.payload.valB} = <span className="inline-block w-12 border-b-2 border-slate-800 h-10"></span>
                              </div>
                              <div className="flex items-center justify-center gap-6 py-4">
                                <div className="flex flex-wrap gap-1 justify-center max-w-[100px]">
                                  {Array.from({ length: activePageDetails.payload.valA }).map((_, i) => (
                                    <div key={i} className="w-4 h-4 border border-slate-800 rounded-sm bg-slate-100" />
                                  ))}
                                </div>
                                <span className="text-xl font-bold">+</span>
                                <div className="flex flex-wrap gap-1 justify-center max-w-[100px]">
                                  {Array.from({ length: activePageDetails.payload.valB }).map((_, i) => (
                                    <div key={i} className="w-4 h-4 border border-slate-800 rounded-sm bg-slate-100" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="text-6xl font-black text-slate-900">
                                {activePageDetails.payload.num}
                              </div>
                              <div className="text-lg font-black text-emerald-600 tracking-wider">
                                {activePageDetails.payload.word.toUpperCase()}
                              </div>
                              <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto pt-2">
                                {Array.from({ length: activePageDetails.payload.count }).map((_, i) => (
                                  <div key={i} className="w-8 h-8 border-2 border-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {i + 1}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activePageDetails.type === "matching" && (
                        <div className="w-full space-y-4">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
                            <span>Draw Line</span>
                            <span>Matching Digit</span>
                          </div>
                          {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="flex items-center justify-between py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border-2 border-slate-900" />
                                <span className="text-xs font-medium text-slate-700">Set Group {idx}</span>
                              </div>
                              <div className="w-full mx-6 border-b border-dotted border-slate-300" />
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-900">{idx * 2 - 1}</span>
                                <div className="w-4 h-4 rounded-full border-2 border-slate-900" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activePageDetails.type === "certificate" && (
                        <div className="border-4 border-amber-400 border-double p-5 rounded-2xl w-full text-center space-y-4 bg-amber-50/20">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 block">
                            Award of Excellence
                          </span>
                          <h3 className="text-base font-black text-slate-900">
                            {activePageDetails.title.toUpperCase()}
                          </h3>
                          <p className="text-xs text-slate-500 leading-normal">
                            This is proudly certificate that:
                          </p>
                          <div className="text-xl font-bold font-serif text-slate-800 border-b border-slate-300 pb-1.5 inline-block min-w-[200px]">
                            {activePageDetails.payload.childName}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                            {activePageDetails.payload.desc}
                          </p>
                          
                          <div className="flex items-center justify-between pt-6 text-[8px] font-bold text-slate-400 uppercase">
                            <div className="border-t border-slate-200 pt-1 w-24">Signature</div>
                            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-600 font-bold">
                              ★
                            </div>
                            <div className="border-t border-slate-200 pt-1 w-24">Date Issued</div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase">
                      <span>Designed & Certified by Taleem360 ERP</span>
                      <span>Approved for Home-use</span>
                    </div>

                  </div>

                </div>

                {/* PAGINATION SWITCHES */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewPage((prev) => Math.max(1, prev - 1))}
                    disabled={previewPage === 1}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev Page
                  </button>

                  <span className="text-xs text-slate-400 font-bold">
                    Page <span className="text-emerald-400">{previewPage}</span> of {activePack.pages}
                  </span>

                  <button
                    onClick={() => setPreviewPage((prev) => Math.min(activePack.pages, prev + 1))}
                    disabled={previewPage === activePack.pages}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Next Page
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-12 text-center h-[580px] flex flex-col items-center justify-center">
                <Printer className="w-10 h-10 text-slate-700 mb-3" />
                <h3 className="text-xs font-bold text-slate-400 mb-1">No active pack selected</h3>
                <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Click on any learning pack in the grid on the left to inspect, preview pages, customize or print.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
