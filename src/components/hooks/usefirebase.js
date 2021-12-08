import axios from "axios";
import initializeAuthentication from "components/Firebase/init.firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import swal from 'sweetalert';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const auth = getAuth();

    //getName
    const getName = (e) => {
        setName(e.target.value);
    }
    //getEmail
    const getEmail = (e) => {
        setEmail(e.target.value);
    }
    //getPassword
    const getPassword = (e) => {
        setPassword(e.target.value);
    }
    //Update Name
    const updateUserName = (name) => {
        updateProfile(auth.currentUser, {
            displayName: name
        }).then(() => {

        }).catch((error) => {
            setError(error.message);
        });
    }
    //create New User
    const createNewUSer = (history) => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                updateUserName();
                swal("Good job!", "Register Successful", "success");
                axios.post('https://registertest.free.beeceptor.com/init', {
                    name: name,
                    email: email,
                    password: password,
                    uid: user?.uid

                })
                    .then(function (response) {
                        console.log(response)
                        if (response?.data?.status === 1) {
                            history.push("/admin");

                        };
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => setIsLoading(false));
    }
    //google sign in
    const signInWithGoogle = () => {
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
            .then(result => {
                swal("Good job!", "Login Successful", "success");
                setUser(result.user)
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setIsLoading(false))
    }
    //github sign in
    const signInWithGithub = () => {
        setIsLoading(true);
        signInWithPopup(auth, githubProvider)
            .then(result => {
                setUser(result.user)

            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setIsLoading(false))
    }
    //Email & Password login
    const emailPasswordSignIn = (history) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {

                swal("Good job!", "Login Successful", "success");
                axios.post('https://registertest.free.beeceptor.com/init', {
                    email: email,
                    uid: user?.uid

                })
                    .then(function (response) {
                        if (response?.data?.status === 1) {
                            history.push("/admin");

                        };
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch((error) => {
                setError(error.message)
            })
            .finally(() => setIsLoading(false));
    };

    //Observe user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            } else {
                setUser({});
            }
            setIsLoading(false);
        })
        return unsubscribe;
    }, [auth]);

    return { user, error, name, email, password, isLoading, getName, getEmail, getPassword, createNewUSer, signInWithGoogle, signInWithGithub, emailPasswordSignIn }
}
export default useFirebase;