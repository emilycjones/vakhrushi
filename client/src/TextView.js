import React from 'react';
import BodyBackgroundColor from 'react-body-backgroundcolor';
import 'react-splitter-layout/lib/index.css';
import SplitterLayout from 'react-splitter-layout';
import Wordcloud from './Wordcloud'

/*
  Madina: This TextView uses a splitter layout package to create a book-like
  interface, with responsive content within each column in the layout.

  loadAllPagesNoSW refers to table where each page has had all its stopwords
  removed. This was done so that the wordclouds would have cleaner data.
*/

class TextView extends React.Component {

  constructor(props) {
      super(props);

      this.state= {
        pages: [],
        pagesNoSW: [],
        currentPage: 0,
      }
  }

  componentDidMount() {
      if (this.props.match.params.page) {
        this.setState({currentPage: parseInt(this.props.match.params.page)});
      } else {
        this.setState({currentPage: 0});
      }
      this.loadAllPages();
      this.loadAllPagesNoSW();
  }

  prev () {
      this.setState({currentPage: this.state.currentPage - 2});
  }

  next () {
      this.setState({currentPage: this.state.currentPage + 2});
  }

  loadAllPages() {
      fetch(
          `/pages`,
          {
              credentials: 'same-origin',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
      ).then((response) => response.json())
      .then((data) => {
          const { pages } = data;
          this.setState({pages: pages});
          //console.log(pages);
      })
  }

  loadAllPagesNoSW() {
    fetch(
        `/pagesNoSW`,
        {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).then((response) => response.json())
    .then((data) => {
        const { pages } = data;
        this.setState({pagesNoSW: pages});
        //console.log(pages);
    })
  }

  render() {
    let currPage = parseInt(this.state.currentPage);
    if (currPage < 0) {
      this.props.history.push(`/fulltext`);
    }

    let leftTxt = [];
    let leftPg = currPage % this.state.pages.length;
    let rightTxt = [];
    let rightPg = leftPg + 1;

    if (this.state.pages && this.state.pages[leftPg] && this.state.pagesNoSW[leftPg]) {
      // the 0th index will be regular text
      leftTxt.push(this.state.pages[leftPg].text);
      // 1st index will be text without stopwords
      leftTxt.push(this.state.pagesNoSW[leftPg].text);
    }

    if (this.state.pages && this.state.pages[rightPg] && this.state.pagesNoSW[rightPg]) {
      rightTxt.push(this.state.pages[rightPg].text);
      rightTxt.push(this.state.pagesNoSW[rightPg].text);
    }


    if (rightTxt[1]) {
      return (
        <BodyBackgroundColor backgroundColor='#FFF'>
          <div id="textview">
            <div id="textViewTitle">Vakhrushev's Diary</div>
            <div id="splitterContainer">
              <SplitterLayout>
                <div className="page">
                  <button onClick={this.prev.bind(this)} className="navButton">&#8249;</button>
                  <div className="pageText">
                    {leftTxt[0]}
                    <p className="pageNum">{leftPg}</p>
                  </div>
                </div>
                <div className="page">
                  <div className="pageText">
                    {rightTxt[0]}
                    <p className="pageNum">{rightPg}</p>
                  </div>
                  <button onClick={this.next.bind(this)} className="navButton" id="rightNavButton">&#8250;</button>
                </div>
              </SplitterLayout>
            </div>
            <div id="wordcloudContainer">
              <div id="wordcloudleft" className="wordcloudFloat">
                <Wordcloud text={leftTxt[1]}/>
              </div>
              <div id="wordcloudright" className="wordcloudFloat">
                <Wordcloud text={rightTxt[1]}/>
              </div>
            </div>
          </div>
        </BodyBackgroundColor>
      );
    } else {
      return (
        <BodyBackgroundColor backgroundColor='#FFF'>
          <div id="textview">
            <div id="textViewTitle">Vakhrushev's Diary</div>
            <SplitterLayout>
              <div className="page">
                <button onClick={this.prev.bind(this)} id="navButton">&#8249;</button>
                <div className="pageText">
                  {leftTxt}
                  <p className="pageNum">{leftPg}</p>
                </div>
              </div>
              <div className="page">
                <div className="pageText">
                  {rightTxt}
                  <p className="pageNum">{rightPg}</p>
                </div>
                <button onClick={this.next.bind(this)} id="navButton">&#8250;</button>
              </div>
            </SplitterLayout>
          </div>
        </BodyBackgroundColor>
      );
    }

  }
}

export default TextView;
