import React, { useState } from "react";
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
Alert,
KeyboardAvoidingView,
Platform,
ScrollView
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, createUserWithEmailAndPassword } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

export default function RegisterScreen({ navigation }) {

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [department, setDepartment] = useState("");
const [batch, setBatch] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const registerUser = async () => {

if (!name || !email || !department || !batch || !password || !confirmPassword) {
Alert.alert("Error", "Please fill all fields");
return;
}

if (password !== confirmPassword) {
Alert.alert("Error", "Passwords do not match");
return;
}

const passwordRegex =
/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

if (!passwordRegex.test(password)) {
Alert.alert(
"Weak Password",
"Password must contain:\n1 capital letter\n1 number\n1 special character\nMinimum 8 characters"
);
return;
}

try {

const auth = getAuth(getApp());

const userCredential = await createUserWithEmailAndPassword(auth, email, password);

const user = userCredential.user;

await firestore()
  .collection("alumni")
  .doc(user.uid)
  .set({
    name: name,
    email: email,
    department: department,
    batch: batch,
    createdAt: new Date()
  });

Alert.alert("Success", "Account created successfully");


} catch (error) {


Alert.alert("Registration Failed", error.message);


}

};

return ( <SafeAreaView style={styles.safeArea}>

<KeyboardAvoidingView
style={{flex:1}}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

<ScrollView contentContainerStyle={styles.container}>

<Text style={styles.title}>Alumni Registration</Text>

<TextInput
placeholder="Full Name"
placeholderTextColor="#888"
style={styles.input}
value={name}
onChangeText={setName}
/>

<TextInput
placeholder="Email"
placeholderTextColor="#888"
style={styles.input}
keyboardType="email-address"
autoCapitalize="none"
value={email}
onChangeText={setEmail}
/>

<TextInput
placeholder="Department"
placeholderTextColor="#888"
style={styles.input}
value={department}
onChangeText={setDepartment}
/>

<TextInput
placeholder="Batch (Example: 2020-2024)"
placeholderTextColor="#888"
style={styles.input}
value={batch}
onChangeText={setBatch}
/>

<TextInput
placeholder="Password"
placeholderTextColor="#888"
style={styles.input}
secureTextEntry
value={password}
onChangeText={setPassword}
/>

<TextInput
placeholder="Confirm Password"
placeholderTextColor="#888"
style={styles.input}
secureTextEntry
value={confirmPassword}
onChangeText={setConfirmPassword}
/>

<TouchableOpacity style={styles.button} onPress={registerUser}>
<Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.loginLink}
onPress={() => navigation.navigate("Login")}

>

<Text style={styles.loginText}>
Already have an account? Login
</Text>
</TouchableOpacity>

</ScrollView>
</KeyboardAvoidingView>

</SafeAreaView>
);
}

const styles = StyleSheet.create({

safeArea:{
flex:1,
backgroundColor:'#f4f6fb'
},

container:{
flexGrow:1,
justifyContent:'center',
padding:25
},

title:{
fontSize:30,
fontWeight:'bold',
textAlign:'center',
marginBottom:25,
color:'#1a2a6c'
},

input:{
backgroundColor:'white',
padding:14,
borderRadius:10,
borderWidth:1,
borderColor:'#ddd',
marginBottom:15,
fontSize:16,
color:'black'
},

button:{
backgroundColor:'#1a2a6c',
padding:15,
borderRadius:10,
alignItems:'center',
marginTop:10
},

buttonText:{
color:'white',
fontSize:18,
fontWeight:'600'
},

loginLink:{
marginTop:20,
alignItems:'center'
},

loginText:{
color:'#1a2a6c',
fontWeight:'600'
}

});
