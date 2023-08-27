import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Octicons } from '@expo/vector-icons';
import ProfileLayoutAction from '../components/ProfileLayoutAction';
import { profileLayoutActions } from '../helper/profileLayoutActions';
import { useState } from 'react';
import { logout } from '../features/auth/authSlice';

export default function Profile({navigation}) {
    const {user, isSuccess} = useSelector(
        (state) => state.user
    );
    const dispatch = useDispatch()
    const [selectedAction, setSelectedAction] = useState(profileLayoutActions[0])
    const [isLoading, setisLoading] = useState(false)
    const handleLogout = () => {
        setisLoading(true)
        dispatch(logout()).then(() => setisLoading(false))
    }
  return (
    <View style={styles.container}>
        {
            user ? 
            <>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, marginVertical: 5}}>
                <Text style={{textAlign: 'center', marginVertical: 5, fontWeight: 'bold', fontSize: 16, color: 'gray'}}>Welcome! {user?.name} {user?.surname}</Text>
                <TouchableOpacity style={styles.signOut} onPress={handleLogout} disabled={isLoading}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                        {isLoading ? <ActivityIndicator style={{alignSelf: 'center'}} color="gray" />:'Sign Out'}
                    </Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.profileLayout}>
                <ScrollView horizontal style={styles.actions} showsHorizontalScrollIndicator={false}>
                    {
                        profileLayoutActions.map((action, index) => (
                            <ProfileLayoutAction 
                                text={action.text} 
                                key={index} 
                                selected={selectedAction.text === action.text}
                                onPress={() => setSelectedAction(profileLayoutActions[index])}
                            />
                        ))
                    }
                </ScrollView>
            </View>
            {selectedAction.comp}
            </>
            :
            <View style={styles.noUser}>
                <Octicons name="sign-in" size={200} color="gray" />
                <Text style={{color: 'gray', textAlign: 'center', fontSize: 19, marginVertical: 10, paddingHorizontal: 20}}>Looks like you haven't logged in yet. Would you like to log in now?</Text>
                <TouchableOpacity style={styles.signIn} onPress={() => navigation.navigate('Login')}>
                    <Text style={{fontSize: 16, color: 'white'}}>Sign in</Text>
                </TouchableOpacity>
            </View>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileLayout: {
        alignItems: 'center'
    },
    noUser: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    signIn: {
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#00e200',
        borderColor: 'green',
        marginTop: 10
    },
    signOut: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#f53c0e',
        borderColor: 'green',
    },
})