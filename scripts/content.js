const API_KEY = "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";


//Appends image

setTimeout(function() {
    let textarea = document.querySelector('.up-textarea');
    var image = document.createElement("img");
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
    openAi(prompt).then(function(data){
        response = data;
        textArea = document.querySelector(".up-textarea");
        textArea.value = response;

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
            return removeTwoLines(createResponse(data));
        }
    } catch (error) {
        console.error("ERROR something broke: " + error);
    }
}

function removeTwoLines(str){
    return str.replace(/^.*\n.*\n/,'');
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