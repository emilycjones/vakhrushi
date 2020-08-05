import React from 'react';

class Images extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: []
    }
  }

  // componentDidMount() {
  //   this.loasdImages();
  // }

  // loadImages() {
  //
  //   this.setState({
  //     images: this.props.images
  //   })
  // }

  images(locationId) {
    fetch(
        `/images/${locationId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
    .then((response) => response.json())
    .then((data) => {
        const { images } = data;
        this.setState({images: images});
    })
  }

  componentDidMount() {
    this.images(this.props.locationId)
  }

  render() {
    // console.log(this.props.locationId)
    // console.log(this.state.images);
    return (
      <div>
      hey
      </div>
    )
  }

}

// <div id="location_image_container">{this.props.images.map(image => (
//     <img class="location_image" src={require('../../images/' + image.filename)}/>
// ))}</div>

export default Images;
