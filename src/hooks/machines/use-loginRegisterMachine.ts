import {useMachine} from '@xstate/react';
import * as Keychain from 'react-native-keychain';
import jwt from 'react-native-pure-jwt';
import {loginRegisterMachine} from '../../machines/loginRegisterMachine';

export const useLoginRegisterMachine = () => {
  const [state, send] = useMachine(loginRegisterMachine, {
    services: {
      checkUserStatus: async context => {
        const credentials: any = await Keychain.getGenericPassword();
        console.log('credentials?.username', credentials?.username);

        if (credentials?.username) {
          context.userName = credentials.username;
        }
        return credentials === false
          ? {...context.userStatus, registered: false}
          : {registered: true, ...credentials};
      },
      register: async ctx => {
        const userToken = await jwt.sign(
          {
            password: ctx.password,
          },
          ctx.password, // secret
          {
            alg: 'HS256',
          },
        );
        await Keychain.setGenericPassword(ctx.userName, userToken);
      },
      login: async ctx => {
        const userToken = await jwt.sign(
          {
            password: ctx.password,
          },
          ctx.password, // secret
          {
            alg: 'HS256',
          },
        );
        const credentials: any = await Keychain.getGenericPassword();
        if (credentials?.password !== userToken) {
          throw new Error('Wrong Password');
        }
      },
    },
  });
  return {state, send};
};
