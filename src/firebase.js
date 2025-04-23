// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  // measurementId: process.env.REACT_APP_MESUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const data = getDocs(collection(firestore, "products"));
export const handleCreateNewListing = async ({
  name = "Apple",
  capacity = "64GB",
  category = "Smartphone",
  color = "white",
  img_url = null,
  price = 0,
  CPUModel = null,
  HardDisk = null,
  year = null,
}) => {
  return await addDoc(collection(firestore, "products"), {
    name: name,
    data: {
      capacity: capacity,
      category: category,
      color: color,
      img_url: img_url,
      price: price,
      cpuModel: CPUModel,
      hardDiskSize: HardDisk,
      year: year,
    },
  });
};
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export default app;
