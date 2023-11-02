import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ContributionChart from './ContributionChart';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('https://dpg.gg/test/calendar.json')
      .then(response => response.json())
      .then(dataApi => {
        setData(dataApi);
      })
      .catch(error => {
        // Обработка ошибок
        console.error(error);
      });
  }, []);

  return (
    <ContributionChart data={data} />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);