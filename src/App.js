import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)



function App() {
  const [newUser,setNewUser] = useState(false)
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
  var fbprovider = new firebase.auth.FacebookAuthProvider();
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
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user}
        newUserInfo.error='';
        newUserInfo.success=true
        setUser(newUserInfo);
        updateUserName(user.name);
       
      })
      .catch(error =>{
      
        const newUserInfo= {...user}
        newUserInfo.error = error.message
        newUserInfo.success=false
        setUser(newUserInfo)
      });  
  
    
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res =>{
    const newUserInfo = {...user}
        newUserInfo.error='';
        newUserInfo.success=true
        setUser(newUserInfo)
        console.log("sign in user",res.user)
    

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

  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
}).then(function() {
  console.log("update profile Success")
}).catch(function(error) {
  console.log(error)
});
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleAdd}>Sign In</button>
      }
      <button>Sign In Using Facebook</button>
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
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser">New User Sign Up</label>
        
        {newUser &&<input name="name" type="text" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
       <input type="text" name="email"onBlur={handleBlur} placeholder="Your Email" required/>
       <br/>
        <input type="password" name="password"onBlur={handleBlur} placeholder="Your Password"required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up': 'Sign In'}/>
        <p style={{color: 'red'}}>{user.error}</p>
        {user.success && <p style={{color: 'green'}}>User {newUser ?'Created' : 'Log In'} Success</p> }
      </form>

    </div>
  );
}

export default App;
