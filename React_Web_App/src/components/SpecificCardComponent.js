import React from "react";
import LoaderIcon from "./LoadingDataComponent";
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import scrollToComponent from 'react-scroll-to-component';
import { IconContext } from "react-icons";
import CommentBox from './CommentBox';
import { toast, Zoom } from 'react-toastify';
import {Link,animateScroll} from 'react-scroll';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from "react-tooltip";
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
} from 'react-share'

const axios = require('axios');


class DetailedCard extends React.Component {
    constructor() {
        super()
        this.state = {
            newsType: "",
            data: null,
            chevronState: false,
            expand: false,
            bookmarked: false
        }
        this.paragraph = React.createRef();
        this.top = React.createRef();
        this.toggleIcon = this.toggleIcon.bind(this);
        this.saveCard = this.saveCard.bind(this);
        this.unSaveCard = this.unSaveCard.bind(this);
        this.handleTruncate = this.handleTruncate.bind(this);
        // this.scrollToBottom = this.scrollToBottom.bind(this);
        // this.scrollToTop = this.scrollToTop.bind(this);
        //this.scrollToComponent = this.scrollToComponent.bind(this);
    }

    componentDidMount() {
        let object = {}
        this.props.onLoad("loaded");
        if (this.props.location.state) {
            object = this.props.location.state;
            localStorage.setItem('newsType', object.newsType);
        }
        this.setState(function () {
            return {
                newsType: this.props.location.state ? this.props.location.state.newsType : localStorage.getItem('newsType'),
                bookmarked: localStorage.getItem(this.props.location.search.substring(1)) == null ? false : true
            }
        }, this.fetchData);
    }

    // scrollToBottom = () => {
    //     this.paragraph.current.scrollIntoView({ behavior: "smooth" });
    //   }

    // scrollToTop = () => {
    //     this.top.current.scrollIntoView({ behavior: "smooth" });
    //   }

    handleTruncate(truncated) {
        if (this.state.chevronState !== truncated) {
            this.setState({
                chevronState: truncated
            });
        }
    }

    fetchData() {
        let url = "https://backendhw8.wl.r.appspot.com/article?id=" + this.props.location.search.substring(1) + "&newsType=" + this.state.newsType;
        axios.get(url)
            .then((res) => {
                let data = res.data
                let array = this.formatText(res.data.description);
                res.data.description1 = array[0];
                res.data.description2 = array[1];
                this.setState({
                    data: data,
                    chevronState : array[1]!=""?true:false
                })
            }).catch((error) => {
                console.log(error)
            });
    }

    toggleIcon(value) {
        if(value=="p1"){
          scrollToComponent(this.top.current, { offset: -200, align: 'top', duration: 500})
        }
        this.setState({
            expand: !this.state.expand
        })
    }

