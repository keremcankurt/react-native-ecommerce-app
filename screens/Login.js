import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { login } from '../features/auth/authSlice';
import { useEffect } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { isLoading, user } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { email, password } = formData;

  const onChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const onSubmit = () => {
    const userData = {
      email,
      password
    };
    dispatch(login(userData));
  };
  useEffect(() => {
    if (user) {
      navigation.navigate("HomeLayout")
    }
  }, [user]);
  return (
    <View style={styles.container}>
      <View style={styles.login}>
        <Text style={styles.title}>KCKTİCARET</Text>
        <View style={styles.inputs}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => onChange('email', value)}
            required
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(value) => onChange('password', value)}
            required
          />
        </View>
        <View style={styles.buttons}>
          {isLoading ? (
            <ActivityIndicator style={styles.loading} size="small" color="#000" />
          ) : (
            <TouchableOpacity style={styles.signIn} onPress={onSubmit}>
              <Text style={{ color: 'white' }}>Sign In</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => navigation.navigate('Register')}
            style={styles.signUp}
          >
            <Text style={{ color: 'blue' }} >Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      width: '80%',
      borderWidth: 1,
      padding: 10,
      paddingVertical: 30,
      borderColor: '#afaeae',
      borderRadius: 10,
      backgroundColor: '#f7f7f7',
      shadowColor: '#000',
      shadowOffset: {
      width: 2,
      height: 4
      },
      shadowOpacity: .9,
      shadowRadius: 10,
      elevation: 10
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'rgb(255, 138, 29)',
      marginBottom: 20,
  },
  inputs: {
      gap: 15,
      width: '100%',
  },
  textInput: {
      textAlign: 'left',
      paddingLeft: 10,
      paddingVertical: 5,
      backgroundColor: '#ebebeb',
      borderWidth: 1,
      color: '#696868',
      borderColor: 'gray',
  },
  forgotpassword: {
      alignSelf: 'flex-end', 
  },
  buttons: {
      width: '80%',
      gap: 15,
      marginTop: 20,
  },
  signIn: {
      alignItems: 'center',
      borderWidth: 1,
      padding: 5,
      borderColor: 'green',
      backgroundColor: '#04d104',
      borderRadius: 5,
  },
  signUp: {
      alignItems: 'center',
      borderWidth: 1,
      padding: 5,
      borderColor: 'blue',
      borderRadius: 5,
  }
  
});

