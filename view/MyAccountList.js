import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { AntDesign as Icon } from '@expo/vector-icons';
import signOutAsync from '../firebase/signOut'

const data =  [
        {id:1,  name:"Meu Perfil" , icon:"user" },
        {id:2,  name:"Calendário" , icon:"calendar" },
        {id:3,  name:"Logoff"     , icon:"close" },
      ];
function onPressionar(item , navigation){
  switch(item.id){
    case 1:
      console.log('Meu Perfil Clicado') 
      break //Tela Perfil
    case 2:
      navigation.navigate('Calendario')
      break 
    case 3:
      signOutAsync()
      break //signOutAsync
    default:
      console.log('Botão sem função')
      break
  }
}

const MyAccontList = ({navigation,route}) => {
  const renderItem = ({item}) => (
      <TouchableOpacity onPress={()=>{onPressionar(item,navigation)}}>
        <View style={styles.row}>
          <Icon  name={item.icon} size={30} color="black" />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    
  );
  
  return(
      <View style={{ flex: 1 }} >
        <FlatList 
          data={data}
          keyExtractor = {(item) => {
            return item.id;
          }}
          renderItem={renderItem}/>
          <Text style={styles.txtAlertBottom}>- Minhas Configurações -</Text>
      </View>
    );
  
  };


MyAccontList.navigationOptions = {
  title: 'MyAccontList',
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width:170,
  },
 txtAlertBottom:{
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
    alignSelf:'center',
    justifyContent:'flex-end',
    marginBottom:15,
 }
});

export default MyAccontList;
