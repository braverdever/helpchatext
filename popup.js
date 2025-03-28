document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const actionButton = document.getElementById('actionButton');
    let modifiedText = '';

    // Handle Ctrl+Enter shortcut
    inputText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            modifyText();
        }
    });

    // Handle button click
    actionButton.addEventListener('click', modifyText);

    async function modifyText() {
        const text = inputText.value.trim();
        if (!text) return;

        try {
            actionButton.textContent = 'Modifying...';
            actionButton.disabled = true;

            const response = await fetch('http://localhost:3001/api/modify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            modifiedText = data.modifiedText;
            
            // Send message to content script to display result in webpage
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'displayResult',
                    text: modifiedText
                });
            });
            
            actionButton.textContent = 'Copy Text';
            actionButton.classList.add('copy');
            actionButton.onclick = copyToClipboard;
        } catch (error) {
            console.error('Error:', error);
            alert('Error modifying text. Please try again.');
            actionButton.textContent = 'Modify Text';
            actionButton.onclick = modifyText;
        } finally {
            actionButton.disabled = false;
        }
    }

    function displayResult(text) {
        // Remove any existing result container
        const existingResult = document.getElementById('result-container');
        if (existingResult) {
            existingResult.remove();
        }

        // Create result container
        const resultContainer = document.createElement('div');
        resultContainer.id = 'result-container';
        resultContainer.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            white-space: pre-wrap;
            word-wrap: break-word;
        `;

        // Add the modified text
        resultContainer.textContent = text;

        // Insert after the input field
        inputText.parentNode.insertBefore(resultContainer, inputText.nextSibling);
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(modifiedText).then(() => {
            actionButton.textContent = 'Copied!';
            setTimeout(() => {
                actionButton.textContent = 'Copy Text';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try again.');
        });
    }
}); 