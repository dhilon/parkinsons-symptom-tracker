import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput, ScrollView } from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const WelcomeScreen = ({navigation}) => {
  const [terms, setTerms] = useState(true);
  const [text, setText] = useState('');

  return(
  <View style={styles.container}>
    <Text>
      Terms and Conditions lol 
    </Text>
    <Button onPress={() => {setTerms(false);}} disabled={!terms} title={'Accept'}/>
    <Button onPress={() =>
        navigation.navigate('Home', {name: text})
      } disabled={terms} //next page
        title={terms ? 'Accept to Continue' : 'Continue'}/>
    <Text></Text>
    <Text style={{padding: 10, fontSize: 42}}>{text}</Text>
    <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
        }}
        style={{width: 200, height: 200}}
      />
      <TextInput
    style={{height: 40}}
    placeholder="Enter your name here!"
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
        title= "Go"
        onPress={() =>
          navigation.navigate('Profile', {name: route.params.name})
        }
      />
      <Text>{WelcomeScreen.text}</Text>
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
});

export default App;