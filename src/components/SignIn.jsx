
const SignIn = () => {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopop(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}