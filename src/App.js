/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(err => {
      console.log(err);
      console.log(err.massage);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        password: '',
        isValid: false
      }
      setUser(signedOutUser);
    })
    .catch(err => {

    })
  }

  const is_valid_email = email =>  /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
  const hasNumber = input => /\d/.test(input);

  const handleChange = event => {
    const newUserInfo = {
      ...user
    };

    //perform validation;
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === "password"){
      isValid = event.target.value.length>8 && hasNumber(event.target.value);
    }
    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
      })
    }
    else{
      console.log("Form is not valid", user);
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email} </p>
          <img src={user.photo} alt="User-Photo"/>
        </div>
      }
      <h1>Our Own Authentication</h1>
      <form onSubmit={createAccount}>
        <input onBlur={handleChange} type="text" name="name" placeholder="Input your name" required /> <br/>
        <input onBlur={handleChange} type="text" name="email" placeholder="Input your email" required /> <br/>
        <input onBlur={handleChange} type="password" name="password" placeholder="Input your password" required /> <br/>
        <input type="submit" value="Create Account"/>
      </form>
    </div>
  );
}

export default App;
