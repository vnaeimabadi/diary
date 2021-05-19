import React from 'react';
import {ScrollView, Text, TextInput, View, Button} from 'react-native';

const Login = () => {
  return (
    <ScrollView style={{padding: 20}}>
      <Text style={{fontSize: 27}}>Login</Text>
      <TextInput placeholder="Username" />
      <TextInput placeholder="Password" />
      <View style={{margin: 7}} />
      {/* <Button onPress={this.props.onLoginPress} title="Submit" /> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Login;
