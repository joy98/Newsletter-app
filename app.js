const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function (req,res) {
  res.sendFile(__dirname+'/signup.html');
});

app.listen((process.env.PORT || 3000),function(){
  console.log("server is running on port 3000");
});

app.post('/',function (req,res) {
  const fname=req.body.firstname;
  const lname=req.body.secondname;
  const mail=req.body.email;

  const data={
    members:[
      {
        email_address:mail,
        status:"subscribed",
        merge_fields:{
          FNAME:fname,
          LNAME:lname
        }
      }
    ]
  };

  const jsonData=JSON.stringify(data);
  const list_id="6619785785";
  const url="https://us2.api.mailchimp.com/3.0/lists/"+list_id;
  const options={
    method:"POST",
    auth: "joy:9a730459eab2026388d047009098a85a-us2"
  };

  const request=https.request(url,options,function(response){

      if(response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }

      response.on("data",function (data) {
        console.log(JSON.parse(data));
      })
  });

  request.write(jsonData);
  request.end();

});

app.post('/failure',function (req,res) {
  res.redirect('/');
})

//API key : 9a730459eab2026388d047009098a85a-us2
//audience id: 6619785785
