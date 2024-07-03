import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useSWR from 'swr';
import tulip from './ios/tulip.png'
import { Button, List, Text, TextInput, Avatar, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{title: 'Welcome!'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Sign In'}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Survey1" component={survey1} options={{title: 'Question 1'}} />
        <Stack.Screen name="Survey2" component={survey2} options={{title: 'Question 2'}} />
        <Stack.Screen name="Survey3" component={survey3} options={{title: 'Question 3'}} />
        <Stack.Screen name="Survey4" component={survey4} options={{title: 'Question 4'}} />
        <Stack.Screen name="Survey5" component={survey5} options={{title: 'Question 5'}} />
        <Stack.Screen name="Survey6" component={survey6} options={{title: 'Question 6'}} />
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
    <Button onPress={() => {setTerms(false);}} disabled={!terms} buttonColor={'cornflowerblue'} textColor='azure'>Accept</Button>
    <Button onPress={() =>navigation.navigate('Home', {name: text})} disabled={terms || text==''} buttonColor={'cornflowerblue'} textColor='azure'>Continue</Button>
    <Text>We recommend you complete this profile with the help of a doctor, if possible.</Text>
    <Text style={{padding: 10, fontSize: 42}}>{text}</Text>
    
    <Image source={tulip} className="rctlogo" alt="recty" style={{width: 125, height: 220}}/>
      
      <TextInput
    style={styles.textInput}
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
        onPress={() =>
          navigation.navigate('Profile', {name: route.params.name})
        }
      >Go To Profile</Button>
      <Button onPress={() =>navigation.navigate('Survey1', {name: route.params.name})} buttonColor={'cornflowerblue'} textColor='azure'>Start Survey</Button>
      <Text></Text>
    </View>
    
  );
};

const survey1 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <ProgressBar progress={0.15} color='limegreen' style={styles.progressBar} /> 

      <Text>Question from database here {poll} </Text>

      <Button
              mode="contained-tonal"
              buttonColor='cornflowerblue' textColor='azure'
              onPress={() =>
                navigation.navigate('Survey2', {name: route.params.name})
              }
              style={styles.button}
            >
              Next Question
            </Button>
    </View>
    
  );
};

const survey2 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <Text>Question from database here {poll} </Text>

      <ProgressBar progress={0.3} color='limegreen' style={styles.progressBar} /> 

      <Icon name='star' size={24} />
      <Icon name='star-outline' size={24} />
      
      

      <TextInput
              style={styles.textInput}
              label="Enter Waking Time"
              placeholder="Type something"
              onChangeText={newText => setText(newText)}
              defaultValue={text}
              maxLength={100}
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name="clock"
                      size={24}
                    />
                  )}
                />
              }
            />

        <TextInput
              style={styles.textInput}
              label="Enter Sleeping Time"
              placeholder="Type something"
              onChangeText={newText => setText2(newText)}
              defaultValue={text2}
              maxLength={100}
              left={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name="clock-outline"
                      size={24}
                    />
                  )}
                />
              }
            />

      <Button
              mode="contained-tonal"
              buttonColor='cornflowerblue' textColor='azure'
              disabled={text=='' || text2==''}
              onPress={() =>
                navigation.navigate('Survey3', {name: route.params.name})
              }
              style={styles.button}
            >
              Next Question
            </Button>
      <Button
          onPress={() =>
            navigation.navigate('Survey3', {name: route.params.name})
          }
          style={styles.button}
        >
          Skip
        </Button>
    </View>
    
  );
};

const survey3 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <Text>Check mark the drug you are on {poll} </Text>

      <ProgressBar progress={0.45} color='limegreen'  style={styles.progressBar}/> 

      <View style={styles.row}>
        <Icon //for loop for questions
            name="checkbox-marked-circle"
            size={24}
          />
        
        <Text> INBRINGA</Text>
      </View>
      <View style={styles.row}>
        <Icon
            name="checkbox-blank-circle-outline"
            size={24}
          />
        
        <Text> Ongentys</Text>
      </View>
      <View style={styles.row}>
        <Icon
            name="checkbox-blank-circle-outline"
            size={24}
          />
        
        <Text> Other</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          mode="flat"
          label="Enter other symptoms here"
          multiline
          style={styles.fixedHeight}
        />
      </View>

      


      <View style={styles.button}>
        <Button
          mode="contained-tonal"
          buttonColor='cornflowerblue' textColor='azure'
          onPress={() =>
            navigation.navigate('Survey4', {name: route.params.name})
          }
          style={styles.button}
        >
          Next Question
        </Button>
      </View>

      <View style={styles.button}>
        <Button
          onPress={() =>
            navigation.navigate('Survey4', {name: route.params.name})
          }
          style={styles.button}
        >
          Skip
        </Button>
      </View>

      
      
      

      

      
    </View>
    
  );
};

