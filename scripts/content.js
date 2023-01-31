const API_KEY = "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";




gapi.load('auth2', function() {
    gapi.auth2.init({
      client_id: '537334404087-tdc8oogt7n87us6lj0msk7obflnh3ls6.apps.googleusercontent.com',
      scope: 'profile'
    });
  
    gapi.auth2.getAuthInstance().signIn({
      prompt: 'login'
    }).then(function(user) {
      console.log('Signed in as ' + user.getBasicProfile().getName());
    });
});


var image = document.createElement("img");
//Appends image




setTimeout(function() {

    var a = chrome.runtime.getURL("style.css");
    var link = document.createElement("link");
    link.href = a;
    link.type = "text/css";
    link.rel = "stylesheet";
    console.log(link);
    document.getElementsByTagName("head")[0].appendChild(link);

    let textarea = document.querySelector('.up-textarea');
    image.src = chrome.runtime.getURL("image.png");
    image.width = 20;
    image.height = 20;
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '55px';
    div.style.right = '35px';
    div.appendChild(image);

    textarea.parentNode.insertBefore(div, textarea.nextSibling);

    image.addEventListener('click', function(event){
        answer(event.currentTarget)
    });
  }, 4000);


//retreives job description 
function answer(element){
    let prompt = "Write me a cover letter for a job with the following description: " + getJobDescription();
    console.log(prompt)
    let response = " ";
    image.classList.add("loading");
    openAi(prompt).then(function(data){
        response = data;
        textArea = document.querySelector(".up-textarea");
        textArea.value = response;
        image.classList.remove("loading");

    });


}

function getJobDescription(){
    let job = "";

    const title = document.querySelector("h3.mb-20");
    let innerText = title.innerText;
    job += innerText;

    const description = document.querySelector(".up-truncation");
    const firstChild = description.firstElementChild;
    innerText = firstChild.innerText;
    job += " "+innerText;

    return job;
}

async function openAi(question){
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            },
            body: JSON.stringify({
                'model': "text-davinci-003",
                'prompt': question,
                'temperature': 0,
                'max_tokens': 1000
            })
        });

        if (!response.ok) {
            console.error("HTTP ERROR: " + response.status + "\n" + response.statusText);
        } else {
            const data = await response.json();
            console.log(createResponse(data));
            return removeHiringManager(removeTwoLines(createResponse(data))) ;
        }
    } catch (error) {
        console.error("ERROR something broke: " + error);
    }
}

function removeTwoLines(str){
    return str.replace(/^.*\n.*\n/,'');
}

function removeHiringManager(str){
    return str.replace(/\[Hiring Manager\]/g, "Hiring Manager");
}
function removePeriod(json) {
    json.forEach(function (element, index) {
        if (element === ".") {
            json.splice(index, 1);
        }
    });
    return json;
}

function createResponse(json) {
    let response = "";
    let choices = removePeriod(json.choices);
    if (choices.length > 0) {
        response = json.choices[0].text

    }

    return response;
}