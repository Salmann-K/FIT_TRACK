import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getUserData } from "./auth.js"; 
import { db } from "./firebase-config.js";

/**
 * Saves or updates an exercise log for the logged-in user.
 * If a log exists for the same date, update it; otherwise, create a new log.
 * @param {string} exerciseId - The ID of the exercise.
 * @param {number} reps - The number of repetitions.
 * @param {number} [timeSpent=null] - Optional time spent in seconds.
 */
export async function saveExerciseLog(exerciseId, reps, timeSpent = null) {
  const user = getUserData();
  if (!user) {
    alert("User not logged in! Cannot save exercise log.");
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

  try {
    // 🔍 Query Firestore for an existing log for the same user, exercise, and date
    const logsRef = collection(db, "exercise_logs");
    const q = query(
      logsRef,
      where("user_id", "==", user.uid),
      where("exercise_id", "==", exerciseId),
      where("date", "==", today)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data();

      await setDoc(
        doc(db, "exercise_logs", existingDoc.id),
        {
          reps: existingData.reps + reps,
          time_spent: (existingData.time_spent || 0) + (timeSpent || 0),
        },
        { merge: true }
      );

      console.log("✅ Existing exercise log updated!");
    } else {
      const newLog = {
        user_id: user.uid,
        exercise_id: exerciseId,
        reps,
        time_spent: timeSpent || 0,
        date: today,
      };

      const docRef = await setDoc(doc(logsRef), newLog);
      console.log("✅ New exercise log created with ID:", docRef.id);
    }
  } catch (error) {
    console.error("❌ Firestore Write Error:", error);
  }
}
