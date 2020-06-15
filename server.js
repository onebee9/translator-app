//all dependencies should be at the top.
const dotenv = require("dotenv");
const express = require("express");
const got = require("got");
const uuidv4 = require("uuid/v4");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname + "/FE/")));

app.post("/api/translate", async (request, response) => {
  const language = request.body.language;
  console.log(language);
  const textToConvert = request.body.text;
  console.log(textToConvert)

  //catch all falsy values
  if (!language) {
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
        "Ocp-Apim-Subscription-Region":'canadacentral',
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString()
      },
      body: JSON.stringify(sendToApi),
    };

    try {
      console.log("alibaba");
      const result = await got.post(
        `${process.env.ENDPOINT}translate?api-version=3.0&to=${language}`,
        options);


      let results = JSON.parse(result.body);
      let responseObj = {
        translatedText: results[0].translations[0].text,
        language, // language:language
        time: new Date(),
      };
      console.log(responseObj);

      response.status(200);
      response.json(responseObj);

    } catch (error) {
      console.log(error);
      response.status(400);
      response.send(error);
    }
  }
});

app.get("/api/languages", async (request, response) => {
  try {
    const Languages = await got(
      `${process.env.ENDPOINT}/languages?api-version=3.0&scope=translation`
    );

    const language_data = JSON.parse(Languages.body);
    const language_array = Object.entries(language_data.translation);

    const mapper = (item) => {
      return {
        key: item[0],
        name: item[1].name,
      };
    };

    const processed_languages = language_array.map(mapper); 
    response.status(200);
    response.json(processed_languages);

  } catch (error) {
    console.log(error);
    response.status(400);
    response.send(error);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);
