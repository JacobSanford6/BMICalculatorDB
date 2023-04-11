import { StatusBar } from 'expo-status-bar';
import { Component, useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

export default function App() {
  let [bmi, setBmi] = useState(null);
  let [weightStr, setWeight] = useState("");
  let [heightStr, setHeight] = useState("");
  const key = "@MyApp:HeightAndBmi";

  const computeBMI = () =>{
    
    let weightFloat = parseFloat(weightStr);
    let heightFloat = parseFloat(heightStr);
    
    if (isNaN(weightFloat) || isNaN(heightFloat)){
      Alert.alert("Error", "Please enter valid numbers for height and weight")
    }else{
      const bmiString = "Body Mass Index is " + ((weightFloat / (heightFloat * heightFloat))*703).toFixed("1") 
      AsyncStorage.setItem(key, heightStr+"|"+bmiString)

      setBmi( bmiString )
    }
  }

  onLoad = async () =>{
    const storedString = await AsyncStorage.getItem(key);
    if (storedString){
      setHeight(storedString.split('|')[0]);
      setBmi(storedString.split('|')[1])
    }
  }

  useEffect(()=> {
    this.onLoad();
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>
      <TextInput style={styles.input} placeholder='Weight in Pounds' onChangeText={nt => setWeight(nt)}></TextInput>
      <TextInput style={styles.input} placeholder='Height in Inches' onChangeText={nt => setHeight(nt)}>{heightStr}</TextInput>
      <Pressable onPress={computeBMI}>
        <Text style={styles.compute}>Compute BMI</Text>
      </Pressable>
      
      <Text style={styles.bmi}>{bmi ? bmi : null}</Text>

      <Text style={styles.bmiAssess}>Assessing Your BMI</Text>
      <Text style={styles.bmiAssess}>    Underweight: less than 18.5</Text>
      <Text style={styles.bmiAssess}>    Healthy: 18.5 to 24.9</Text>
      <Text style={styles.bmiAssess}>    Overweight: 25.0 to 29.9</Text>
      <Text style={styles.bmiAssess}>    Obese: 30.0 or higher</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  compute: {
    width: '95%',
    marginLeft: '2.5%',
    textAlign: 'center',
    backgroundColor: '#34495e',
    color: 'white',
    fontSize: 24,
    marginTop: 10,
    height: 40,
    textAlignVertical: 'center',
  },

  header: {
    backgroundColor: '#f4511e',
    color: 'white',
    width: '100%',
    height: 100,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },

  bmiAssess: {
    textAlign: 'left',
    marginLeft: '2.5%',
    fontSize: 20,
    width: '95%',
  },

  bmi: {
    textAlign: 'center',
    fontSize: 28,
    height: 150,
    textAlignVertical: 'center'
  },

  input: {
    width: '95%',
    height: 30,
    backgroundColor: 'rgb(236,240,241)',
    fontSize: 24,
    marginTop: 10,
    marginLeft: '2.5%',
    
  }
});
