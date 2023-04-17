import { StatusBar } from 'expo-status-bar';
import { Component, useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as SQLite from 'expo-sqlite'

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

function openDatabase(){
  return SQLite.openDatabase("bmiDB.db")
}
const db = openDatabase();




export default function App() {
  let [bmi, setBmi] = useState(null);
  let [weightStr, setWeight] = useState("");
  let [heightStr, setHeight] = useState("");
  let [rows, setRows] = useState("")

  const getRows = () => {
    db.transaction((tx)=>{
      tx.executeSql("select * from bmis", [], (tx, res)=>{
        setRows( res.rows );
      });
    });
  }

  const computeBMI = () =>{
    let weightFloat = parseFloat(weightStr);
    let heightFloat = parseFloat(heightStr);
    
    if (isNaN(weightFloat) || isNaN(heightFloat)){
      Alert.alert("Error", "Please enter valid numbers for height and weight")
    }else{
      const bmiCalc = ((weightFloat / (heightFloat * heightFloat))*703)
      let bmiGroup = "";
      if (bmiCalc < 18.5){
        bmiGroup = "Underweight"
      }else if (bmiCalc < 25){
        bmiGroup = "Healthy"
      }else if (bmiCalc < 30){
        bmiGroup = "Overweight"
      }else{
        bmiGroup = "Obese"
      }
      const bmiString = "Body Mass Index is " + bmiCalc.toFixed("1") + "\n(" +bmiGroup + ")";

      //add bmi to db
      date= new Date();
      date = date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString();
      db.transaction(tx=>{
        tx.executeSql("insert into bmis (date, bmi, height, weight) values (?, ?, ?, ?)", [date, bmiCalc.toFixed("1"), heightStr, weightStr]);
      })

      setBmi( bmiString );
      getRows();
    }
  }

  onLoad = async () =>{
    getRows();

    db.transaction((tx) =>{
      tx.executeSql("create table if not exists bmis (id integer primary key not null, date text, bmi text, height text, weight text);")
    });
  }

  useEffect(()=> {
    this.onLoad();
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>
      <TextInput style={styles.input} placeholder='Weight in Pounds' onChangeText={nt => setWeight(nt)}></TextInput>
      <TextInput style={styles.input} placeholder='Height in Inches'  value={heightStr} onChangeText={nt => setHeight(nt)}></TextInput>
      <Pressable onPress={computeBMI}>
        <Text style={styles.compute}>Compute BMI</Text>
      </Pressable>
      
      <Text style={styles.bmi}>{bmi ? bmi : null}</Text>

      <Text style={styles.bmiHistoryLabel}>BMI History</Text>

      {rows["_array"]?
        rows["_array"].map(a =>(
          <Text style={styles.bmiText} key={a["id"]}>{a["date"]}:  {a["bmi"]} (W: {a["weight"]}, H: {a["height"]}) </Text>
        ))
        :null
      }

      <View></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  bmiHistoryLabel:{
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 24,
  },

  bmiText:{
    paddingLeft:10,
    fontSize: 20,
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
