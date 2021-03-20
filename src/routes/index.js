// import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import Game from '@scenes/app'

function App() {
  
  return (
    <div className='App'>
      <Route path='/' component={Game}></Route>
    </div>
  );
}

export default App;
