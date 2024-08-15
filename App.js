import { StyleSheet, View, Image, ActivityIndicator, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useSWR from 'swr';
import { SWRConfig } from 'swr'
import tulip from './ios/tulip.png'
import { Button, Text, TextInput, Avatar, ProgressBar, RadioButton, useTheme, } from 'react-native-paper';
import axios from "axios";
import DatePicker from 'react-native-date-picker';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <SWRConfig value={{fetcher: url => axios.get(url).then(res => res.data) }}>
     <AppStack></AppStack>
    </SWRConfig>
  );
  
};

function AppStack() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{title: 'Welcome!'}}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Home'}}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen}/>
        <Stack.Screen name="Profile" component={Survey} initialParams={{surveyName: 'Profile'}}/>
        <Stack.Screen name="Morning" component={Survey} initialParams={{surveyName: 'Morning'}}/>
        <Stack.Screen name="Hourly" component={Survey} initialParams={{surveyName: 'Hourly'}}/>
        <Stack.Screen name="Evening" component={Survey} initialParams={{surveyName: 'Evening'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const Survey = ({navigation, route}) => {

  const { data: survey, error, isLoading } = useSWR('http://127.0.0.1:8000/polls/surveys/by_name/'+route.params.surveyName);

  if (isLoading) {
    return (<ActivityIndicator size="large" />);
  }

  if (!(error instanceof TypeError) && error) {
    return (Alert.alert('Alert Title', error))
  }

  let questions = [];

  for (count in survey.questions) {
    const question = survey.questions[count];
    const currInd = 1+parseInt(count);
    questions.push(<Stack.Screen name={"Question"+currInd} key={""+ question} component={ChoiceQuestion} options={{title: 'Question '+ currInd}} initialParams={{questionId: question, currentQ: (currInd), totalQ: survey.questions.length}} />);
  }

  if (questions.length == 0) {
    questions = <Stack.Screen name="Error" component={ErrorScreen}/>
  }

  return (
    <Stack.Navigator>{questions}</Stack.Navigator>
  )

}

const ErrorScreen = ({navigation}) => {
  return(
    <View>
      <Text style={styles.error}>No questions in survey</Text>
    </View>
  )
}


const WelcomeScreen = ({navigation}) => {

  const [token, setToken] = useState('')

  useEffect(() => {
    AsyncStorage.getItem('token').then((key) => {
      setToken(key);
      if (token) {
        axios.defaults.headers.common['Authorization'] = 'Token ' + token;
        navigation.dispatch(StackActions.replace('Home'));
      }
      
    });
  }, [token]);

  return(
  <View style={styles.container}>
    <Text style={styles.titleText}>
      Welcome to Symptom Tracker!
    </Text>
    <Button onPress={() =>navigation.navigate('Login')} buttonColor={'cornflowerblue'} textColor='azure'>Continue</Button>
    <Text>We recommend you complete this profile with the help of a doctor, if possible.</Text>
    
    <Image source={tulip} className="rctlogo" alt="recty" style={{width: 125, height: 220, margin: 25}}/>
      
   </View>
  )   
};

const HomeScreen = ({navigation, route}) => {

  function logout() {
    axios.defaults.headers.common['Authorization'] = undefined;
    AsyncStorage.removeItem('token').then(() => {
      navigation.dispatch(StackActions.replace('Login'))
    })
  }

  return (
    <View>
      <Text>Welcome home. </Text>
      
      
      <Button style={styles.button} onPress={() =>navigation.navigate('Morning')} buttonColor={'cornflowerblue'} textColor='azure'>Morning Check-in</Button>
      <Button style={styles.button} onPress={() =>navigation.navigate('Hourly')} buttonColor={'cornflowerblue'} textColor='azure'>Hourly Check-in</Button>
      <Button style={styles.button} onPress={() =>navigation.navigate('Evening')} buttonColor={'cornflowerblue'} textColor='azure'>Evening Check-in</Button>
      <Button style={styles.button} onPress={() =>navigation.navigate('Profile')} buttonColor={'cornflowerblue'} textColor='azure'>Profile Survey</Button>

      <Button style = {styles.button} mode="contained-tonal"
        onPress={logout}
      >Log out</Button>
    </View>
    
  );
};

function Choice ({choice, onChange, q_type, checked}) {
  const [one, setOne] = useState('cornflowerblue')
  const { isV3 } = useTheme();
  const TextComponent = isV3 ? Text : Paragraph;

  function handleChange(e) {
    onChange(choice);
  }

  async function changeColor() {
    if (one == 'cornflowerblue') {
      setOne('darkgray')
    }
    else{
      setOne('cornflowerblue')
    }
    onChange(choice, one)
  }
  if (q_type == "MC") {
    return (
      <View style={styles.row}>
        <Button onPress={changeColor} buttonColor={one} textColor='azure'>{choice.choice_text}</Button>
      </View>
    )
  
  }

  return(
  <View style={styles.row}>
    <TextComponent>{choice.choice_text}</TextComponent>
    <RadioButton.IOS
      value="normal-item"
      status={checked === choice.id ? 'checked' : 'unchecked'}
      onPress={handleChange}
    />
  </View>
  )
  
}

const ChoiceQuestion = ({navigation, route}) => {

  const [text, setText] = useState('');
  const [checked, setChecked] = React.useState(-1);
  const [date, setDate] = useState(new Date());


  const path = 'http://127.0.0.1:8000/polls/questions/'+route.params.questionId;

  const { data: quiz, error, isLoading } = useSWR(path);
  const { data: choices, error2, isLoading2 } = useSWR(path + '/choices/');

  const [currentChoices, setCurrentChoices] = useState([])

  function onSelect(choice, color) {
    if (color=='cornflowerblue') {
      setCurrentChoices([...currentChoices, choice])
    }
    else if (color=='darkgray'){
      setCurrentChoices(currentChoices.filter(c => choice.id != c.id))
    }
    else {
      setCurrentChoices([...currentChoices, choice])
      setChecked(choice.id)
    }
  }

  async function nextQuestion() {
    
    try {
      if (text!="") {
        await axios.post(path+'/votes/', {other_text: text, type: "text"});
      }
      if (quiz.q_type=='DT') {
        await axios.post(path+'/votes/', {date: date.toLocaleDateString('en-US'), type: "date"});
      }
      if (quiz.q_type=='TM') {
        await axios.post(path+'/votes/', {time: date.getHours()+":"+date.getMinutes(), type: "time"});
      }
      for (choice in currentChoices) {
        const {data} = await axios.post(path+'/choices/'+currentChoices[choice].id+'/votes/');
      }
      setCurrentChoices([]);
      if (route.params.currentQ==route.params.totalQ) {
        navigation.navigate('Home')
      }
      else{
        navigation.navigate('Question'+(route.params.currentQ+1));
      }
    }
    catch (error) {
      //do it again
    }
  }

  function skipQuestion() {
    if (route.params.currentQ==route.params.totalQ) {
      navigation.navigate('Home')
    }
    else{
      navigation.navigate('Question'+(route.params.currentQ+1));
    }
  }

  if (isLoading || isLoading2 ) {
    return (<ActivityIndicator size="large" />);
  }

  if (error || error2) {
    return (Alert.alert('Alert Title', error))
  }

  let choice = []
  let otherChoice = <></>

  for (count in choices) {
    if (choices[count].choice_text != "other" && choices[count].choice_text != "date" && choices[count].choice_text != "time") {
      choice.push(<Choice choice={choices[count]} onChange={onSelect} key={""+choices[count].id} q_type={quiz.q_type} checked={checked}></Choice>);
    }
  }
  

  let isEmptyChoices = false;
  if (!choices || choices.length == 0) {
    isEmptyChoices = true;
  }

  if (quiz.q_type=="MC" || (isEmptyChoices && quiz.q_type!='DT' && quiz.q_type!='TM')) {
    otherChoice = 
    <View style={styles.row}>
      <TextInput
        mode="flat"
        label={isEmptyChoices ? "" : "Enter others here"}
        onChangeText={newText => setText(newText)}
        multiline
        style={styles.fixedHeight}
      />
    </View>
  }

  let dateComponent = <></>

  if (quiz.q_type=="DT") {
    dateComponent=
    <View style={styles.row}>
      <DatePicker date={date} onDateChange={setDate} mode='date'/>
    </View>
  }

  if (quiz.q_type=="TM") {
    dateComponent=
    <View style={styles.row}>
      <DatePicker date={date} onDateChange={setDate} mode='time'/>
    </View>
  }


  return (
    <View>

      <ProgressBar progress={route.params.currentQ/route.params.totalQ} color='limegreen'  style={styles.progressBar}/> 

      <Text style={styles.questions}>
        {quiz.question_text}
      </Text>

      {dateComponent}
      {choice}
      {otherChoice}
      

      <View style={styles.button}>
        <Button
          mode="contained-tonal"
          buttonColor='cornflowerblue' textColor='azure'
          disabled={text=='' && currentChoices.length==0 && quiz.q_type!='DT' && quiz.q_type!='TM'}
          onPress={nextQuestion}
          style={styles.button}
        >
          Next Question
        </Button>
      </View>

      <View style={styles.button}>
        <Button
          onPress={skipQuestion}
          style={styles.button}
        >
          Skip
        </Button>
      </View>

      
      
      

      

      
    </View>
    
  );
};


const LoginScreen = ({navigation, route}) => {

  const [pwd, setPwd] = useState('');
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState('');


  async function handleUser() {
    try {
      const {data} = await axios.post('http://127.0.0.1:8000/dj-rest-auth/login/', {username: username, password: pwd});
      
      axios.defaults.headers.common['Authorization'] = 'Token ' + data.key;
      await AsyncStorage.setItem('token', data.key);
      navigation.dispatch(StackActions.replace('Home'));
    }
    catch (error) {
      setErrorText('Incorrect username or password')
    }

  }

  async function register() {
    navigation.navigate('Register');
  }
  
  return (
    <View>
      <Avatar.Text
            style={styles.avatar}
            label="XD" size={80}
          />
      <Text>Please log in.</Text>
      <TextInput style={styles.textInput}
              label="Enter Username Here"
              onChangeText={newText => setUsername(newText)}
              value={username}
              autoCapitalize='none'
              placeholder="Username"
              maxLength={100}></TextInput>
      <TextInput style={styles.textInput}
              secureTextEntry = {true}
              label="Enter Password Here"
              value={pwd}
              onChangeText={newText => setPwd(newText)}
              placeholder="Password"
              maxLength={100}></TextInput>

      <Button mode="contained-tonal" style={styles.button} onPress={handleUser}>Log In</Button>
      <Button style={styles.button} buttonColor='deepskyblue' textColor='azure' onPress={register}>Register</Button>
      <Text style={styles.error}>{errorText}</Text>
    </View>)
};

const RegistrationScreen = ({navigation, route}) => {

  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');


  async function register() {
    try {
      const {data} = await axios.post('http://127.0.0.1:8000/dj-rest-auth/registration/', {username: username, password1: pwd, password2: pwd2, email: email});
      
      axios.defaults.headers.common['Authorization'] = 'Token ' + data.key;
      await AsyncStorage.setItem('token', data.key);
      navigation.dispatch(StackActions.replace('Home'));
      navigation.navigate('Profile');
    }
    catch (error) {
      setErrorText('Incorrect username or password')
    }

  }
  
  return (
    <View>
      <Avatar.Text
            style={styles.avatar}
            label="XD" size={80}
          />
      <Text>Please log in, balloon lover.</Text>
      <TextInput style={styles.textInput}
              label="Enter Username Here"
              onChangeText={setUsername}
              value={username}
              autoCapitalize='none'
              placeholder="Username"
              maxLength={100}></TextInput>
      <TextInput style={styles.textInput}
              secureTextEntry = {true}
              label="Enter Password Here"
              value={pwd}
              onChangeText={setPwd}
              placeholder="Password"
              maxLength={100}></TextInput>
      <TextInput style={styles.textInput}
              secureTextEntry = {true}
              label="Confirm Password"
              value={pwd2}
              onChangeText={setPwd2}
              placeholder="Password"
              maxLength={100}></TextInput>
      <TextInput style={styles.textInput}
              label="Enter Email Here"
              value={email}
              autoCapitalize='none'
              onChangeText={setEmail}
              placeholder="Email"
              maxLength={100}></TextInput>

      <Button mode="contained-tonal" style={styles.button} onPress={register}>Enter</Button>
      
      <Text style={styles.error}>{errorText}</Text>
    </View>)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    margin: 4,
    textAlign: 'center',
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
    alignItems: 'center',
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
  questions:{
    backgroundColor: 'azure',
    margin: 4,
    fontSize: 18,
  },
  fixedHeight: {
    height: 100,
    backgroundColor: 'azure',
    margin: 4,
    width: '100%'
  },
  
});

export default App;