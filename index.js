const express=require('express')
const axios=require('axios')
const mongoose=require('mongoose')
const { saveOriginalArgs } = require('karma/lib/helper')


const app=express()
app.use(express.json())


mongoose.connect("mongodb://127.0.0.1:27017/test").then(()=>
    console.log("mongodb connected")
).catch(()=>console.log('not connected'))

const weatherScema=new mongoose.Schema(
    {
        temp: Number,
        feels_like:Number,
        temp_min: Number,
        temp_max: Number,
        pressure: Number,
        humidity: Number,
        sea_level: Number,
        grnd_level: Number
    }
);

const Weather =mongoose.model('Weather',weatherScema)

app.get('/save-weather',async (req,res)=>{
    const city=req.query.city
    const apikey='172882a1e97bc06ac0ddb6fba5c5c9ff'

    if(!city)
      return   res.status(400).json({
    message:"please provide the proper city "})

    try{
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
        const reponse=await axios.get(weatherUrl)
        const main=reponse.data.main

        const SaveWeather=new Weather({
            temp: main.temp,
            feels_like:main.feels_like,
            temp_min: main.temp_min,
            temp_max: main.temp_max,
            pressure: main.pressure,
            humidity: main.humidity,
            sea_level: main.sea_level,
            grnd_level: main.grnd_level
        }
        )

       await SaveWeather.save()
        res.status(200).json({SaveWeather})

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch or save weather data' });
      }

})

app.post('/json',(req,res)=>{
    console.log(req.body)
    res.send("received the response")
})

app.listen(3000,()=>{
    console.log(`listening to port 3000`)
})