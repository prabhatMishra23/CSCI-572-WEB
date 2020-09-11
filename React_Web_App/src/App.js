import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import {Route, HashRouter} from 'react-router-dom';
import SearchComponent from './components/SearchAllResults';
import { ToastContainer } from 'react-toastify';

class App extends React.Component{
  render(){
     return(
      <HashRouter>
        <ToastContainer style={{textAlign:"left"}} />
       <div>
        <Navigation/>
       </div>
       <Route path={"/search"} render={(props) => <SearchComponent {...props}/>}></Route>
       </HashRouter>
        
     )
  }
}

export default App;
