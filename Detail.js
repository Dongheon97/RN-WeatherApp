import React, { Component } from 'react';
import {FlatList,SafeAreaView, StatusBar, ScrollView, Image,View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import humidity from './weatherIcon/humidity.jpg';
import temp_1 from './weatherIcon/temp_10.jpg';
import temp_2 from './weatherIcon/temp_20.jpg';

import Clouds from './weatherIcon/Clouds.png';
import Clear from './weatherIcon/Clear.png';
import Rain from './weatherIcon/Rain.png';
import Snow from './weatherIcon/Snow.png';
import Fog from './weatherIcon/Fog.png';
import ThunderStorm from './weatherIcon/ThunderStorm.png';
import Strong from './weatherIcon/wind_speed_07.png';
import Medium from './weatherIcon/wind_speed_03.png';
import Weak from './weatherIcon/wind_speed_02.png';



export default class DetailScreen extends Component {
    constructor(props){
        super(props);
        const moment = require('moment');

        this.state = {
            weatherData : [], // Test
            test : false,
            load : false,

        }
    }

    componentMount(){
        return fetch("https://api.openweathermap.org/data/2.5/forecast?q="+ this.props.route.params.text+"&appid=e5ea91bc97a4a071bfb4d4d27fe05ae1")
            .then( (response) => response.json() )
            .then( (responseJson) => {
                this.setState({
                    weatherData : [].concat(responseJson.list[0],responseJson.list[1],responseJson.list[2],responseJson.list[3],responseJson.list[4],responseJson.list[5]),
                    test : true, // 호출이 되면 true로
                    load : true,
                });
//            console.log(this.state); // 테스트용 출력
            })
            .catch((error) => {
                this.ErrorView()
                console.log(error)
            });
    }

    ErrorView(){
        return(
            <View>
                <Text style={{fontSize:30}}>City not found</Text>
            </View>
        );
    }


    WeatherMainImage({weather}){

        if (weather == 'Clouds'){
            return(
                <Text>구름구름</Text>
            );
        }
        else{
            return(
                <img src={Clear} width='50' height='50'/>
            );
        }

    }
    Weather({item}){   // 날씨별 이미지 , 기온 ( 최고, 최저 ) , 습도 까지만 일단 출력
        return(
            <View>
                <Text>{moment(item.dt_txt).format("HH")}시 </Text>
                <View style = {styles.weatherbox}>

                    <View style = {styles.iconbox}>
                        {(item.weather[0].main == "Clouds" ?
                            <img src={Clouds} width = '80' height = '80'/>
                            : item.weather[0].main == "Snow" ?
                                <img src={Snow} width = '80' height = '80'/>
                                : item.weather[0].main == "Clear" ?
                                    <img src={Clear} width = '80' height = '80'/>
                                    : item.weather[0].main == "Rain" ?
                                        <img src={Rain} width = '80' height = '80'/>
                                        : item.weather[0].main == "Drizzle" ?
                                            <img src={Rain} width = '80' height = '80'/>
                                            : item.weather[0].main == "ThunderStorm" ?
                                               <img src={ThunderStorm} width = '80' height = '80'/>
                                               : <img src={Fog} width = '80' height = '80'/>
                                )}
                        {item.weather[0].main}
                    </View>
                    <View style = {styles.iconbox}>
                        {(item.main.temp - 273) > 20 ?
                            <Image  style={{height:100,width:50}}
                                    source={temp_2}/> :
                            <Image  style={{height:100,width:50}}
                                    source={temp_1}/>}
                        {(item.main.temp - 273).toFixed(1) + "'C"}
                    </View>
                    <View style = {styles.iconbox}>
                        <Image style= {{height:100,width:70}}
                               source={humidity}/>
                        {(item.main.humidity)+"%"}
                    </View>
                    <View style = {styles.iconbox}>
                        {(item.wind.speed > 7 ?
                                <img src={Strong} width = '80' height = '80'/>
                                : item.wind.speed > 4 ?
                                    <img src={Medium} width = '80' height = '80'/>
                                    : <img src={Weak} width = '80' height = '80'/>
                        )}
                        {(item.wind.speed) + "m/s"}
                    </View>
                </View>
            </View>
        );
    }
    render(){
        if(!this.state.load) {this.componentMount();}
        if(!this.state.test && this.state.load) { return (<this.ErrorView/>);}
        else{ // 도시 검색 성공
            console.log('render start')
            return(
                <SafeAreaView style = {styles.fullscreen}>
                    <View>
                        <Text style={{fontSize:30 ,margin : 10}}>How is the Weather today</Text>
                        <Text style={{margin : 10}}>검색한 도시</Text>
                        <Text style={{fontSize:30, backgroundColor: '#aaaaaa', borderRadius: 5, padding:5, margin:5}}>
                            {this.props.route.params.text}
                        </Text>
                        <StatusBar style="auto"/>
                    </View>
                    <ScrollView style = {styles.Container}>
                        {this.state.weatherData.map( (item,index) =>// DATA 에 들어있는 컴포넌트 반복 실행
                            <this.Weather key={index} item = {item}/> // Call Weather(item)
                        )}

                    </ScrollView>
                </SafeAreaView>

            );
        }

    }

}

const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
    },

    weatherboxcol:{
        flexDirection : 'col',
        flex : 1,
        justifyContent : 'space-between',
        margin : 10,
        alignItems:'center'

    },
    Container:{
        margin : 10,
        padding : 10,
        borderRadius : 15,
        backgroundColor : 'white'
    },
    weatherbox: {
        flexDirection : 'row',
        margin : 10,
        padding : 5,
        borderWidth : 1,
        justifyContent : 'space-between',

        borderRadius : 3,
        lineHeight: 30,

    },
    iconbox: {
        alignItems:'center',
    },
    Search:{
        backgroundColor : 'black',
        justifyContent : 'center'

    },
});
