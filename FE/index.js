const translation_endpoint = "http://localhost:8080/api/translate";
const language_endpoint = "http://localhost:8080/api/languages";
const translations = document.getElementById("translations");
const languageOptions = document.getElementById("selectLanguage");
const getInfo = document.getElementById("getInfo");
let userText = document.getElementById("text").value;

 const loadLanguages = async () =>{
  try {
   const getLanguages = await fetch(language_endpoint);
    const language_data = await getLanguages.json();

  //retrieve and display language options
  language_data.forEach(lang => {
    let availableLanguages = document.createElement("option"); //creates options for the select tag
    availableLanguages.textContent = lang.name; //adds the language name as the readable text on the select option.
    availableLanguages.value = lang.key; 
    languageOptions.appendChild(availableLanguages); //adds the fully decked out option to the select tag.
  }); 

  } catch (error) {
    console.error("Error:", error);
  }
}

//get text and send it for translation
  getInfo.addEventListener("submit", async function (e) {
    e.preventDefault();
    try {
      //retrieves the  languages selected by the user and pushes them into an array
      const languages = languageOptions.options[languageOptions .selectedIndex].value; //formats the output to mimic a query string
      let fullLang = languageOptions.options[languageOptions .selectedIndex].innerHTML;
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
      const translation_data = await translation_response.json();
      console.log(translation_data);
     
   
        let text = document.createElement("p"); 
        let textLanguage = document.createElement("label");

        textLanguage.setAttribute("for", "text");
        textLanguage.textContent = fullLang;
        text.textContent = translation_data.translatedText;
        textLanguage.classList.add("fw600");
        text.classList.add("translatedText");
        
        translations.appendChild(textLanguage);
        translations.appendChild(text);

    } catch (error) {
      console.error("Error:", error);
    }
  });

