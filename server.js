const dotenv = require('dotenv');
const express = require("express");
const got = require("got");
const uuidv4 = require("uuid/v4");
const bodyParser = require("body-parser");
//all dependencies should be at the top.
dotenv.config();

const app = express();

app.use(bodyParser.json()); //app.use is for middlewares, bodyparser.json converts the bosy of an incoming post body to Json

app.post("/api/translate", async (request, response) => {
  const { to: language } = request.query; // this is a destructured version of const language = request.query.to, format is const{key}=request.query

  const { string: textToConvert } = request.body;
  //const languageCode = request.body.language;
  if (!language) {
    //catches all falsy values
    const responseObj = {
      status: "failed",
      message: "Language code cannot be empty",
    };
    response.status(400);
    response.json(responseObj);
  } else if (!textToConvert) {
    //catches all falsy values
    let responseObj = {
      status: "failed",
      message: "Please enter a string to convert",
    };
    response.status(400);
    response.json(responseObj);
  } else {
    const sendToApi = [];
    const sendObject = {
      text: textToConvert,
    };
    sendToApi.push(sendObject);
    console.log(sendToApi);

    let options = {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.KEY,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      body: JSON.stringify(sendToApi),
    };

    try {
      //console.log('alibaba');
      const result = await got.post(
        `${process.env.ENDPOINT}/translate?api-version=3.0&to=${language}`,
        options
      );
      console.log(result.body);
      let results = JSON.parse(result.body);
      //let g= results[0].translations[0].text;
      let responseObj = {
        translatedText: results[0].translations[0].text,
        language, // because both the key and the value have the same name it can be represented by just one "key", it represents language:language.
        time: new Date(),
      };
      response.status(200);
      response.json(responseObj); // you cant sne d javascript object, it has to be a json string
    } catch (error) {
      console.log(error);
      response.status(400);
      response.send(error);
      //=> 'Internal server error ...'
    }
  }
});

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
