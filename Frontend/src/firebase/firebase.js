import { initializeApp }        from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyBbQ6qgcNF7cnSOtDAOemSuKpkrvN_Rpyo",
  authDomain:        "universal-edge.firebaseapp.com",
  projectId:         "universal-edge",
  storageBucket:     "universal-edge.firebasestorage.app",
  messagingSenderId: "372814771197",
  appId:             "1:372814771197:web:ebf3c41512d9a5f8021f94"
};

// Firebase initialize karo
const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
