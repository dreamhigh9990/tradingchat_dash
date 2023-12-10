/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { profileColors } from "@/constant/constants";
import { auth, db, rmDb } from "@/configs/firebase";
import { LINKS } from "@/constant/links";
import { useRouter } from "next/router";
import { onDisconnect, onValue, ref, serverTimestamp, set, update } from "firebase/database";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    const clear = async () => {
        try {
            setCurrentUser(null);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);

        if (!user) {
            clear();
            return;
        }
        const userDocRef = doc(db, "users", user.uid);
        let currentUser;
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                // console.log("User document data:", userDoc.data());
                await updateDoc(doc(db, "users", user.uid), {
                    isOnline: true,
                });
                currentUser = userDoc.data();
                if (currentUser.subscription) {
                    await handlePlanCheck(currentUser);
                }
            } else {
                // Handle case where document does not exist
                currentUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    color: profileColors[colorIndex],
                    isOnline: true,
                };
                await setDoc(doc(db, "users", user.uid), currentUser);
                await setDoc(doc(db, "userChats", user.uid), {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
        // Add logging to debug currentUser value
        // console.log("CurrentUser:", currentUser);
        setCurrentUser(currentUser);
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser?.uid), {
                    isOnline: false,
                });
            }
            set(ref(rmDb, 'status/' + currentUser?.uid), {
                state: 'offline',
                last_changed: serverTimestamp(),
            });
            await authSignOut(auth).then(() => clear());
        } catch (_ex) { } finally {
            router.replace(LINKS.LOGIN.ROUTE);
            // setIsLoading(false);
        }
    };

    const handlePlanCheck = async (_currentUser) => {
        try {
            const session = await fetch(`/api/stripe/get-session?subscription_id=${_currentUser.subscription}&user_id=${_currentUser?.uid}`);
            const sessionJSON = await session.json();
        } catch (_ex) {
            console.log({ _ex });
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = async () => {
            if (!(auth?.currentUser?.uid)) {
                return;
            }
            // Fetch the current user's ID from Firebase Authentication.
            var uid = auth.currentUser.uid;

            // Create a reference to this user's specific status node.
            // This is where we will store data about being online/offline.
            var userStatusDatabaseRef = ref(rmDb, 'status/' + uid);

            // We'll create two constants which we will write to 
            // the Realtime database when this device is offline
            // or online.
            var isOfflineForDatabase = {
                state: 'offline',
                last_changed: serverTimestamp(),
            };

            var isOnlineForDatabase = {
                state: 'online',
                last_changed: serverTimestamp(),
            };

            // Create a reference to the special '.info/connected' path in 
            // Realtime Database. This path returns `true` when connected
            // and `false` when disconnected.

            const inforConnected = ref(rmDb, '.info/connected');
            onValue(inforConnected, async (snapshot) => {
                // If we're not currently connected, don't do anything.
                if (snapshot.val() == false) {
                    await updateDoc(doc(db, "users", uid), { isOnline: false, });
                    return;
                };

                // If we are currently connected, then use the 'onDisconnect()' 
                // method to add a set which will only trigger once this 
                // client has disconnected by closing the app, 
                // losing internet, or any other means.
                onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(function () {
                    // The promise returned from .onDisconnect().set() will
                    // resolve as soon as the server acknowledges the onDisconnect() 
                    // request, NOT once we've actually disconnected:
                    // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
                    updateDoc(doc(db, "users", uid), { isOnline: true, });

                    // We can now safely set ourselves as 'online' knowing that the
                    // server will mark us as offline once we lose connection.
                    set(userStatusDatabaseRef, isOnlineForDatabase);
                });
            });
        };
        return () => unsubscribe();
    }, [auth?.currentUser?.uid]);

    return (
        <UserContext.Provider
            value={{ currentUser, isLoading, setCurrentUser, signOut }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);