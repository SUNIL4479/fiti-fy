// ExerciseDB Animated GIF Repository and Dynamic API Fetcher
// Powered directly by https://oss.exercisedb.dev/api/v1/exercises

export interface ExerciseDBItem {
  id: string;
  name: string;
  target: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

// In-memory cache of live-fetched exercises from ExerciseDB
let liveExerciseDbCache: ExerciseDBItem[] = [];
let isFetchingDb = false;

// Curated high-resolution ExerciseDB exercise GIFs using real ExerciseDB IDs and URLs
export const EXERCISE_DB_CATALOG: Record<string, ExerciseDBItem> = {
  pushup: {
    id: "13TpY4H",
    name: "Standard Push-Up",
    target: "Pectorals (Chest)",
    bodyPart: "Chest",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/13TpY4H.gif",
    secondaryMuscles: ["Triceps", "Front Deltoids", "Core"],
    instructions: [
      "Place hands slightly wider than shoulder-width apart.",
      "Lower your body until your chest almost touches the floor.",
      "Push back up to the starting position keeping your core engaged."
    ]
  },
  squat: {
    id: "13VW2VO",
    name: "Bodyweight Air Squat",
    target: "Quadriceps & Glutes",
    bodyPart: "Upper Legs",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/13VW2VO.gif",
    secondaryMuscles: ["Hamstrings", "Calves", "Abs"],
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Hinge at hips and bend knees as if sitting in a chair.",
      "Lower down until thighs are parallel to the ground, then press up through heels."
    ]
  },
  plank: {
    id: "11wrviz",
    name: "Core Isometric Plank",
    target: "Abs & Core Stabilizers",
    bodyPart: "Waist",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/11wrviz.gif",
    secondaryMuscles: ["Shoulders", "Glutes"],
    instructions: [
      "Place forearms on the ground with elbows aligned below shoulders.",
      "Keep body in a straight line from head to heels.",
      "Hold position while breathing deeply and squeezing core."
    ]
  },
  lunge: {
    id: "13VW2VO",
    name: "Alternating Lunge",
    target: "Quads, Glutes & Hamstrings",
    bodyPart: "Upper Legs",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/13VW2VO.gif",
    secondaryMuscles: ["Calves", "Core"],
    instructions: [
      "Step forward with one leg and lower hips until both knees are bent at 90 degrees.",
      "Ensure front knee stays directly above ankle.",
      "Push back up through front heel to starting stance."
    ]
  },
  jumping_jacks: {
    id: "0Yz8WdV",
    name: "Cardio Bear Crawl / Jumping Jacks",
    target: "Cardiovascular Stamina",
    bodyPart: "Full Body",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/0Yz8WdV.gif",
    secondaryMuscles: ["Calves", "Shoulders"],
    instructions: [
      "Stand upright with feet together and arms at sides.",
      "Jump or move laterally while keeping rhythm.",
      "Maintain active core and steady breathing."
    ]
  },
  mountain_climbers: {
    id: "03lzqwk",
    name: "High Pace Mountain Climbers",
    target: "Abs & Hip Flexors",
    bodyPart: "Waist",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/03lzqwk.gif",
    secondaryMuscles: ["Shoulders", "Chest", "Quads"],
    instructions: [
      "Start in a high push-up plank position.",
      "Drive one knee toward chest rapid fire.",
      "Alternate knees rapidly while maintaining flat hips."
    ]
  },
  burpees: {
    id: "0JtKWum",
    name: "Full-Body Explosive Burpee",
    target: "Cardio & Full Body Strength",
    bodyPart: "Full Body",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/0JtKWum.gif",
    secondaryMuscles: ["Chest", "Quads", "Abs"],
    instructions: [
      "Drop into a squat, place hands on floor and kick feet back into plank.",
      "Perform a push-up, jump feet forward back to squat position.",
      "Explode vertically with arms reaching overhead."
    ]
  },
  crunch: {
    id: "03lzqwk",
    name: "Abdominal Knee Raise Crunch",
    target: "Rectus Abdominis",
    bodyPart: "Waist",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/03lzqwk.gif",
    secondaryMuscles: ["Obliques"],
    instructions: [
      "Lie on back with knees bent and feet flat.",
      "Place fingertips behind head lightly.",
      "Flex abdominals to lift shoulder blades off floor, pausing at peak tension."
    ]
  },
  stretching: {
    id: "01qpYSe",
    name: "Upward Facing Dog Stretch",
    target: "Flexibility & Spine Extension",
    bodyPart: "Back & Core",
    equipment: "Body Weight",
    gifUrl: "https://static.exercisedb.dev/media/01qpYSe.gif",
    secondaryMuscles: ["Hamstrings", "Spine", "Shoulders"],
    instructions: [
      "Inhale deeply and lengthen spine.",
      "Ease into joint stretches gently without forcing movement.",
      "Hold each stretch for 15-30 seconds with calm breathing."
    ]
  }
};

