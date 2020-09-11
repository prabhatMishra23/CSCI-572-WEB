import React from 'react';
import CardComp from './MainCardComponent';
import LoaderIcon from './LoadingDataComponent';
// import { Switch } from 'react-router-dom';
const axios = require('axios');

class NewsComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            newsType: "",

        }
        this.fetchData = this.fetchData.bind(this);
    }
    componentDidMount() {
        this.setState({
            newsType: this.props.newsType
        }, this.fetchData)
    }

    componentDidUpdate(prevProps) {
        if (this.props.newsType != prevProps.newsType || this.props.tabType != prevProps.tabType) {
            this.setState({
                newsType: this.props.newsType,
                data: []
            },this.fetchData)
            //this.componentDidMount();
        }
    }

    fetchData() {
        const pathContent = this.props.match;
        var url = "";
        if (pathContent.path == "/") {
            url = "/home?type=" + this.state.newsType;
        } else if(pathContent.path == "/world") {
            url = "/world?type="+this.state.newsType;
        } else if(pathContent.path == "/politics"){
          url = "/politics?type="+this.state.newsType;
        } else if(pathContent.path == "/business"){
            url = "/business?type="+this.state.newsType;
        } else if(pathContent.path == "/technology") {
            url = "/technology?type="+this.state.newsType;
        }else if(pathContent.path == "/sports") {
            url = "/sports?type="+this.state.newsType;
        } 
        else {
            url = "/home?type=" + this.state.newsType;
        }
        url = "https://backendhw8.wl.r.appspot.com"+url;
        axios.get(url)
            .then((res) => {
                this.setState({
                    newsType: this.props.newsType,
                    data: res.data
                })
            }).catch((error) => {
                console.log(error)
            });
    }


    render() {
        const cardData = this.state.data;
        var i = 0
            const cardArray = cardData.map(card => (
                <CardComp key={card.id} cardData={card} newsType={this.state.newsType}></CardComp>
            ))
            return (
                <div className="mainBody">
                    {!(this.state.data.length==0)?cardArray: <LoaderIcon></LoaderIcon>}
                </div>
            )
    }
}

export default NewsComponent;
