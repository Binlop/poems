import React from 'react'
import { View, Image, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
const img_pause = require('./resources/audio/ui_pause.png');
const img_play = require('./resources/audio/ui_play.png');



export default class PlayerScreen extends React.Component{

    static navigationOptions = props => ({
        title:props.navigation.state.params.title,

    })
    constructor(props){
        super(props);
        this.state = {
            playState:'paused', //playing, paused
            playSeconds:0,
            duration:0,
        }
        this.audioCreator =  this.props.audioCreator;
        this.sliderEditing = false;
    }

    componentDidMount(){
        // Специальный метод, вызывается после создания класса, определяет функцию, которая будет вызываться каждые n милисекунд(в данном случае 100)
        // В данном случае проверяется, что аудио загружено и устанавливается текущее время воспроизведения аудио в state

        this.timeout = setInterval(() => {
            if(this.sound && this.sound.isLoaded() && this.state.playState == 'playing' && !this.sliderEditing){
                this.sound.getCurrentTime((seconds, isPlaying) => {
                    this.setState({playSeconds:seconds});
                })
            }
        }, 100);
    }
    componentWillUnmount(){
        // Этот метод вызывается при завершении ЖЦ компонента, удаляется аудио из воспроизведения, а также отменяется вызов функции каждые 100 милисекунд
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }

    onSliderEditStart = () => {
        // Метод сигнализирует, что клиент перетягивает в данный момент ползунок
        this.sliderEditing = true;
    }
    onSliderEditEnd = () => {
         // Метод сигнализирует, что клиент перестал перетягивать в данный момент ползунок
        this.sliderEditing = false;
    }
    onSliderEditing = value => {
        // Принимает переданное значение от слайдера и устанавливает его в текущее время аудио и в состояние playSeconds
        if(this.sound){
            this.sound.setCurrentTime(value);
            this.setState({playSeconds:value});
        }
    }

    play = async () => {
        if (this.sound) {
            this.sound.play(this.playComplete(true));
            this.setState({ playState: 'playing' });
        } else {
            const AudioUrl = this.props.audio;
            this.sound = new Sound(AudioUrl, '', (error, _sound) => {
                if (error) {
                    console.log('Error loading sound: ', error);
                } else {
                    if(this.sound){
                        this.setState({ duration: this.sound.getDuration() });
                        this.sound.play(this.playComplete(true));
                        this.setState({ playState: 'playing' });
                    }
                }
            });
        }
    };
    

    playComplete = (success) => {
        if(this.sound){
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            this.setState({playState:'paused', playSeconds:0});
            this.sound.setCurrentTime(Math.max(0, this.state.playSeconds));
        }
    }

    pause = () => {
        if(this.sound){
            this.sound.pause();
            this.setState({ playState: 'paused'});
        }
    }

    getAudioTimeString(seconds){
        const h = parseInt(seconds/(60*60));
        const m = parseInt(seconds%(60*60)/60);
        const s = parseInt(seconds%60);

        return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
    }

    render(){

        const currentTimeString = this.getAudioTimeString(this.state.playSeconds);
        const durationString = this.getAudioTimeString(this.state.duration);

        return (
            <View style={{ flex: 1}}>
                <View style={{ flexDirection: 'row'}}>
                    {this.state.playState == 'playing' && (
                        <TouchableOpacity onPress={this.pause} style={{ flexDirection: 'row' }}>
                            <Text style={{marginRight: 10, fontSize: 18 }}>{this.audioCreator}</Text>
                            <Image source={img_pause} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    )}
                    {this.state.playState == 'paused' && (
                        <TouchableOpacity onPress={this.play} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: 10, fontSize: 18 }}>{this.audioCreator}</Text>
                            <Image source={img_play} style={{ width: 30, height: 30 }} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ marginVertical: 15, flexDirection: 'row' }}>
                    <Text style={{}}>{currentTimeString}</Text>
                    <Slider
                        onTouchStart={this.onSliderEditStart}
                        onTouchEnd={this.onSliderEditEnd}
                        onValueChange={this.onSliderEditing}
                        value={this.state.playSeconds} maximumValue={this.state.duration}
                        style={{ flex: 1 }} />
                        <Text>{durationString}</Text>
                </View>
            </View>
        )
    }
}