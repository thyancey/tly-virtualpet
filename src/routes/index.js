// import './App.css';
import { Route } from 'react-router-dom';
import Game from '@scenes/app'

function App({location}) {
  
  return (
    <div className='App'>
      <Route path='/' component={Game} location={location}></Route>
    </div>
  );
}

export default App;
