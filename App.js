import React,{useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import {Provider} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {
  Login,
  DiaryList,
  DiaryYearList,
  AddEditDiary,
  DiaryDetail,
} from './screens';

import store from './store/index'

const Stack = createStackNavigator();
const App = () => {

  useEffect(()=>{
    SplashScreen.hide();
  },[])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={'Login'}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="DiaryYearList" component={DiaryYearList} />
          <Stack.Screen name="DiaryList" component={DiaryList} />
          <Stack.Screen name="DiaryDetail" component={DiaryDetail} />
          <Stack.Screen name="AddEditDiary" component={AddEditDiary} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
