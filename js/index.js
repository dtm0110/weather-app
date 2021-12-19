const $ = document.querySelector.bind(document)
const DEFAULT_VALUE = '--'
const API_ID = '379740fc72e33787af8b40cba2c3e2f9'
const searchInput = $('#search-input')
const cityName = $('.city-name') 
const weatherState = $('.weather-state')
const weatherIcon = $('.weather-icon')
const temperature = $('.weather-temperature')
const sunrise = $('.sunrise')
const sunset = $('.sunset')
const humidity = $('.humidity')
const windSpeed = $('.wind-speed')
const container = $('.container')

const microphone = $('.microphone')

searchInput.addEventListener('change',(e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=${API_ID}&units=metric&lang=vi`)
        .then(response => response.json())
        .then(response => {
            console.log("response: ", response);
            setValueApp(response)
        })
})

const setValueApp = (data) => {
    cityName.innerHTML = data.name || DEFAULT_VALUE
    weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE
    weatherIcon.setAttribute('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    temperature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE
    sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE
    sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE
    humidity.innerHTML = data.main.humidity || DEFAULT_VALUE
    windSpeed.innerHTML = (data.wind.speed *3.6).toFixed(2) || DEFAULT_VALUE
}


//Tro Ly ao

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()
const synth = window.speechSynthesis
recognition.lang = 'vi-VI'
recognition.continuous = false

const speak = (text) => {
    if(synth.speaking){
        console.log("Busy. Speakingg....")
        return
    }

    const utter = new SpeechSynthesisUtterance(text)
    utter.onend = () => {
        console.log("ok")
    }
    utter.onerror = (err) => {
        console.error("Error: ", e)
    }
    synth.speak(utter)
}

const handleVoice = (text) => {
    console.log("text: ", text);
    const handleText = text.toLowerCase()
    if(handleText.includes('thời tiết tại')){
        const location = handleText.split('tại')[1].trim()
        console.log("location: ", location);
        // const arrayText = text.split(' ')
        // let location = arrayText[arrayText.length - 2] + ' ' + arrayText[arrayText.length -1]
        // console.log("arrayText: ", arrayText);
        
        searchInput.value = location
        const changeEvent = new Event('change')
        searchInput.dispatchEvent(changeEvent)
        return
   }
   if(handleText.includes('thay đổi màu nền')){
       const color = handleText.split('màu nền')[1].trim()
       container.style.background = color
       return
   }
   if(handleText.includes('màu nền mặc định')){
        container.style.background = ''
        return
   }
   if(handleText.includes('mấy giờ')){
       const momentHour = `${moment().hour()} hour ${moment().minute()} minutes`
       speak(momentHour)
       return
   }
   speak("Try again")

}

microphone.addEventListener('click', (e) => {
    e.preventDefault()

    recognition.start()
    microphone.classList.add('recording')
})

recognition.onspeechend = () => {
    recognition.stop()
    microphone.classList.remove('recording')
}

recognition.onerror = (err) => {
    console.log(err)
    microphone.classList.remove('recording')
}

recognition.onresult = (e) => {
    console.log("onresult: ", e);
    const text = e.results[0][0].transcript
    handleVoice(text)
}


