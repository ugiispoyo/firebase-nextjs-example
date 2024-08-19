import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCHfyxQrTQgPpLHdDcd8mNN_92dozHyhF0",
  authDomain: "nextjs-firebase-example-u91.firebaseapp.com",
  projectId: "nextjs-firebase-example-u91",
  storageBucket: "nextjs-firebase-example-u91.appspot.com",
  messagingSenderId: "505731946132",
  appId: "1:505731946132:web:c67f913b42750449534681",
  databaseURL: "https://nextjs-firebase-example-u91-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database};