    formatText(text) {
        let arr = text.match(/[^\.!\?]+[\.!\?\"]+/g );
        var modified1 = "";
        var num = Math.min(arr.length,4);
        for (var i = 0; i < num; i++) {
            modified1 += arr[i];
        }
        let modified2 = "";
        for (var i = 4; i < arr.length; i++) {
            modified2 += arr[i];
        }
        var arr_p = []
        arr_p[0] = modified1;
        arr_p[1] = modified2;
        return arr_p;
    }

    saveCard(e) {
        toast(<span style={{color:"black"}}>{"Saving " + this.state.data.title}</span>, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Zoom
        },);
        let storeObj = {};
        storeObj.title = this.state.data.title;
        storeObj.image = this.state.data.image;
        storeObj.url = this.state.data.url;
        storeObj.section = this.state.data.section;
        storeObj.newsType = this.state.data.newsType;
        storeObj.date = this.state.data.date;
        localStorage.setItem(this.props.location.search.substring(1), JSON.stringify(storeObj));
        let bookmarks = null;
        if (localStorage.getItem('bookmarks') == null) {
            bookmarks = []
        } else {
            bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        }
        bookmarks.push(this.props.location.search.substring(1));
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        this.setState({
            bookmarked: true
        })
    }

    unSaveCard(e) {
        toast(<span style={{color:"black"}}>{"Removing - " + this.state.data.title}</span>, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Zoom,
            rtl:false
        });
        localStorage.removeItem(this.props.location.search.substring(1));
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        let index = bookmarks.indexOf(this.props.location.search.substring(1));
        if (index != -1) {
            bookmarks.splice(index, 1);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        this.setState({
            bookmarked: false
        })
    }


    render() {
        const detailedCardData = this.state.data;
        let element = null;
        if (detailedCardData) { 
            console.log(this.state.data.description1);
            const icon = this.state.expand ? <FiChevronUp size="25px" onClick={() => this.toggleIcon("p1")}></FiChevronUp>: <Link to="unique" smooth={true} duration={1000}><FiChevronDown size="25px" onClick={this.toggleIcon}></FiChevronDown ></Link>
            element = <div ref={this.top}><Card style={{ padding: "20px" }} className="shadow mb-2 bg-white rounded">
                <Card.Title style={{ fontStyle: "italic", fontSize: "30px" }} >{detailedCardData.title}</Card.Title>
                <div>
                    <Row className="justify-content-md-center" className="pl-3 pr-3">
                        <Col xs={5} sm={5} md={5} lg={5} className="pl-0">
                            <span style={{ fontStyle: "italic" }}>{detailedCardData.date}</span>
                        </Col >
                        <Col xs={1} sm={1} md={3} lg={3}>
                        </Col>
                        <Col xs={4} sm={4} md={3} lg={3} style={{ textAlign: "end" }} className="pl-0 pr-0">
                            <a data-tip='Facebook' data-for="toolTip"><FacebookShareButton hashtag="#CSCI_571_NewsApp" url={detailedCardData.url}><FacebookIcon size={25} round={true}></FacebookIcon></FacebookShareButton></a>
                            <a data-tip='Twitter' data-for="toolTip"><TwitterShareButton hashtags={["#CSCI_571_NewsApp"]} url={detailedCardData.url}><TwitterIcon size={25} round={true} /></TwitterShareButton></a>
                            <a data-tip='Email' data-for="toolTip"><EmailShareButton subject="#CSCI_571_NewsApp" url={detailedCardData.url}><EmailIcon size={25} round={true} /></EmailShareButton></a>
                            <ReactTooltip id="toolTip" className='extraClass' effect='solid' />
                        </Col>
                        <Col xs={1} sm={1} md={1} lg={1} className="pr-0" style={{ textAlign: "end" }}>
                            <IconContext.Provider value={{ color: "red", fill: "red" }}>
                                {this.state.bookmarked ? <a data-tip='Bookmark' data-for="toolTip"><FaBookmark onClick={this.unSaveCard} style={{ borderColor: "red" }} size={25}></FaBookmark> </a> :
                                    <a data-tip='Bookmark' data-for="toolTip"><FaRegBookmark onClick={this.saveCard} style={{ borderColor: "red" }} size={25}></FaRegBookmark></a>}
                            </IconContext.Provider>
                        </Col>
                    </Row>
                </div>
                <Card.Img className="mt-3" src={detailedCardData.image}></Card.Img>
                <Card.Text style={{textAlign:"justify"}}>{this.state.data.description1}</Card.Text>
                <section id="unique"><Card.Text style={{textAlign:"justify"}} className={this.state.expand ? "show" : "hide"}>{this.state.data.description2}</Card.Text></section>
                <div style={{ textAlign: "end" }}>
                    {this.state.chevronState ? icon : null}
                </div>
                
            </Card>
            
            <div>
            <CommentBox id={this.props.location.search.substring(1)} ></CommentBox>
            </div>
            {/* <div ></div> */}
            </div>
        }
        return (
            <div style={{ padding: "25px" }}>
                {this.state.data ? element : <LoaderIcon></LoaderIcon>}
            </div>
        )
    }
}

export default DetailedCard