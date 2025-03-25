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
            
            // Update UI
            inputText.value = modifiedText;
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