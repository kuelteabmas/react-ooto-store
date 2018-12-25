import Rebase from 're-base';
import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAplDOAWre6_N8L7lgQ_Ktmo_GSSJZU3Hw",
    authDomain: "out-of-the-ocean-devp.firebaseapp.com",
    databaseURL: "https://out-of-the-ocean-devp.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

// Named export
export { firebaseApp };

// Default export
export default base;