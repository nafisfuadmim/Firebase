import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)



function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    picture: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleAdd = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { name, email, picture } = res.additionalUserInfo.profile;
        const signedInUser = {
          isSignedIn: true,
          name: name,
          email: email,
          picture: picture
        }
        setUser(signedInUser)
        console.log(name, email, picture)
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          picture: ''
        }
        setUser(signOutUser)
        console.log(res)
      })
      .catch(err => {
      })
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleAdd}>Sign In</button>
      }
      {
        user.isSignedIn &&
        <div>
          <p>Welcome {user.name}</p>
          <p>Email {user.email}</p>
          <img src={user.picture} alt="" />
        </div>
      }

    </div>
  );
}

export default App;
