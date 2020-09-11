import React from "react";
import BookMark from "./BookMark";


class Favorite extends React.Component {
    constructor() {
        super();
        this.state = {
            data : []
        }
    }

    componentDidMount() {
        this.props.onLoad("loaded");
        this.setState({
            data : localStorage.getItem('bookmarks')?JSON.parse(localStorage.getItem('bookmarks')):[]
        })
        this.changeData = this.changeData.bind(this);
    }
   
    changeData(){
        this.setState({
            data : localStorage.getItem('bookmarks')?JSON.parse(localStorage.getItem('bookmarks')):[]
        })
    }

    render() {
      let cardData = this.state.data
      let cards = cardData.map( data => {
          let card = localStorage.getItem(data)?JSON.parse(localStorage.getItem(data)):{};
          card.detailedCardId = data;
          return <BookMark onDelete={this.changeData} card = {card}></BookMark>;
      })
      
        const element =<div><span style={{fontSize :"23px",padding:"25px"}}>Favorites</span><br></br>
        <div style={{padding: "8px",marginTop:"10px"}} className="d-flex flex-wrap">
            {cards}
        </div>  
    </div>

        return (
            <div>
               {cardData.length>0 ? element : <div className="noCards">You have no saved articles</div>} 
            </div>
        )
    }
}

export default Favorite;