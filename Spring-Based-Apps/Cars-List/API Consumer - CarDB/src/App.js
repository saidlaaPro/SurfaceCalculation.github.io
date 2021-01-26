import React, {Component} from 'react';
import Login from './Components/Login';
import {AppBar, Toolbar} from '@material-ui/core';

class App extends Component{
  
  constructor(props){
    super(props)
    this.state = {title:'List of Available Cars'}
  }
  
  changeTitle = (text) => this.setState({title: text});

  render(){
    return(
      <div className='app'>
        <AppBar position='static' color='default'>
          <Toolbar>{this.state.title}</Toolbar>
        </AppBar>
        <Login changeTitle={this.changeTitle}/>  
      </div>
    )
  }
  
}

export default App;