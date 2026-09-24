import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return getIdToken(user);
}

export function subscribeToAuth(listener: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, listener);
}
