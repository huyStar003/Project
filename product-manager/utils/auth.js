// utils/auth.js (Firebase version)
import { auth, db } from "./firebaseConfig";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { 
  doc, setDoc, getDoc 
} from "firebase/firestore";

// === Đăng ký ===
export const handleSignup = async (email, password, role = "employee") => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Lưu thêm dữ liệu vào Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      employeeId: role === "admin" ? "ADMIN" + Date.now() : "EMP" + Date.now(),
      createdAt: new Date().toISOString(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// === Đăng nhập ===
export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return { success: true, user: { uid: user.uid, ...userData } };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// === Đăng xuất ===
export const clearUserSession = async () => {
  await signOut(auth);
};

// === Session (Firestore thay vì global) ===
export const getUserSession = () => auth.currentUser;

// === Kiểm tra vai trò ===
export const isAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;
  const docSnap = await getDoc(doc(db, "users", user.uid));
  return docSnap.exists() && docSnap.data().role === "admin";
};
