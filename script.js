document.addEventListener("DOMContentLoaded", function () {
    const inputBox = document.getElementById("inputBox");
    const sendButton = document.getElementById("sendButton");

    sendButton.addEventListener("click", sendMessage);
    inputBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});

async function sendMessage() {
    const inputBox = document.getElementById("inputBox");
    const chatbox = document.getElementById("chatbox");
    const userMessage = inputBox.value;

    if (!userMessage) return;

    chatbox.innerHTML += `<div class="message user-message"><strong>You:</strong> ${userMessage}</div>`;
    chatbox.innerHTML += `<div class="message thinking">Sanzobot is thinking...</div>`;
    inputBox.value = "";

    try {
        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
        const API_KEY = "AIzaSyCDF9n9mtSlsa3qsv-VfkCztDZAffj54Vs"; // Replace with actual API key

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: userMessage }] }] })
        });

        const data = await response.json();
        document.querySelector(".thinking").remove();

        if (data.candidates && data.candidates.length > 0) {
            chatbox.innerHTML += `<div class="message bot-message"><strong>Sanzobot:</strong> ${data.candidates[0].content.parts[0].text}</div>`;
        } else {
            chatbox.innerHTML += `<div class="message bot-message"><strong>Sanzobot:</strong> Error: No response received.</div>`;
        }
    } catch (error) {
        console.error("API Error:", error);
        document.querySelector(".thinking").remove();
        chatbox.innerHTML += `<div class="message bot-message"><strong>Sanzobot:</strong> Error: Unable to fetch response.</div>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}
