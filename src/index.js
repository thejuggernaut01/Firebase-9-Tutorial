import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8DrH2lUIYSu-XHBbRWKIkbripPRj-79I",
  authDomain: "tutorial-project-85552.firebaseapp.com",
  projectId: "tutorial-project-85552",
  storageBucket: "tutorial-project-85552.appspot.com",
  messagingSenderId: "588502904830",
  appId: "1:588502904830:web:4e771f2df26471a0e79aaf",
};

// init firebase app
const firebaseApp = initializeApp(firebaseConfig);

// init services
const db = getFirestore(firebaseApp);
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// Queries
const q = query(colRef, orderBy("createdAt"));

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });

  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  // console.log(title.value, author.value);
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => deleteBookForm.reset());
});

// get a single document
const docRef = doc(db, "books", "FCwLMSXFOeknJWTs9Sde");

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// update a single document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateForm.id.value);

  updateDoc(docRef, {
    title: updateForm.title.value,
  }).then(() => updateForm.reset());
});

// signing users up
const signUpForm = document.querySelector(".signup");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signUpForm.email.value;
  const password = signUpForm.password.value;

  createUserWithEmailAndPassword(auth, email, password).then((cred) => {
    // console.log("user created", cred.user);
    signUpForm.reset();
  });
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    // console.log("the user signed out");
  });
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password).then((cred) => {
    // console.log("User logged in", cred.user);
    loginForm.reset();
  });
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed", user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
