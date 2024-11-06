export interface ExerciseInfo {
  name: string;
  description: string;
  muscles: MuscleType[];
  type: ExerciseType[];
  mechanic: MechanicsType;
  level: LevelType;
  instructions: string[];
  images: string[];
}

export type MuscleType =
  | "Chest"
  | "Forearms"
  | "Lats"
  | "Middle Back"
  | "Lower Back"
  | "Neck"
  | "Quadriceps"
  | "Hamstrings"
  | "Calves"
  | "Triceps"
  | "Traps"
  | "Shoulders"
  | "Abdominals"
  | "Glutes"
  | "Biceps"
  | "Adductors"
  | "Abductors";

export type ExerciseType =
  | "Cardio"
  | "Olympic Weightlifting"
  | "Plyometrics"
  | "Powerlifting"
  | "Strength"
  | "Stretching"
  | "Strongman";

export type MechanicsType = "Isolation" | "Compound" | undefined;

export type LevelType = "Beginner" | "Intermediate" | "Expert";
