import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, ScrollView } from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useSWR from 'swr';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{title: 'Playground!'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome Home'}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Survey1" component={survey1} options={{title: 'Question 1'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const WelcomeScreen = ({navigation}) => {
  const [terms, setTerms] = useState(true);
  const [text, setText] = useState('');

  return(
  <View style={styles.container}>
    <Text style={styles.titleText}>
      Welcome to Symptom Tracker!
    </Text>
    <Button onPress={() => {setTerms(false);}} disabled={!terms} title={'Accept'}/>
    <Button onPress={() =>navigation.navigate('Home', {name: text})} disabled={terms && text==''} //next page
        title={terms ? 'Accept to Continue' : 'Continue'}/>
    <Text>We recommend you complete this profile with the help of a doctor, if possible.</Text>
    <Text style={{padding: 10, fontSize: 42}}>{text}</Text>
    <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
        }}
        style={{width: 200, height: 200}}
      />
      <TextInput
    style={{height: 40}}
    placeholder="Enter your name here to continue!"
    onChangeText={newText => setText(newText)}
    defaultValue={text}
    />
   </View>
  )   
};

const HomeScreen = ({navigation, route}) => {
  return (
    <View>
      <Text>Here is {route.params.name}'s profile. </Text>
      <Button
        title= "Go to profile"
        onPress={() =>
          navigation.navigate('Profile', {name: route.params.name})
        }
      />
      <Button title = "Start Survey" onPress={() =>navigation.navigate('Survey1', {name: route.params.name})} />
      <Text></Text>
    </View>
    
  );
};

const survey1 = ({navigation, route}) => {
  date = new Date()
  return (
    <View>
      <Text>Question from database here </Text>
      <Button
        title= "Next Page"
        onPress={() =>
          navigation.navigate('Profile', {name: route.params.name})
        }
      />
      <Text></Text>
    </View>
    
  );
};


const ProfileScreen = ({navigation, route}) => {
  return <Text>You are inside {route.params.name}'s profile</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color:'turquoise',
    textAlign:"center"
  }
});

export default App;