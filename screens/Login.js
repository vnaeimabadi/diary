import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';
import {COLORS, FONTS, SIZES, icons, theme} from '../constants';

import * as Keychain from 'react-native-keychain';
import jwt from 'react-native-pure-jwt';

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [result, setResult] = useState('');
  const [firstTime, setFirstTime] = useState(null);

  const updateName = value => {
    setName(value);
    if (nameError) setNameError(false);
  };

  const updatePassword = value => {
    setPassword(value);
    if (passwordError) setPasswordError(false);
  };

  const registerHandler = async () => {
    let canContinue = true;
    if (name == null || name == '') {
      canContinue = false;
      setNameError(true);
    } else {
      if (nameError) setNameError(false);
    }

    if (password == null || password == '') {
      canContinue = false;
      setPasswordError(true);
    } else {
      if (passwordError) setPasswordError(false);
    }

    if (!canContinue) return;

    if (loading) return;

    setLoading(true);
    jwt
      .sign(
        {
          password: password,
        },
        password, // secret
        {
          alg: 'HS256',
        },
      )
      .then(token => {
        setKeychain(token);
      }) // token as the only argument
      .catch(err => {
        setLoading(false);
      }); // possible errors
  };
  const setKeychain = async userToken => {
    const dd = await Keychain.setGenericPassword(name, userToken);
    setLoading(false);
    dispatch(changedDatabaseAction.updateUserName(name));
    navigation.replace('DiaryYearList');
  };

  const checkUserStatus = async () => {
    try {
      if (password == null || password == '') {
        setPasswordError(true);
        return;
      } else {
        if (passwordError) setPasswordError(false);
      }

      if (loading) return;

      setLoading(true);
      const credentials = await Keychain.getGenericPassword();

      // console.log(credentials.password);
      //   console.log(JSON.parse(credentials));
      //   setResult(JSON.parse(credentials))
      //   var decoded = jwt.verify(jwtToken, password);
      //   console.log(decoded.password);
      jwt
        .sign(
          {
            password: password,
          },
          password, // secret
          {
            alg: 'HS256',
          },
        )
        .then(token => {
          setLoading(false);
          if (credentials.password == token) {
            navigation.replace('DiaryYearList');
          } else {
            Alert.alert('Wrong Password', '', [{text: 'ok'}]);
            // console.log('wrong password');
          }
        }) // token as the only argument
        .catch(err => {
          setLoading(false);
        });

      // jwt
      //   .decode(
      //     jwtToken, // the token
      //     password, // the secret
      //     {
      //       skipValidation: true, // to skip signature and exp verification
      //     },
      //   )
      //   .then(console.log) // already an object. read below, exp key note
      //   .catch(console.error);
    } catch (error) {
      setLoading(false);
      Alert.alert(`You don't have access!`, '', [{text: 'ok'}]);
      // console.log("Keychain couldn't be accessed!", error);
      setResult(error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      // console.log(credentials.password);
      // removeCredentials()
      if (credentials.password == undefined) {
        setFirstTime(true);
      } else {
        setFirstTime(false);
      }
    } catch (error) {
      Alert.alert(`You don't have access!`, '', [{text: 'ok'}]);
      // console.log("Keychain couldn't be accessed!", error);
      setResult(error);
    }
  };

  // const removeCredentials = async () => {
  //   try {
  //     const credentials = await Keychain.resetGenericPassword();
  //     console.log(JSON.parse(credentials));
  //     setResult(JSON.parse(credentials));
  //   } catch (error) {
  //     console.log("Keychain couldn't be accessed!", error);
  //   }
  // };


  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <ScrollView style={{padding: 20}}>
      {firstTime == null ? null : firstTime == true ? (
        <View>
          <Text style={{fontSize: 27}}>Register</Text>
          <TextInput
            style={{
              borderBottomColor: nameError ? COLORS.red : COLORS.darkBlue,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.black,
              ...FONTS.body3,
            }}
            placeholder="Name"
            value={name}
            onChangeText={value => updateName(value)}
          />
          {nameError ? (
            <Text style={{marginLeft: 0, marginTop: 0, color: COLORS.red}}>
              please enter name
            </Text>
          ) : null}
          <TextInput
            style={{
              marginTop: 20,
              borderBottomColor: passwordError ? COLORS.red : COLORS.darkBlue,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.black,
              ...FONTS.body3,
            }}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={value => updatePassword(value)}
          />
          {passwordError ? (
            <Text style={{marginLeft: 0, color: COLORS.red}}>
              please enter password
            </Text>
          ) : null}
          <View style={{margin: 7}} />
          <TouchableOpacity onPress={registerHandler}>
            <View
              style={{
                backgroundColor: COLORS.darkBlue,
                height: 36,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={{color: COLORS.white}}>Register</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={{fontSize: 27}}>Login</Text>

          <TextInput
            style={{
              marginTop: 20,
              borderBottomColor: passwordError ? COLORS.red : COLORS.darkBlue,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.black,
              ...FONTS.body3,
            }}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={value => updatePassword(value)}
          />
          {passwordError ? (
            <Text style={{marginLeft: 0, marginTop: 0, color: COLORS.red}}>
              please enter password
            </Text>
          ) : null}
          <View style={{margin: 7}} />
          <TouchableOpacity onPress={checkUserStatus}>
            <View
              style={{
                backgroundColor: COLORS.darkBlue,
                height: 36,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={{color: COLORS.white}}>Login</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Login;
