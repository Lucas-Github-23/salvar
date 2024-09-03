document.addEventListener('DOMContentLoaded', function() {
    // Carrega as traduções
    document.getElementById('extensionName').textContent = chrome.i18n.getMessage("extensionName");
    document.getElementById('userText').placeholder = chrome.i18n.getMessage("enterText");
    document.getElementById('startTyping').textContent = chrome.i18n.getMessage("startButton");

    // Função de contagem regressiva
    let isTypingStarted = false;
    document.getElementById('startTyping').addEventListener('click', function() {
        if (!isTypingStarted) {
            isTypingStarted = true;
            document.getElementById('startTyping').disabled = true;
            let countdown = 4;
            const timerElement = document.getElementById('timer');
            const interval = setInterval(function() {
                timerElement.textContent = chrome.i18n.getMessage("timerText", countdown.toString());
                countdown--;
                if (countdown < 0) {
                    clearInterval(interval);
                    timerElement.textContent = "";
                    startTypingProcess();
                }
            }, 1000);
        }
    });

    function startTypingProcess() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            chrome.tabs.sendMessage(currentTab.id, {
                action: 'emulateTyping',
                delayedStart: true,
                text: document.getElementById('userText').value
            });
        });
    }
});
