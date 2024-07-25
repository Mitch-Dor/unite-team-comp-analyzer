//import logo from './logo.svg';
import './App.css';
import RouteControl from './components/general/RouteControl'

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  
  // fetch('/api/ping')
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error('Error:', error));

  // fetch('/api/allCharactersIdsAndNames')
  // .then(response => response.json())
  // .then(data => console.log(data))
  // .catch(error => console.error('Error:', error));

  return <RouteControl />;
}

export default App;
