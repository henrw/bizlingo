const generateContext = async () => {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful teaching assistant who tend to make wikipedia learning experience better.',
        },
        { role: 'user', content: request.question },
    ];
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_KEY}`, // Ensure secure handling of your API key
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
            }),
        });

        const data = await response.json();
        console.log(data);
        sendResponse({ success: true, response: data.choices[0].message.content }); // Adjust based on actual response structure
    } catch (error) {
        console.error('Error fetching from OpenAI:', error);
        sendResponse({ success: false, error: error.toString() });
    }
}