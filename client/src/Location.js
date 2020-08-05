import React from 'react';

import Images from './Images.js';
import ImageModal from './ImageModal'

class Location extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      locations: [],
      images: [],
      openModal: false,
      image: [],
      imageFilename: "",
      pages_locations: {},
    }
  }

  componentDidMount() {
    this.loadLocationPages();
  }

  loadLocationPages() {
    fetch(
        `/pageslocations`,
        {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).then((response) => response.json())
    .then((data) => {
        const { pages_locations } = data;
        let obj = {};
        pages_locations.forEach((location_page) => {
          if (obj[location_page.location]) {
            obj[location_page.location].push(location_page.page);
          } else {
            obj[location_page.location] = [location_page.page];
          }
        })
        this.setState({pages_locations: obj});
        // console.log(obj);
    })
  }

  setImage(e, id) {
    for (var i = 0; i < this.props.images.length; i++) {
      var img = this.props.images[i]
      var fName = img.filename
      if (img.id === id) {
        this.setState({
          image: img,
          imageFilename: fName
        })
      }

    }
    console.log(fName);
    this.handleModal(e);
  }

  handleModal(e, ) {
    e.preventDefault();

    this.setState({
      openModal: true
    })
    console.log("working");
  }

  render() {
    var name = this.props.location.building_type || this.props.location.address;
    var address = "";
    var type = "";
    let pages_per_location = [];
    if (this.props.location.building_type) {
      type = this.props.location.building_type;
    }
    if (this.props.location.address) {
      address = this.props.location.address;
    }
    if (name === address) {
      address = "";
    }
    if (this.state.openModal === true) {

    }
    if (this.state.pages_locations[name]) {
      pages_per_location = this.state.pages_locations[name];
    }
    return (
      <div>
        <div id="modal_container">
          <ImageModal show={this.state.openModal} image={this.state.image} filename={this.state.imageFilename} onHide={() => this.setState({openModal: false})}/>
        </div>
        <div id="location_container">
          <div id="location-info">
            <header>
              <h1 id="location_name" class="location">{name}</h1>
              <h5 id="location_address" class="location">{address}</h5>
            </header>
          </div>
          <div id="location_images">
            <div id="location_image_container">{this.props.images.map(image => (
                <img onClick={( (e, id) => this.setImage(e, image.id))} class="location_image" src={require('../../images/' + image.filename)}/>
            ))}</div>
          </div>
          <div id="location_pages">
            {pages_per_location.sort(function(a, b){return a-b}).map((page, idx) => {

                return(
                  <div className='pageBox' onClick={() => {this.props.loadPage(page)}} key="idx">
                    <p>page {page}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )

  }


}

export default Location;
