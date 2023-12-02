import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [showForm, setShowForm] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [repName, setRepName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sections, setSections] = useState([]);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleHideForm = () => {
    setShowForm(false);
  };

  const handleAddSection = (event) => {
    event.preventDefault();

    const newSection = {
      sectionName,
      orgName,
      repName,
      startDate,
      endDate,
      completed: false,
      markedAsDone: false,
    };

    setSections([...sections, newSection]);
    handleHideForm();
  };

  const handleNotCompleteConfirmation = (section) => {
    if (!section.completed) {
      const response = window.confirm(`Is the work for section '${section.sectionName}' due?`);
      if (response) {
        section.completed = false;
      } else {
        section.completed = true;
      }
      setSections([...sections]);
    }
  };
  
  
  const handleStartConfirmation = (section) => {
    if (!section.started) {
      const response = window.confirm(`Has the work started for section: ${section.sectionName}?`);
      if (response) {
        section.started = true;

        const currentTime = new Date();
        const sectionStartDate = new Date(section.startDate);
        if (currentTime < sectionStartDate) {
          const timeDiff = sectionStartDate - currentTime;

          setTimeout(() => {
            section.timer = setInterval(() => {
              const currentTime = new Date();
              const timeLeft = new Date(section.endDate) - currentTime;

              if (timeLeft <= 0) {
                clearInterval(section.timer);
                section.completed = true;
                return;
              }

              section.timeLeft = Math.floor(timeLeft / 1000);
              setSections([...sections]);
            }, 1000);
          }, timeDiff);
        } else {
          const timeLeft = new Date(section.endDate) - currentTime;

          if (timeLeft <= 0) {
            section.completed = true;
            return;
          }

          section.timeLeft = Math.floor(timeLeft / 1000);

          section.timer = setInterval(() => {
            const currentTime = new Date();
            const timeLeft = new Date(section.endDate) - currentTime;

            if (timeLeft <= 0) {
              clearInterval(section.timer);
              section.completed = true;
              return;
            }

            section.timeLeft = Math.floor(timeLeft / 1000);
            setSections([...sections]);
          }, 1000);
        }
      }
    }
  };

  const handleCompleteConfirmation = (section, isDone) => {
    const response = window.confirm(`Has the work been completed for section: ${section.sectionName}?`);
    if (response) {
      section.completed = true;
      section.markedAsDone = isDone;
      setSections([...sections]);
    } else {
      section.completed = false;
      section.markedAsDone = isDone;
      setSections([...sections]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      sections.forEach((section) => {
        const sectionStartDate = new Date(section.startDate);
        const sectionEndDate = new Date(section.endDate);

        const startDiff = Math.abs(sectionStartDate - currentTime);
        const endDiff = Math.abs(sectionEndDate - currentTime);

        const startDiffInSeconds = Math.floor(startDiff / 1000);
        const endDiffInSeconds = Math.floor(endDiff / 1000);

        if (startDiffInSeconds <= 10) {
          handleStartConfirmation(section);
        }

        if (endDiffInSeconds <= 5) {
          handleCompleteConfirmation(section);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sections, startDate, endDate]);

  return (
    <div className="bg-gray-100 h-screen">
      <nav className="bg-gray-800 text-white py-4 px-6 fixed w-full z-10">
        <div className="flex items-center justify-between">
          <a href="#" className="text-lg font-bold">
            NOTES
          </a>
        </div>
      </nav>
      <div className="container mx-auto py-10 relative top-10">
        <div className="mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleShowForm}
          >
            Add Notes
          </button>
        </div>
        {showForm && (
          <form className="mb-4" onSubmit={handleAddSection}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="section-name">
                Notes Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="section-name"
                type="text"
                placeholder="Enter section name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="organization-name">
                About
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="organization-name"
                type="text"
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="representer-name">
                Description
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="representer-name"
                type="text"
                placeholder="Enter representer name"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="start-date-time">
                Added date and time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="start-date-time"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="end-date-time">
                Should complete by
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="end-date-time"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleHideForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div id="sections" className="flex flex-col">
          {sections.map((section, index) => {
            const sectionStartDate = new Date(section.startDate);
            const sectionEndDate = new Date(section.endDate);
            const currentTime = new Date();
            const timeLeft = sectionEndDate - currentTime;

            const startDiffInSeconds = Math.floor((sectionStartDate - currentTime) / 1000);
            const endDiffInSeconds = Math.floor((sectionEndDate - currentTime) / 1000);

            const isStarted = startDiffInSeconds <= 30;
            const isCompleted = endDiffInSeconds <= 30;

            const showStartPopup = isStarted && !section.started;
            const showCompletePopup = isCompleted && !section.completed;

            const sectionStyle = section.completed ? 'bg-green-200' : isCompleted ? 'bg-red-200' : '';

            return (
              <div
                key={index}
                className={`bg-white rounded p-4 mb-4 ${section.completed ? 'bg-green-200' : ''}`}
              >
                <h3 className="text-lg font-bold mb-2">{section.sectionName}</h3>
                <p>About: <strong>{section.orgName}</strong></p>
                <p>Description: <strong>{section.repName}</strong></p>
                <p>Added Date: <strong>{section.startDate}</strong></p>
                <p>End Date: <strong>{section.endDate}</strong></p>

                {showStartPopup && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleStartConfirmation(section)}
                  >
                    Start
                  </button>
                )}
                {showCompletePopup && (
                  <div>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleCompleteConfirmation(section,true)}
                    >
                      Done
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleNotCompleteConfirmation(section)}
                    >
                      Not Done
                    </button>
                  </div>
                )}
                {!section.completed && timeLeft > 0 && (
                  <p>
                    Time Left: {Math.floor(timeLeft / 1000)} seconds
                  </p>
                )}
                {section.completed && (
                  <p className="text-green-500 font-bold">Completed</p>
                )}
                {!section.completed && timeLeft <= 0 && (
                  <p className="text-red-500 font-bold">Work overdue!</p>
                )}
                {(!section.completed || timeLeft <= 0) && (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleCompleteConfirmation(section, true)}
                  >
                    Mark as Done
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyComponent;
