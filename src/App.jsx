import { useState, useRef } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

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
      </header>
        <section>
          {user ? <ChatRoom /> : <SignIn />}
        </section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
  }

  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

const SignOut = () => {
  
  return auth.currentUser && (
    <button onClick={() => signOut()}>Sign Out</button>
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
      </main>

      <div ref={dummy}></div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        <button type="submit">&#10148;</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recevied';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profile picture" />
      <p>{text}</p>
    </div>
  )
}