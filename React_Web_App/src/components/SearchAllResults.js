import React from "react";
import LoaderIcon from "./LoadingDataComponent";
import { CardColumns, CardDeck, Container } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import ResultCardComp from "./ResultCardsComponent";

const axios = require('axios');

class SearchComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            data: null
        }
    }

    componentDidMount() {
        const query = this.props.location.search;
        if (query) {
            let url = "https://backendhw8.wl.r.appspot.com/search"+query;
            console.log("Search "+url);
            axios.get(url)
                .then((res) => {
                    this.setState({
                        query: query,
                        data: res.data
                    })
                }).catch((error) => {
                    console.log(error)
                });
        }
    }

    componentDidUpdate() {
        if (this.state.query != this.props.location.search) {
            this.setState({
                query: this.props.location.search,
                data: null
            })
            this.componentDidMount();
        }
    }

    render() {
        let cardArray = []
        let element = null
        if (this.state.data) {
            const cardData = this.state.data;
            cardArray = cardData.map(card => (
                <ResultCardComp key={card.id} cardData={card}></ResultCardComp>
            ))
            element = <div><span style={{fontSize :"23px",padding:"25px"}}>Results</span><br></br>
            <div style={{padding: "8px",marginTop:"10px"}} className="d-flex flex-wrap">
                    {cardArray}
            </div>
        </div> 
        }
        return (
            <div>
                {this.state.data ? element : <LoaderIcon></LoaderIcon>}
            </div>
        )
    }
}

export default SearchComponent;