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
  const userName = useSelector(status => status.userName);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userName);
  const [nameError, setNameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
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
    } catch (error) {
      setLoading(false);
      Alert.alert(`You don't have access!`, '', [{text: 'ok'}]);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      // removeCredentials()
      if (credentials.password == undefined) {
        setFirstTime(true);
      } else {
        setFirstTime(false);
      }
    } catch (error) {
      Alert.alert(`You don't have access!`, '', [{text: 'ok'}]);
    }
  };

  const removeCredentials = async () => {
    try {
      const credentials = await Keychain.resetGenericPassword();
      console.log(JSON.parse(credentials));
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const renderMainContent = (title, isRegister = false) => {
    const renderLoginButton = () => {
      return (
        <TouchableOpacity onPress={checkUserStatus}>
          <View
            style={{
              height: '100%',
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
      );
    };

    const renderRegisterButton = () => {
      return (
        <TouchableOpacity onPress={registerHandler}>
          <View
            style={{
              height: '100%',
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
      );
    };

    const renderName = () => {
      return (
        <View>
          <TextInput
            editable={isRegister ? true : false}
            style={{
              borderBottomColor: nameError ? COLORS.red : COLORS.darkBlue,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.black,
              ...FONTS.body3,
            }}
            // secureTextEntry={isRegister ? false : true}
            placeholder="Name"
            value={name}
            onChangeText={value => updateName(value)}
          />
          {nameError ? (
            <Text style={{marginLeft: 0, marginTop: 0, color: COLORS.red}}>
              please enter name
            </Text>
          ) : null}
        </View>
      ) ;
    };

    const renderPassword = () => {
      return (
        <View>
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
        </View>
      );
    };

    const renderLeftSideBox = () => {
      return (
        <View
          style={{
            width: '50%',
            height: SIZES.height / 1.8,
            backgroundColor: COLORS.darkBlue,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            elevation: 5,
          }}
        />
      );
    };

    const renderTitle = title => {
      return (
        <View
          style={{position: 'absolute', elevation: 5, top: 16, left: '20%'}}>
          <Text style={{color: COLORS.lightYellow, ...FONTS.h2}}>{title}</Text>
        </View>
      );
    };

    const renderContent = () => {
      return (
        <View
          style={{
            position: 'absolute',
            width: '75%',
            height: 200,
            backgroundColor: COLORS.white,
            left: '15%',
            borderRadius: 15,
            elevation: 5,
            padding: 20,
            justifyContent: 'center',
          }}>
          {renderName()}
          {renderPassword()}
        </View>
      );
    };

    const renderButton = () => {
      return (
        <View
          style={{
            position: 'absolute',
            width: '35%',
            height: 46,
            backgroundColor: COLORS.blue,
            left: '35%',
            bottom: '15%',
            borderRadius: 5,
            elevation: 5,
          }}>
          {isRegister ? renderRegisterButton() : renderLoginButton()}
        </View>
      );
    };

    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}>
        <ScrollView
          contentContainerStyle={{
            // padding: 12,
            justifyContent: 'center',
          }}>
          {/* <Text style={{fontSize: 27}}>{title}</Text>
          {renderName()}
          {renderPassword()}
          <View style={{margin: 7}} />
          {isRegister ? renderRegisterButton() : renderLoginButton()} */}

          {renderLeftSideBox()}
          {renderTitle(title)}
          {renderContent()}
          {renderButton()}
        </ScrollView>
      </View>
    );
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
      }}>
      {firstTime == null
        ? null
        : firstTime == true
        ? renderMainContent('Register', true)
        : renderMainContent('Login')}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
