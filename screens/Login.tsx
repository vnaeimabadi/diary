import React, {useCallback, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants';
import {useLoginRegisterMachine} from '../src/hooks/machines/use-loginRegisterMachine';

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
  const {state, send} = useLoginRegisterMachine();

  const updateName = (value: any) => {
    send({
      type: 'FILL_USERNAME',
      value: value,
    });
  };

  const updatePassword = (value: any) => {
    send({
      type: 'FILL_PASSWORD',
      value: value,
    });
  };

  const loginRegisterHandler = () => {
    if (state?.context?.userStatus?.registered) {
      send({
        type: 'SUBMIT_LOGIN',
      });
    } else {
      send({
        type: 'SUBMIT_REGISTER',
      });
    }
  };

  // const removeCredentials = async () => {
  //   try {
  //     await Keychain.resetGenericPassword();
  //     // console.log(JSON.parse(credentials));
  //   } catch (error) {
  //     // console.log("Keychain couldn't be accessed!", error);
  //   }
  // };

  const renderMainContent = () => {
    const renderSingleButton = ({title}: {title: string}) => {
      return (
        <TouchableOpacity
          disabled={
            state.matches('login flow.awaitingLogin') ||
            state.matches('register flow.awaitingRegister')
          }
          onPress={loginRegisterHandler}>
          <View
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {state.matches('register flow.awaitingRegister') ||
            state.matches('login flow.awaitingLogin') ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={{color: COLORS.white}}>{title}</Text>
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
            isError: state.matches('register flow.userNameErr.too_Short'),
            value: state.context.userName,
            onFocus: () => {},
            onChangeText: value => updateName(value),
            editable: !state?.context?.userStatus?.registered,
            errorMessage: 'too short username',
          })}
          {renderInputs({
            label: 'Please enter password',
            placeHolder: 'Password',
            isError:
              state.matches('login flow.passwordErr.incorrect') ||
              state.matches('login flow.passwordErr.tooShort') ||
              state.matches('register flow.passwordErr.tooShort'),
            value: state.context.password,
            onFocus: () => {},
            onChangeText: value => updatePassword(value),
            editable: true,
            style: {marginTop: 20},
            secureTextEntry: true,
            errorMessage: state.matches('login flow.passwordErr.incorrect')
              ? 'in correct password'
              : 'too short password',
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
          {!state?.context?.userStatus?.registered
            ? renderSingleButton({title: 'Register'})
            : renderSingleButton({title: 'Login'})}
          {/* : renderLoginButton()} */}
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
          {renderTitle(
            state?.context?.userStatus?.registered ? 'Login' : 'Register',
          )}
          {renderContent()}
          {renderButton()}
        </ScrollView>
      </View>
    );
  };

  // useEffect(() => {
  //   console.log('state.value===>', state.value);
  //   console.log('state.context===>', state.context);
  // }, [state]);

  const canNavigate =
    state.matches('register flow.registered') ||
    state.matches('login flow.loggedIn');
  const navigateToDiary = useCallback(() => {
    if (
      state.matches('register flow.registered') ||
      state.matches('login flow.loggedIn')
    ) {
      navigation.replace('DiaryYearList', {userName: state.context.userName});
    }
  }, [navigation, state]);

  useEffect(() => {
    navigateToDiary();
  }, [canNavigate, navigateToDiary]);

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
      }}>
      {state?.context?.userStatus && renderMainContent()}
    </View>
  );
};

export default Login;
