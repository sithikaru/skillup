/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function protectRoute(callback: Function) {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        window.location.href = "/login"; // Redirect to login if not authenticated
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().verified) {
        resolve(callback()); // Allow access if verified
      } else {
        window.location.href = "/dashboard"; // Redirect unverified users
      }
    });
  });
}
