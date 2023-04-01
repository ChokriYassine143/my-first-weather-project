const express=require("express");
const bodyp=require("body-parser");
const ht=require("https");
const fs = require('fs');
const cheerio = require('cheerio');
const app=express();
app.use(bodyp.urlencoded({extended:true}));
app.get("/myweather",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/myweather",(req,res)=>{
    x=req.body.country;
    const url="https://api.openweathermap.org/data/2.5/weather?q=+"+x+"&appid=44af9c11a4b4b516b3251d004072bb02";
    ht.get(url,(response)=>{
      if (response.statusCode===200){
      
    
        console.log(response.statusCode);
        response.on("data",(data)=>{
            const weathd=  JSON.parse(data);
            let weath=Number(weathd.main.temp)-273.15;
            let desc=(weathd.weather[0].description);
            let y=weathd.weather[0].icon;
            console.log(y);
            const ic= "https://openweathermap.org/img/wn/"+y+"@2x.png";
            const filePath = (__dirname+'/result.html');
            fs.readFile(filePath, 'utf8', (err, html) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                const $ = cheerio.load(html);
                $('#img1').attr('src', ic);
                $('#sp1').text(weath.toFixed(2)+"°C");
                $("#d1").text(desc);
                $("#hh").text("Weather Report in "+x);
                res.send($.html());
            });
        });
    }
else {
    res.sendFile(__dirname+"/failure.html");
}

});
});

app.listen(process.env.PORT||3000,()=>{
    console.log("running port 3000");
});
