// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAklgfina5Ikbx7fXhlDGvsutEKjibDsf8",
    authDomain: "my-place-map-app.firebaseapp.com",
    projectId: "my-place-map-app",
    storageBucket: "my-place-map-app.firebasestorage.app",
    messagingSenderId: "237185540673",
    appId: "1:237185540673:web:9c9242ab098389d00f5cc0",
    measurementId: "G-4ZQ2K9F0NF"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
