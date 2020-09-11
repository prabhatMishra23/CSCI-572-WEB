import React from "react";
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import { badgesMap } from './Badges';
import ShareModal from './ShareModalComponent';
import { MdShare, MdDelete } from 'react-icons/md';
import Truncate from "react-truncate";
import {
    Link
} from "react-router-dom";
import {toast, Zoom } from 'react-toastify';

class BookMark extends React.Component {
    constructor(){
       super()
       this.state = {
        isShow: false
       }
       this.handleModalChange = this.handleModalChange.bind(this);
       this.handleShareClick = this.handleShareClick.bind(this);
       this.deleteBookmark = this.deleteBookmark.bind(this);
    }

    handleShareClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            isShow: !this.state.isShow
        });
    }
    handleModalChange(closed) {
        this.setState({
            isShow: closed
        })
    }

    deleteBookmark(e) {
        toast(<span style={{color:"black"}}>{"Removing " + this.props.card.title}</span>, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            rtl:false,
            transition:Zoom
        });
        localStorage.removeItem(this.props.card.detailedCardId);
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        if(bookmarks){
            let index = bookmarks.indexOf(this.props.card.detailedCardId);
            if (index != -1) {
                bookmarks.splice(index, 1);
            }
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
        this.props.onDelete();
        e.stopPropagation();
        e.preventDefault();
    }

    render(){
        let card = this.props.card;
        const location = {
            key: 'detCar', // not with HashHistory!
            pathname: '/article',
            search: '?' + this.props.card.detailedCardId,
            state: {
                newsType: this.props.card.newsType
            }
        }
        return(
            <Col xs={12} sm={12} md={3} lg={3}>
            <Link to={location} style={{ textDecoration: 'none', color: "black" }}>
            <Card style={{padding: "15px" }} className="shadow mb-2 bg-white rounded">
            <Card.Title style={{fontSize : "15px",fontWeight:"bold",fontStyle:"italic"}}><Truncate width={482} ellipsis={<span>...</span>}>{card.title}</Truncate><div style={{ width: "40px", display: "inline-block" }}><MdShare id="share" size={20} onClick={this.handleShareClick} /><MdDelete onClick={this.deleteBookmark} id="delete" size={20}></MdDelete></div><ShareModal id="modal" onToggle={this.handleModalChange} isShow={this.state.isShow} card={card} heading={card.newsType}></ShareModal></Card.Title>
                <Image variant="top" src={card.image} thumbnail />
                <div className="mt-2 mb-3">
                    <Row style={{alignItems: "center"}}>
                        <Col xs={4} sm={4} md={4} lg={4} className="cardDate">
                            <span>{card.date}</span>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} className="d-flex flex-row-reverse">
                                <div className='ml-1'>
                                {badgesMap[card.newsType]}
                                </div>
                                <div className='mr-1'>
                                {badgesMap[card.section.toLowerCase()] ? badgesMap[card.section.toLowerCase()] : <Badge variant="secondary" style={{ color: "white", height: "18px", fontSize: "11px" }}>{card.section.toUpperCase()}</Badge>}
                                </div>
                        </Col>
                    </Row>
                </div>
            </Card>
            </Link>
        </Col>
        );
    }
}


export default BookMark;