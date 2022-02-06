import { useState, useRef } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRWbUDSBrjju6TVUeK3gyu8T0dO0IOeiY",
  authDomain: "super-chat-f33a2.firebaseapp.com",
  projectId: "super-chat-f33a2",
  storageBucket: "super-chat-f33a2.appspot.com",
  messagingSenderId: "512926779578",
  appId: "1:512926779578:web:191eb6cd372c6340461a83"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
const firestore = getFirestore();

function App() {
  
  const [user] = useAuthState(auth);
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <img src="react.png" alt="react icon" />
          <img src="fire.png" alt="react icon" />
          <img src="chat.png" alt="react icon" />
        </div>
      {user ? <SignOut /> : ''}
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

      <footer>
        <a href="https://www.flaticon.com/free-icons/fire" title="fire icons">Fire icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/react" title="react icons">React icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/conversation" title="conversation icons">Conversation icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Smashicons - Flaticon</a>
      </footer>
    </div>
  );
}

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
  }

  const signUp = async () => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    } catch(error) {
      console.log(`code: ${error.code}\nmessage: ${error.message}`);
    }
  }

  const signIn = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth,email,password);
    } catch(error) {
      console.log(`code: ${error.code}\nmessage: ${error.message}`);
      console.log(error);
    }
  }

  return (
      <div className="signup">
        <label>Email:</label>
        <input type="email" value={email} onInput={(e)=>setEmail(e.target.value)}/>
        <label>Password:</label>
        <input type="password" vlaue={password} onInput={(e)=>setPassword(e.target.value)}/>
        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Sign in</button>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
  )
}

const SignOut = () => {
  
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}

export default App;

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = collection(firestore, 'messages');
  const queryToSend = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(queryToSend, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await addDoc(collection(firestore, 'messages'), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        
        <div ref={dummy}></div>
      </main>


      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">&#10148;</button>
      </form>
    </>
  )
}

function ChatMessage({message}) {
  const { text, uid, photoURL } = message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recevied';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL? photoURL: "user.png"} alt="profile picture" />
      <p>{text}</p>
    </div>
  )
}