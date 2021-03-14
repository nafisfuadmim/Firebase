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
    password:'',
    picture: '',
    error: '',
    successS:false
  
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
  

  const handleBlur=(e)=>{
    let isFormValid = true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
  

    }
   if(e.target.name === 'password'){
     const isPasswordValid = e.target.value.length > 6;
     const isPasswordCharacter =/\d{1}/.test(e.target.value);
    isFormValid = isPasswordValid && isPasswordCharacter;
    
   }
   if(isFormValid){
     const newUserInfo ={...user}
     newUserInfo[e.target.name] = e.target.value;
     setUser(newUserInfo);

   }
    
  }
  const handleSubmit=(e)=>{
    // console.log(user.email, user.password)
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user}
        newUserInfo.error='';
        newUserInfo.success=true
        setUser(newUserInfo)
       
      })
      .catch(error =>{
      
        const newUserInfo= {...user}
        newUserInfo.error = error.message
        newUserInfo.success=false
        setUser(newUserInfo)
      });  
  
    
    }
    e.preventDefault();
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
      <form onSubmit={handleSubmit}>
        <h1>Our Own Authentication</h1>
        
        <input name="name" type="text" onBlur={handleBlur} placeholder="Your Name"/>
        <br/>
       <input type="text" name="email"onBlur={handleBlur} placeholder="Your Email" required/>
       <br/>
        <input type="password" name="password"onBlur={handleBlur} placeholder="Your Password"required/>
        <br/>
        <input type="submit" value="Submit"/>
        <p style={{color: 'red'}}>{user.error}</p>
        {user.success && <p style={{color: 'green'}}>User Created Success</p> }
      </form>

    </div>
  );
}

export default App;
