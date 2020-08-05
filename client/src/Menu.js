import React from 'react';
import { Redirect } from 'react-router-dom';

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: false,
      fulltext: false,
      mapView: true,
      r: "/"
    }

  }

  changeColorScheme() {
    document.getElementById('header').style.color = 'black';
  }

  textView() {
    this.setState({
      text: true,
      fulltext: false,
      mapView: false,
      r: "/text"
    })
  }

  fullTextView() {
    this.setState({
      fulltext: true,
      text: false,
      mapView: false,
      r: "/fulltext"
    })
  }

  mapView() {
    this.setState({
      mapView: true,
      fulltext: false,
      fulltext: false,
      r: "/"
    })
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div>
      <Redirect to={this.state.r}/>
        <div id="navbar-div">
            <div className="navDiv" onClick={() => this.mapView()}>Vakhrushi</div>
            <div className="navDiv" onClick={() => this.fullTextView()} > Text sentiment </div>
            <div className="navDiv" onClick={() => this.textView()}> Text View</div>
        </div>
      </div>
    );

  }
}

export default Menu;
