import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password)
                    } catch (e) {
                        alert('Error: Password or Email unavaliable', e);
                    }
                },
                register: async (email, password) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password)
                            .then(() => {
                                firestore().collection('users').doc(auth().currentUser.uid)
                                    .set({
                                        name: '',
                                        address: '',
                                        email: email,
                                        phone: '',
                                        createAt: firestore.Timestamp.fromDate(new Date()),
                                        userImg: null,
                                        role: '',
                                    }).catch(error => {
                                        alert('something gone wrong when added users:', error)
                                    })
                            })
                            .catch(error => {
                                alert('Something gone wrong with sign up: ', error)
                            })
                    } catch (e) {
                        console.log(e);
                    }
                },
                logout: async () => {
                    try {
                        await auth().signOut();
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            } >
            { children}
        </AuthContext.Provider >
    );
}