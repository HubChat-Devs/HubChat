import * as React from 'react';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default class IconButton extends React.PureComponent {
  render() {
    return (
      <Icon.Button
        style={styles.button}
        name={this.props.name}
        color="white"
        backgroundColor="#3485E4"
        onPress={this.props.onPress}>
        {this.props.children}
      </Icon.Button>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    height: 50,
  },
});
