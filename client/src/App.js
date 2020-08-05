import React from 'react';
import Container from 'react-bootstrap/Container';

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Map from "./Map";
import Menu from "./Menu"
import TextView from "./TextView"
import FullTextView from "./FullTextView"

class App extends React.Component {

  render () {
    return (
      <BrowserRouter>
        <div>
          <header id="header">
            <Menu/>
          </header>
          <Container>
            <Switch>
              <Route exact path="/" component={Map}/>
              <Route exact path="/text" component={TextView}/>
              <Route exact path="/text/:page" component={TextView} />
              <Route exact path="/fulltext" component={FullTextView}/>
            </Switch>
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
