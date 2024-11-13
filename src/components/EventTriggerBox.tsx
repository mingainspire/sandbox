import React, { useState } from 'react';

const EventTriggerBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [events, setEvents] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setEvents([...events, inputValue]);
      setInputValue('');
    }
  };

  return (
    <div className="event-trigger-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your event trigger..."
          className="input-box"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-item">
            {event}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTriggerBox;
