const translation_endpoint = "http://localhost:8080/api/translate";
const language_endpoint = "http://localhost:8080/api/languages";
const translations = document.getElementById("translations");
const getInfo = document.getElementById("postData");
const languageOptions = document.getElementById("selectLanguage");
let userText = document.getElementById("text").value;

async function loadLanguages(){
  try {
   const getLanguages = await fetch(language_endpoint);
   console.log(getLanguages);
    const language_data = await getLanguages.json();
      
  //retrieve and display language options
    for (let i = 0; i < language_data.length; i++) {
      let availableLanguages = document.createElement("option"); //creates options for the select tag
      availableLanguages.textContent = language_data[i].name; //adds the language name as the readable text on the select option.
      availableLanguages.value = language_data[i].key; 
      languageOptions.appendChild(availableLanguages); //adds the fully decked out option to the select tag.
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//get text and send it for translation
if(getInfo){
  
  getInfo.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      //retrieves the  languages selected by the user and pushes them into an array
      let selected_lang = [];
      for (let option of languageOptions.options) {
        if (option.selected) {
          selected_lang.push(option.value);
        }
      }

      const languages = "&to=" + selected_lang.join("&to="); //formats the output to mimic a query string
      console.log(languages);

      const data = {
        text: userText,
        language: languages,
      };

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      };

      //makes connection and retrieves data
      const translation_response = await fetch(translation_endpoint, options);
      console.log(translation_response);
      const translation_data = await translation_response.json();
      //document.getElementById('translationDisplayBox').value = translation_data.translatedText.text;

      for (let i = 0; i < translation_data.translatedText.length; i++) {
        let text = document.createElement("p"); 
        let textLanguage = document.createElement("label");

        textLanguage.setAttribute("for", "translatedText");
        text.textContent = translation_data.translatedText[i].text;
        text.classList.add("translatedText");
        
        translations.appendChild(textLanguage);
        translations.appendChild(text);
      }
      console.log(translation_data);

    } catch (error) {
      console.error("Error:", error);
    }
  });
}
