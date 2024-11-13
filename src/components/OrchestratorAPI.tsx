import React, { useState } from 'react';

const OrchestratorAPI: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim()) {
      try {
        const response = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userInput }),
        });
        const data = await response.json();
        setApiResponse(data.response);
      } catch (error) {
        console.error('Error communicating with orchestrator API:', error);
        setApiResponse('Error communicating with orchestrator API');
      }
      setUserInput('');
    }
  };

  return (
    <div className="orchestrator-api">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask the orchestrator..."
          className="input-box"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="api-response">
        {apiResponse}
      </div>
    </div>
  );
};

export default OrchestratorAPI;
