import React from 'react';

class FullTextView extends React.Component {

  constructor(props) {
      super(props);

      this.state= {
        sentiments: [],
        div_colors: [],
      }
  }

  componentDidMount() {
    this.loadAllPages();
  }


  loadAllPages() {
      fetch(
          `/sentiments`,
          {
              credentials: 'same-origin',
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
          }
      ).then((response) => response.json())
      .then((data) => {
          const { sentiments } = data;
          this.setState({sentiments: sentiments});
          this.defineDivColors(sentiments);
      })
  }

  defineDivColors(sentiments) {
    let colorArray = ["#FFFFFF", "#EAFAF1", "#D5F5E3", "#ABEBC6", "#82E0AA", "#58D68D", "#2ECC71", "#28B463", "#239B56", "#1D8348", "#FDEDEC", "#FADBD8", "#F5B7B1", "#F1948A", "#EC7063", "#E74C3C", "#CB4335", "#B03A2E", "#943126",];
    let div_colors = [];
    sentiments.forEach((sentiment) => {
      if (sentiment.score < 0) {
        div_colors.push(colorArray[9 + (-1 * sentiment.score)])
      } else {
        div_colors.push(colorArray[sentiment.score]);
      }
    });
    this.setState({div_colors: div_colors});
    //console.log(div_colors);
  }

  loadPage(page) {
    this.props.history.push(`/text/${page}`);
  }

  render() {

    return(
      <div>
        {this.state.sentiments.map((sentiment, idx)=>{
          let color = this.state.div_colors[idx];

          return (
              <div className='pageBox' style={{backgroundColor: color}} onClick={() => {this.loadPage(idx)}} key="idx">
                <p>page {sentiment.page}</p>
                <p>{sentiment.score}</p>
              </div>
          )
        })}
      </div>
    );
  }
}

export default FullTextView;
