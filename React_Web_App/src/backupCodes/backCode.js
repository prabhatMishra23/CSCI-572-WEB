import React from "react";
import LoaderIcon from "./LoadingDataComponent";
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap'
import { MdBookmarkBorder, MdBookmark } from 'react-icons/md';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import scrollToComponent from 'react-scroll-to-component';
import { IconContext } from "react-icons";
import CommentBox from './CommentBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        this.element = React.createRef()
        this.toggleIcon = this.toggleIcon.bind(this);
        this.saveCard = this.saveCard.bind(this);
        this.unSaveCard = this.unSaveCard.bind(this);
    }

    componentDidMount() {
        let object = {}
        if (this.props.location.state) {
            object = this.props.location.state; debugger;
            localStorage.setItem('newsType', object.newsType);
        }
        this.setState(function () {
            return {
                newsType: this.props.location.state ? this.props.location.state.newsType : localStorage.getItem('newsType'),
                bookmarked: localStorage.getItem(this.props.location.search.substring(1)) == null ? false : true
            }
        }, this.fetchData);
    }

    componentDidUpdate() {
        const element = this.element;
        let hasOverflowingChildren = null;
        // Things involving accessing DOM properties on element
        // In the case of what this question actually asks:
        if (!this.state.chevronState) {
            hasOverflowingChildren = element.offsetHeight < element.scrollHeight ||
                element.offsetWidth < element.scrollWidth;
            if (this.state.chevronState != hasOverflowingChildren) {
                this.setState({
                    chevronState: hasOverflowingChildren
                })
            }
        }
    }

    fetchData() {
        console.log(this.state.newsType)
        let url = "article?id=" + this.props.location.search.substring(1) + "&newsType=" + this.state.newsType;
        console.log(url);
        axios.get(url)
            .then((res) => {
                this.setState({
                    data: res.data
                })
            }).catch((error) => {
                console.log(error)
            });
    }

    toggleIcon() {
        scrollToComponent(this.paragraph, {
            offset: 1000,
            align: 'top',
            duration: 1500
        });
        this.setState({
            expand: !this.state.expand
        })
    }

    formatText(text) {
        let arr = text.split(".");
        var modified1 = "";
        for (var i = 0; i < 4; i++) {
            modified1 += arr[i] + ".";
        }
        let modified2 = "";
        for (var i = 4; i < arr.length; i++) {
            modified2 += arr[i] + ".";
        }
        var arr_p = []
        arr_p[0] = modified1;
        arr_p[1] = modified2;
        return arr_p;
    }

    saveCard(e) {
        toast('Saving Wow so easy!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        localStorage.setItem(this.props.location.search.substring(1), this.state.data);
        let bookmarks = null;
        if (localStorage.getItem('bookmarks') == null) {
            bookmarks = []
        } else {
            bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        }
        bookmarks.push(this.props.location.search.substring(1));
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        console.log(localStorage)
        this.setState({
            bookmarked: true
        })
    }

    unSaveCard(e) {
        localStorage.removeItem(this.props.location.search.substring(1));
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        let index = bookmarks.indexOf(this.props.location.search.substring(1));
        if (index != -1) {
            bookmarks.splice(index, 1);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        console.log(localStorage)
        this.setState({
            bookmarked: false
        })
    }


    render() {
        const detailedCardData = this.state.data;
        let element = null;
        if (detailedCardData) {
            let formatted = this.formatText(detailedCardData.description);
            const icon = this.state.expand ? <FiChevronUp onClick={this.toggleIcon}></FiChevronUp> : <FiChevronDown onClick={this.toggleIcon}></FiChevronDown >
            element = <Card style={{ padding: "20px" }} className="shadow mb-2 bg-white rounded">
                <Card.Title style={{ fontStyle: "italic", fontSize: "23px" }} >{detailedCardData.title}</Card.Title>
                <div>
                    <Row className="justify-content-md-center" className="pl-3 pr-3">
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <span>{detailedCardData.date}</span>
                        </Col >
                        <Col xs={4} sm={4} md={4} lg={4}>
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} style={{ textAlign: "end" }} className="pl-0 pr-0">
                            <FacebookShareButton><FacebookIcon size={25} round={true}></FacebookIcon></FacebookShareButton>
                            <TwitterShareButton><TwitterIcon size={25} round={true} /></TwitterShareButton>
                            <EmailShareButton><EmailIcon size={25} round={true} /></EmailShareButton>
                        </Col>
                        <Col xs={1} sm={1} md={1} lg={1} className="pl-0" style={{ textAlign: "end" }}>
                            <ToastContainer />
                            <IconContext.Provider value={{ color: "red", fill: "red" }}>
                                {this.state.bookmarked ? <MdBookmark onClick={this.unSaveCard} style={{ borderColor: "red" }} size={25}></MdBookmark> :
                                    <MdBookmarkBorder onClick={this.saveCard} style={{ borderColor: "red" }} size={25}></MdBookmarkBorder>}
                            </IconContext.Provider>
                        </Col>
                    </Row>
                </div>
                <Card.Img className="mt-3" src={detailedCardData.image}></Card.Img>
                <div className={this.state.expand ? "show" : "hide"} ref={(el) => { this.element = el }}>
                    <p>
                        {formatted[0]}
                    </p>
                    <p ref={(p) => { this.paragraph = p; }}>
                        {formatted[1]}
                    </p>
                </div>
                <div style={{ textAlign: "end" }}>
                    {this.state.chevronState ? icon : null}
                </div>
                <CommentBox id={this.props.location.search.substring(1)}></CommentBox>
            </Card>
        }
        return (
            <div style={{ padding: "25px" }}>
                {this.state.data ? element : <LoaderIcon></LoaderIcon>}
            </div>
        )
    }
}

export default DetailedCard


//style={{ display: 'flex', flexDirection: 'row' }}

{/* <Col xs={12} sm={12} md={3} lg={3}>
            <Card style={{padding: "15px" }} className="shadow mb-2 bg-white rounded">
                <Card.Title>Prabhat News<div style={{ width: "40px", display: "inline-block" }} onClick={this.handleShareClick}><MdShare id="share" size={20} /><MdDelete id="delete" size={20}></MdDelete></div></Card.Title>
                <Image variant="top" src="https://static01.nyt.com/images/2020/04/01/science/01VIRUS-MENTAL1/merlin_171191448_e1df5e19-0d6c-49c6-a847-58c79c0b402d-superJumbo.jpg" thumbnail />
                <div className="mt-2 mb-3">
                    <Row>
                        <Col xs={4} sm={4} md={4} lg={4} className="cardDate">
                            <span>2/04/2019</span>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} className="d-flex flex-row-reverse">
                                <div className='ml-1'>
                                {badgesMap['guardianFav'] ? badgesMap['guardianFav'] : <Badge variant="secondary" style={{ color: "white", height: "20px", fontSize: "13px" }}>{'guardianFav'}</Badge>}
                                </div>
                                <div className='mr-1'>
                                {badgesMap['world'] ? badgesMap['world'] : <Badge variant="secondary" style={{ color: "white", height: "20px", fontSize: "13px" }}>{'health'}</Badge>}
                                </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </Col>   */}