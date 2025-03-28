// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'displayResult') {
        displayResultInPage(request.text);
    }
});

function displayResultInPage(text) {
    // Remove any existing result container
    const existingResult = document.getElementById('helpchat-result-container');
    if (existingResult) {
        existingResult.remove();
    }

    // Create result container
    const resultContainer = document.createElement('div');
    resultContainer.id = 'helpchat-result-container';
    resultContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 20px;
        color: black;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 999999;
        font-family: Arial, sans-serif;
        white-space: pre-wrap;
        word-wrap: break-word;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0 5px;
    `;
    closeButton.onclick = () => resultContainer.remove();

    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Text';
    copyButton.style.cssText = `
        display: block;
        width: calc(100% - 40px);
        margin: 20px auto 0;
        padding: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: background-color 0.2s;
    `;
    copyButton.onmouseover = () => {
        copyButton.style.backgroundColor = '#0056b3';
    };
    copyButton.onmouseout = () => {
        copyButton.style.backgroundColor = '#007bff';
    };
    copyButton.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
            resultContainer.remove();
        });
    };

    // Add the modified text
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.marginTop = '10px';

    resultContainer.appendChild(closeButton);
    resultContainer.appendChild(textElement);
    resultContainer.appendChild(copyButton);
    document.body.appendChild(resultContainer);
} 