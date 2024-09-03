let currentTypingSession = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('content.js: Message received:', request.action);

    if (request.action === "emulateTyping") {
        console.log("content.js: Action received: emulateTyping");
        currentTypingSession = Math.random().toString();
        emulateTyping(request.text, currentTypingSession, request.delayedStart);
    } else if (request.action === "stopTyping") {
        currentTypingSession = null;
    }
});

window.addEventListener("keydown", function () {
    currentTypingSession = null;
    console.log('content.js: Keydown event detected');
});

function emulateTyping(text, session, delayedStart) {
    const activeElement = document.activeElement;
    console.log('content.js: Active element:', activeElement);

    let i = 0;

    const startTyping = function () {
        function typeNextCharacter() {
            console.log('content.js: Typing character', text[i]);

            if (i < text.length && session === currentTypingSession) {
                let event = new KeyboardEvent("keydown", {
                    key: text[i],
                    code: "Key" + text[i].toUpperCase(),
                    charCode: text[i].charCodeAt(0),
                    keyCode: text[i].charCodeAt(0),
                    which: text[i].charCodeAt(0),
                });

                activeElement.dispatchEvent(event);
                document.execCommand("insertText", false, text[i++]);

                let delay = Math.random() * (200 - 50) + 50;

                if (Math.random() < 0.05) {
                    delay += Math.random() * (700 - 200) + 200;
                }

                setTimeout(typeNextCharacter, delay);
            }
        }

        typeNextCharacter();
    };

    if (delayedStart) {
        console.log('content.js: Starting typing with a delay');
        setTimeout(startTyping, 0);
    } else {
        startTyping();
    }
}
