import './App.css';

import { useState, useEffect } from 'react';
import axios from 'axios';

import AccordionPanel from './components/AccordionPanel';
import DarkModeSwitcher from './components/DarkModeSwitcher';

export default function App() {

  const [panelActiveIndex, setPanelActiveIndex] = useState(-1);
  const [appearance, setAppearance] = useState({
    isDarkMode: false,
    fontSize: '120%'
  });

  const [reactDocs, setReactDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    axios.get('/api/docs.json')
      .then((response) => {
        const json = response.data;

        setReactDocs(json);
        setPanelActiveIndex(json[0].id);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: (appearance.isDarkMode ? 'black' : 'white'),
        fontSize: appearance.fontSize
      }}>

      <DarkModeSwitcher onSwitchDarkMode={(mode) => setAppearance(
        {
          ...appearance,
          isDarkMode: mode
        }
      )} />

      {error && (
        <div>{`There is a problem fetching the documentation. (${error})`}</div>
      )}

      {isLoading && (<div>Loading...</div>)}

      {!isLoading && reactDocs.map(doc => (
        <AccordionPanel
          key={doc.id}
          title={doc.title}
          isExpanded={panelActiveIndex === doc.id}
          onActivate={() => {
            setPanelActiveIndex(doc.id);
          }}
          darkMode={appearance.isDarkMode}
        >
          {doc.body}
        </AccordionPanel>
      ))}
    </div>
  );
}
