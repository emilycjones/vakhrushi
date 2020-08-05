import React from 'react';
import ReactWordcloud from 'react-wordcloud';
/*
  Madina: This Wordcloud component renders a visualization for text
  that is passed in as a prop via the text variable.
  Using the following resource for Wordcloud: https://react-wordcloud.netlify.com/
*/

class Wordcloud extends React.Component {

  constructor(props) {
      super(props);

      this.state= {
        words: [],
      }
  }

  componentDidMount() {
    this.createWordCloudObj(this.props.text);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.createWordCloudObj(nextProps.text);
    }
  }

  createWordCloudObj(text) {
      let wordAndFreq = this.getWordFrequency(text.split(" "))
      let wordArr = wordAndFreq[0];
      let freqArr = wordAndFreq[1];

      let wordsObj = [];
      let updateState = false;

      for (var i = 0; i < wordArr.length; i++) {
          wordsObj.push({text: wordArr[i], value: freqArr[i] * 20})
          if (i === wordArr.length - 1) {
            updateState = true;
          }
      }

      if (updateState) {
        this.setState({words: wordsObj});
      }
  }

  getWordFrequency(arr) {
      var a = [], b = [], prev;

      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
          if ( arr[i] !== prev ) {
              a.push(arr[i]);
              b.push(1);
          } else {
              b[b.length-1]++;
          }
          prev = arr[i];
      }

      return [a, b];
  }

  render() {
    return (
        <div id="worldcloud" style={{ height: 700, width: 900 }}>
          <ReactWordcloud words={this.state.words} />
        </div>
    );
  }
}

export default Wordcloud;
