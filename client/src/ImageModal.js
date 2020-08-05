import React from 'react';
import { Modal }  from 'react-bootstrap';

class ImageModal extends React.Component {


  render() {
    console.log(this.props);
    var def = "default.jpg";
    var y = "";
    if (this.props.filename) {
      def = this.props.filename;
    }
    if (this.props.image.year) {
      y = this.props.image.year;
    }
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.onHide}>
           <Modal.Header closeButton>
            <Modal.Title>
              <div>{y}</div>
            </Modal.Title>
           </Modal.Header>
           <Modal.Body>
              <div>
                <img id="modal_img" src={require('../../images/' + def)} />
              </div>
           </Modal.Body>
        </Modal>
      </div>
    )
  }


}
//     <img src={require( `${base + def}`)}/>
//   <img src={require('../../images/' + this.props.image.filename)}/>

export default ImageModal;