// Fetch live ExerciseDB API list from https://oss.exercisedb.dev/api/v1/exercises
export async function fetchLiveExerciseDBList(): Promise<ExerciseDBItem[]> {
  if (liveExerciseDbCache.length > 0) return liveExerciseDbCache;
  if (isFetchingDb) return liveExerciseDbCache;

  isFetchingDb = true;
  try {
    const res = await fetch("https://oss.exercisedb.dev/api/v1/exercises?limit=100");
    if (!res.ok) throw new Error("ExerciseDB API network response failed");
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      liveExerciseDbCache = json.data.map((item: any) => ({
        id: item.exerciseId || item.id,
        name: item.name || "Exercise",
        target: Array.isArray(item.targetMuscles) ? item.targetMuscles.join(", ") : (item.targetMuscles || item.target || "Full Body"),
        bodyPart: Array.isArray(item.bodyParts) ? item.bodyParts.join(", ") : (item.bodyParts || "Body"),
        equipment: Array.isArray(item.equipments) ? item.equipments.join(", ") : (item.equipments || "Body Weight"),
        gifUrl: item.gifUrl || `https://static.exercisedb.dev/media/${item.exerciseId}.gif`,
        secondaryMuscles: item.secondaryMuscles || [],
        instructions: item.instructions || []
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch live ExerciseDB API, using catalog fallback:", err);
  } finally {
    isFetchingDb = false;
  }
  return liveExerciseDbCache;
}

// Helper function to resolve ExerciseDB GIF by name, animationType, or target muscle
export function getExerciseDBGif(
  exerciseName: string,
  animationType?: string,
  targetMuscle?: string
): ExerciseDBItem {
  const nameLower = (exerciseName || "").toLowerCase();
  const animLower = (animationType || "").toLowerCase();
  const muscleLower = (targetMuscle || "").toLowerCase();

  // Try live cache match first
  if (liveExerciseDbCache.length > 0) {
    const liveMatch = liveExerciseDbCache.find(ex => 
      ex.name.toLowerCase().includes(nameLower) ||
      ex.target.toLowerCase().includes(muscleLower) ||
      (animationType && ex.name.toLowerCase().includes(animLower))
    );
    if (liveMatch) return liveMatch;
  }

  // Direct catalog key match
  if (EXERCISE_DB_CATALOG[animLower]) {
    return EXERCISE_DB_CATALOG[animLower];
  }

  // Name search matching
  if (nameLower.includes("push") || nameLower.includes("chest")) return EXERCISE_DB_CATALOG.pushup;
  if (nameLower.includes("squat") || nameLower.includes("leg")) return EXERCISE_DB_CATALOG.squat;
  if (nameLower.includes("plank") || nameLower.includes("core")) return EXERCISE_DB_CATALOG.plank;
  if (nameLower.includes("lunge")) return EXERCISE_DB_CATALOG.lunge;
  if (nameLower.includes("jack") || nameLower.includes("jump")) return EXERCISE_DB_CATALOG.jumping_jacks;
  if (nameLower.includes("climb") || nameLower.includes("mountain")) return EXERCISE_DB_CATALOG.mountain_climbers;
  if (nameLower.includes("burpee")) return EXERCISE_DB_CATALOG.burpees;
  if (nameLower.includes("crunch") || nameLower.includes("ab")) return EXERCISE_DB_CATALOG.crunch;
  if (nameLower.includes("stretch") || nameLower.includes("yoga") || nameLower.includes("warm")) return EXERCISE_DB_CATALOG.stretching;

  // Muscle group fallback
  if (muscleLower.includes("chest") || muscleLower.includes("tricep")) return EXERCISE_DB_CATALOG.pushup;
  if (muscleLower.includes("quad") || muscleLower.includes("glute")) return EXERCISE_DB_CATALOG.squat;
  if (muscleLower.includes("abs") || muscleLower.includes("waist")) return EXERCISE_DB_CATALOG.plank;

  return EXERCISE_DB_CATALOG.pushup;
}
