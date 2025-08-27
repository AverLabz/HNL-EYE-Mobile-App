import React,{useEffect,useContext,useState,useRef} from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker,{launchImageLibrary,launchCamera} from 'react-native-image-picker';
import constants from '../constants/constants';
import { DataContext } from '../Context/context-provider';
import { color } from 'react-native-reanimated';
const TaskTickets =({navigation})=> {

    const [value, setValue] = useState(null);
    const [items, setItems] = useState([ ]);
    const controller = useRef(null);
      
    const [companys,setCompanys]= useState([]);
    const [companysToPrint,setCompanysToPrint]= useState([]);
    const [departments,setDepartments]= useState([]);
    const [departmentsToPrint,setDepartmentsToPrint]= useState([]);
    const [tickets,setTickets]= useState([]);
    const [ticketsToPrint,setTicketsToPrint]= useState([]);
    const [isVisibleA,setIsVisibleA] =useState (false);
    const [isVisibleB,setIsVisibleB] =useState (false);
    const [isVisibleC,setIsVisibleC] =useState (false);
    const [ isImageRequired,setIsImageRequired]=useState(true);
    const {GetAllCompany,GetAllDepartment,  GetAllTaskTicketTemplate ,GetAllDepartmentByCompanyId,GetAllticketsTemplatesbydepartmentId} = useContext(DataContext)
    useEffect(() => {
      GetAllCompany ((success, result, error) => {         
        if (success == true) {
          if (result.items.length > 0) {
            setCompanysToPrint(result.items) 
           }    
        }
        else {Alert.alert("error:",error) }
      })
      GetAllDepartment ((success, result, error) => {         
        if (success == true) {
          if (result.items.length > 0) {
            setDepartmentsToPrint(result.items) 
          }      
        }
        else {Alert.alert("error:",error) }
      })
      GetAllTaskTicketTemplate ((success, result, error) => {         
        if (success == true) {
          if (result.items.length > 0) {
            setTicketsToPrint(result.items)    
          }   
        }
        else {Alert.alert("error:",error) }
      })
    }, [])

    const callDepartmentByCompanyId=(id)=>{ 
      GetAllDepartmentByCompanyId (id,(success, result, error) => {         
        if (success == true) {
          if (result.items.length > 0) {
            // setTicketsToPrint(result.items)    
          }   
        }
        else {Alert.alert("error:",error) }
      })
    }
    const callTaskTicketByDepartmentId=(id)=>{
      GetAllticketsTemplatesbydepartmentId (id,(success, result, error) => {         
        if (success == true) {
          if (result.items.length > 0) {
          
          }   
        }
        else {Alert.alert("error:",error) }
      })
    }

    const setCompanyDropdown=(item)=>{  
      setCompanys(item.value)
      callDepartmentByCompanyId(item.id)
    }
    const setDepartmentDropdown=(item)=>{
     
      setDepartments(item.value)
      callTaskTicketByDepartmentId(item.id)
    }
    
    return (
     <SafeAreaView style={{ flex: 1 }}>
     <StatusBar barStyle="light-content" backgroundColor={constants.colorPrimary}/>
        <View style={styles.container}>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >  
      <View style={{flexDirection:'column'}}>
         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      <View style={{flex:1}}>
                            <Text style={{fontSize:15,fontWeight:'600',color:"black",}}>Company:</Text> 
                      </View>
                      <View style={{flex:3}}>
                      <DropDownPicker
                          items={companysToPrint.map(item=> ({label:item.name,value:item.name,id:item.id}))}
                          controller={instance => controller.current = instance}
                          placeholder="Select Company"
                          placeholderStyle={{
                            fontSize: 15,
                            color:'white'
                        }}
                        onChangeList={(items, callback) => {
                          Promise.resolve(setItems(items))
                              .then(() => callback());
                      }}     
                            
                          containerStyle={{height:40}}
                          style={{backgroundColor: '#696969',}}
                          itemStyle={{
                              justifyContent: 'flex-start',
                          }}
                          selectedLabelStyle={{
                            color: 'white'
                        }}
                          arrowColor="white"
                          arrowStyle={{}}
                          dropDownStyle={{backgroundColor: '#CDCDCD',}}
                          onChangeItem={item => setCompanyDropdown(item)}
                          isVisible={isVisibleA}
                          onOpen={() => setIsVisibleA(true)}
                          onClose={() => setIsVisibleA(false)}
                      
                      />  
                  </View>
         </View>
         <View style={{flexDirection:'row',marginTop:10,alignItems:'center',justifyContent:'center'}}>
              <View style={{flex:1}}>
              <Text style={{fontSize:15,fontWeight:'600',color:"black",}}>Department:</Text> 
              </View>
              <View style={{flex:3}}>
              <DropDownPicker
                   items={departmentsToPrint.map(item=> ({label:item.name,value:item.name,id:item.id}))}
                  placeholder="Select Department"
                  containerStyle={{height:40}}
                  style={{backgroundColor: '#696969',}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  placeholderStyle={{
                    fontSize: 15,
                    color:'white'
                }}
                selectedLabelStyle={{
                  color: 'white'
              }}
                  arrowColor="white"
                  dropDownStyle={{backgroundColor: '#CDCDCD',}}
                   onChangeItem={item => setDepartmentDropdown(item)}
                  isVisible={isVisibleB}
                  onOpen={() => setIsVisibleB(true)}
                  onClose={() => setIsVisibleB(false)}
              />  
           </View>
         </View>     
         <View style={{flexDirection:'row',marginTop:10,alignItems:'center',justifyContent:'center'}}>
            <View style={{flex:1}}>
               <Text style={{fontSize:15,fontWeight:'600',color:"black",}}>Ticket Template: </Text>
            </View>
           <View style={{flex:3}}>
                <DropDownPicker
                    items={ticketsToPrint.map(item=> ({label:item.ticketName,value:item.ticketName}))}
                  placeholder="Select Ticket Template"
                  containerStyle={{height:40}}
                  style={{backgroundColor: '#696969',}}
                  itemStyle={{
                      justifyContent: 'flex-start'
                  }}
                  placeholderStyle={{
                    fontSize: 15,
                    color:'white'
                }}
                selectedLabelStyle={{
                  color: 'white'
              }}
                  arrowColor="white"
                  dropDownStyle={{backgroundColor: '#CDCDCD',}}
                  onChangeItem={item => setTickets(item.value)}
                  isVisible={isVisibleC}
                  onOpen={() => setIsVisibleC(true)}
                  onClose={() => setIsVisibleC(false)}
              />  
                        
                    </View>
         </View>
         <View style={{marginTop:10,flexDirection:'row'}}>
            <View style={{flex:1}}>    
            <Text style={{fontSize:17,fontWeight:'600',color:"black",paddingTop:5}}>Remarks: </Text> 
            </View>
            <View style={{flex:3}}>
            <TextInput
                       style={styles.input}
                       placeholder="Please input your ticketName!"
                    
            />
           </View>       
      </View>
         <View style={{padding:10,}}>
            <Text style={{ fontWeight: '700', fontSize: 16, padding: 5 }}>
             Image User
                <Text style={{ fontWeight: '700', fontSize: 16,color:constants.colorPrimary }}>
                *
            </Text>
            </Text>

            <TouchableOpacity onPress={() => Alert.alert("Pls Select a picture")}>
              <Image
                style={{
                  height: 150,
                  backgroundColor: "#878787",
                  margin: 20,
                  marginTop: 10,
                }}
                source={{
                //   uri: imageSource,
                  cache:'reload'
                }}
                // key={imageSource}
                
              />
            </TouchableOpacity>
            </View>
    </View>
        </ScrollView>
        </View>
     </SafeAreaView>
        
        );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
      },
     input: {
        height: 37,
        borderWidth: 1,
        flex:1,
        borderRadius:5,
        borderColor:'gray'
      },
 
})
export default TaskTickets;
