document.addEventListener('DOMContentLoaded', function () {
    // Function to gather form inputs and concatenate them into a prompt
    function gatherPrompt() {
        const mainObject = document.querySelector('input[name="Image Of"]').value;
        const background = document.querySelector('input[name="Background"]').value;
        const color = document.querySelector('select[title="color"]').value;
        const lighting = document.querySelector('select[title="lighting and time of day"]').value;
        const style = document.querySelector('select[title="style and technique"]').value;
        const atmosphere = document.querySelector('select[title="emotion and atmosphere"]').value;
        const technique = document.querySelector('select[title="technique"]').value;
        const composition = document.querySelector('select[title="composition"]').value;

        let prompt = `Image of: ${mainObject || ''}`;
        if (background) prompt += `, Background: ${background}`;
        if (color) prompt += `, Color: ${color}`;
        if (lighting) prompt += `, Lighting: ${lighting}`;
        if (style) prompt += `, Style: ${style}`;
        if (atmosphere) prompt += `, Atmosphere: ${atmosphere}`;
        if (technique) prompt += `, Technique: ${technique}`;
        if (composition) prompt += `, Composition: ${composition}`;

        return prompt;
    }

    // Function to handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();
        const prompt = gatherPrompt();

        try {
            const response = await fetch('/api/option-4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();
            alert(data.message);

            if (data.file_path) {
                const img = document.createElement('img');
                img.src = data.file_path.replace('../', '/');
                img.alt = 'created Logo';
                document.getElementById('result').appendChild(img);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Add event listener to the form
    document.getElementById('logoForm').addEventListener('submit', handleFormSubmit);
});