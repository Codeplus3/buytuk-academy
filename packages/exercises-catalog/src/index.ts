// =============================================================================
// BuyTuk Academy - Exercises Catalog Barrel Export
// =============================================================================

export * as arabic from "./arabic/index.js";
export * as english from "./english/index.js";
export * as math from "./math/index.js";

export interface ExerciseCatalog {
  id: string;
  type: "minimal_pairs" | "tongue_twister" | "syllable_drill" | "contextual_reading";
  title: string;
  focus: string[];
  content: Record<string, any>;
  instructions: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  domain: "arabic" | "english" | "math";
}

export function getAllExercises(): ExerciseCatalog[] {
  return [
    ...arabic.getAllExercises(),
    ...english.getAllExercises(),
    ...math.getAllExercises(),
  ];
}

export function getExercisesByDomain(domain: "arabic" | "english" | "math"): ExerciseCatalog[] {
  switch (domain) {
    case "arabic":
      return arabic.getAllExercises();
    case "english":
      return english.getAllExercises();
    case "math":
      return math.getAllExercises();
    default:
      return [];
  }
}

export function getExercisesByType(type: ExerciseCatalog["type"]): ExerciseCatalog[] {
  return getAllExercises().filter((ex) => ex.type === type);
}

export function getExercisesByFocus(focus: string[]): ExerciseCatalog[] {
  return getAllExercises().filter((ex) =>
    ex.focus.some((f) => focus.includes(f))
  );
}

export function getExercisesByDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): ExerciseCatalog[] {
  return getAllExercises().filter((ex) => ex.difficulty === difficulty);
}