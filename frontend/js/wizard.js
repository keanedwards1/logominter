// script.js
function generatePrompt() {
    var style = document.getElementById("style").value;
    var modifiers = document.getElementById("modifiers").value;
    var time = document.getElementById("time").value;
    var light = document.getElementById("light").value;
    var colors = document.getElementById("colors").value;

    var prompt = `A ${style} scene with ${modifiers}, during ${time}, under ${light} lighting, featuring colors ${colors}.`;
    
    document.getElementById("promptOutput").textContent = prompt;
}