const survey4 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <Text style={styles.titleText}>Activities List </Text>

      <ProgressBar progress={0.6} color='limegreen'  style={styles.progressBar}/> 

      <View style={styles.row}>
        <Icon //for loop for questions
            name="checkbox-marked-circle"
            size={24}
          />
        
        <Text> Running</Text>
      </View>
      <View style={styles.row}>
        <Icon
            name="checkbox-blank-circle-outline"
            size={24}
          />
        
        <Text> Swimming</Text>
      </View>
      <View style={styles.row}>
        <Icon
            name="checkbox-blank-circle-outline"
            size={24}
          />
        
        <Text> Other</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          mode="flat"
          label="Enter other activities here"
          multiline
          style={styles.fixedHeight}
        />
      </View>


      <View style={styles.button}>
        <Button
          mode="contained-tonal"
          buttonColor='cornflowerblue' textColor='azure'
          onPress={() =>
            navigation.navigate('Survey5', {name: route.params.name})
          }
          style={styles.button}
        >
          Next Question
        </Button>
      </View>

      <View style={styles.button}>
        <Button
          onPress={() =>
            navigation.navigate('Survey5', {name: route.params.name})
          }
          style={styles.button}
        >
          Skip
        </Button>
      </View>

      
      
      

      

      
    </View>
    
  );
};

const survey5 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <Text>Question from database here {poll} </Text>

      <ProgressBar progress={0.75} color='limegreen' style={styles.progressBar} /> 

      <Button
              mode="contained-tonal"
              buttonColor='cornflowerblue' textColor='azure'
              onPress={() =>
                navigation.navigate('Survey6', {name: route.params.name})
              }
              style={styles.button}
            >
              Next Question
            </Button>
    </View>
    
  );
};

const survey6 = ({navigation, route}) => {
  date = new Date()
  const { data: poll, error, isLoading } = useSWR('/polls/1/results/');


  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (error) {
    return (Alert.alert('Alert Title', 'My Alert Msg'))
  }


  return (
    <View>
      <Text style={styles.titleText}>Doctor Info </Text>

      <ProgressBar progress={0.9} color='limegreen' style={styles.progressBar} /> 

      <TextInput
              style={styles.textInput}
              label="Full Name"
              placeholder="Full Name"
              maxLength={100}
            />
      <TextInput
              style={styles.textInput}
              label="Email address"
              placeholder="Email address"
              maxLength={100}
            />

      <TextInput
              style={styles.textInput}
              label="Phone Number"
              placeholder="Phone Number"
              maxLength={100}
            />
      <TextInput
              style={styles.textInput}
              label="Specialty/Expertise"
              placeholder="Specialty/Expertise"
              maxLength={100}
            />

      <Button
              mode="contained-tonal"
              buttonColor='cornflowerblue' textColor='azure'
              onPress={() =>
                navigation.navigate('Profile', {name: route.params.name})
              }
              style={styles.button}
            >
              Next Question
            </Button>
      <Button
          onPress={() =>
            navigation.navigate('Profile', {name: route.params.name})
          }
          style={styles.button}
        >
          Skip
        </Button>
    </View>
    
  );
};


const ProfileScreen = ({navigation, route}) => {
  
  return (
    <View>
      <Avatar.Text
            style={styles.avatar}
            label="XD" size={80}
          />
      <Text>You are inside {route.params.name}'s profile</Text>
    </View>)
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
    color:'cornflowerblue',
    textAlign:"center",
    margin: 4
  },
  button: {
    margin: 4,
  },
  row: {
    margin: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  avatar: {
    margin: 8,
  },
  progressBar: {
    height: 15,
    backgroundColor: 'azure',
    margin: 4,
  },
  textInput:{
    backgroundColor: 'azure',
    margin: 4,
  },
  fixedHeight: {
    height: 100,
    backgroundColor: 'azure',
    margin: 4,
    width: '100%'
  },
  
});

export default App;