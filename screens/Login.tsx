import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useMachine} from '@xstate/react';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';
import {COLORS, FONTS, SIZES} from '../constants';

import * as Keychain from 'react-native-keychain';
import jwt from 'react-native-pure-jwt';
import {diaryMachine} from '../src/machines/diaryMachine';
interface InputProps {
  label: string;
  placeHolder: string;
  isError: boolean;
  value: string;
  onFocus: () => void;
  onChangeText: (text: string) => void;
  editable: boolean;
  style?: any;
  secureTextEntry?: boolean;
  errorMessage: string;
}

const Login = ({navigation}: any) => {
  const [state, send] = useMachine(diaryMachine, {
    services: {
      checkUserStatus: async () => {
        const credentials = await Keychain.getGenericPassword();
        return credentials === false
          ? {registered: false}
          : {registered: true, ...credentials};
      },
    },
  });

  const dispatch = useDispatch();
  const userName = useSelector(status => status.userName);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(userName);
  const [nameError, setNameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [firstTime, setFirstTime] = useState<Boolean | null>(false);

  const updateName = (value: any) => {
    // setName(value);
    // if (nameError) {
    //   setNameError(false);
    // }
    send({
      type: 'change username',
      value: value,
    });
  };

  const updatePassword = (value: any) => {
    // setPassword(value);
    // if (passwordError) {
    //   setPasswordError(false);
    // }
    send({
      type: 'change password',
      value: value,
    });
  };

  const registerHandler = async () => {
    // send({
    //   type: 'error userName',
    //   value: true,
    // });
    // if (true) {
    //   return;
    // }
    if (loading) {
      return;
    }

    let canContinue = true;

    if (!Boolean(name)) {
      canContinue = false;
      setNameError(true);
    }

    if (!Boolean(password)) {
      canContinue = false;
      setPasswordError(true);
    }

    if (!canContinue) {
      return;
    }

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
      .then((token: any) => {
        setKeyChain(token);
      }) // token as the only argument
      .catch(() => {
        setLoading(false);
      }); // possible errors
  };
  const setKeyChain = async (userToken: any) => {
    await Keychain.setGenericPassword(name, userToken);
    setLoading(false);
    dispatch(changedDatabaseAction.updateUserName(name));
    navigation.replace('DiaryYearList');
  };

  const checkUserStatus = async () => {
    try {
      if (loading) {
        return;
      }

      if (!Boolean(password)) {
        setPasswordError(true);
        return;
      }
      if (passwordError) {
        setPasswordError(false);
      }

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
        .then((token: any) => {
          setLoading(false);
          if (credentials.password === token) {
            navigation.replace('DiaryYearList');
          } else {
            Alert.alert('Wrong Password', '', [{text: 'ok'}]);
            // console.log('wrong password');
          }
        }) // token as the only argument
        .catch(() => {
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
      if (!Boolean(credentials.password)) {
        setFirstTime(true);
      } else {
        setFirstTime(false);
        dispatch(changedDatabaseAction.updateUserName(credentials.username));
      }
    } catch (error) {
      Alert.alert(`You don't have access!`, '', [{text: 'ok'}]);
    }
  };

  const removeCredentials = async () => {
    try {
      await Keychain.resetGenericPassword();
      // console.log(JSON.parse(credentials));
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  };

  const renderMainContent = (title: string, isRegister = false) => {
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
    const renderInputs = (inputProps: InputProps) => {
      return (
        <View>
          <TextInput
            editable={inputProps.editable}
            style={{
              borderBottomColor: inputProps.isError
                ? COLORS.red
                : COLORS.darkBlue,
              borderBottomWidth: 1,
              height: 40,
              color: COLORS.black,
              ...FONTS.body3,
              ...inputProps.style,
            }}
            secureTextEntry={inputProps.secureTextEntry}
            placeholder={inputProps.placeHolder}
            value={inputProps.value}
            onFocus={inputProps.onFocus}
            onChangeText={inputProps.onChangeText}
          />
          {inputProps.isError ? (
            <Text style={{marginLeft: 0, marginTop: 0, color: COLORS.red}}>
              {inputProps.errorMessage}
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

    const renderTitle = (_title: string) => {
      return (
        <View
          style={{position: 'absolute', elevation: 5, top: 16, left: '20%'}}>
          <Text
            style={{
              color: COLORS.lightYellow,
              textTransform: 'uppercase',
              ...FONTS.h2,
            }}>
            {_title}
          </Text>
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
          {renderInputs({
            label: 'Please enter user name',
            placeHolder: 'UserName',
            isError: nameError,
            value: state.context.userName,
            onFocus: () => {},
            onChangeText: value => updateName(value),
            editable: isRegister ? true : false,
            errorMessage: '',
          })}
          {renderInputs({
            label: 'Please enter password',
            placeHolder: 'Password',
            isError: passwordError,
            value: state.context.password,
            onFocus: () => {},
            onChangeText: value => updatePassword(value),
            editable: true,
            style: {marginTop: 20},
            secureTextEntry: true,
            errorMessage: '',
          })}
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
            justifyContent: 'center',
          }}>
          {renderLeftSideBox()}
          {renderTitle(title)}
          {renderContent()}
          {renderButton()}
        </ScrollView>
      </View>
    );
  };

  // useEffect(() => {
  //   checkLoginStatus();
  // }, []);

  useEffect(() => {
    console.log('state.value===>', state.value);
    console.log('state.context===>', state.context);
  }, [state]);

  useEffect(() => {
    if (state.matches('show register component')) {
      send({
        type: 'register',
      });
    } else if (state.matches('show login component')) {
      send({
        type: 'login',
      });
    }
  }, [state.value]);

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
      }}>
      {
        // state.matches('show register component') &&
        renderMainContent('Register', true)
      }
      {state.matches('show login component') && renderMainContent('Login')}
    </View>
  );
};

export default Login;
