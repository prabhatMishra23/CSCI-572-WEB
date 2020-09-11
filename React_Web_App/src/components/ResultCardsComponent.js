import React from "react";
import Card from 'react-bootstrap/Card';
import { Row, Col, Container } from 'react-bootstrap';
import { MdShare } from 'react-icons/md';
import { badgesMap } from './Badges';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import ShareModal from './ShareModalComponent';

import {
    Link
} from "react-router-dom";
import Truncate from "react-truncate";


class ResultCardComp extends React.Component {

    constructor() {
        super()
        this.state = {
            isShow: false,
            clicked: false
        }
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleShareClick = this.handleShareClick.bind(this);
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
    render() {
        const card = {
            title: this.props.cardData.title,
            image: this.props.cardData.image,
            section: this.props.cardData.section,
            date: this.props.cardData.date,
            url: this.props.cardData.url,
            detailedCardId: this.props.cardData.detailedCardId,
            newsType: this.props.cardData.newsType
        }
        const location = {
            key: 'detCar', // not with HashHistory!
            pathname: '/article',
            search: '?' + card.detailedCardId,
            state: {
                newsType: card.newsType
            }
        }
        return (
            <Col xs={12} sm={12} md={3} lg={3}>
                <Link key={card.id} to={location} style={{ textDecoration: 'none', color: "black" }}>
                    <Card style={{ padding: "15px" }} className="shadow mb-2 bg-white rounded">
                        <Card.Title style={{fontSize : "15px",fontWeight:"bold",fontStyle:"italic"}}><Truncate width={482} ellipsis={<span>...</span>}>{card.title}</Truncate><div style={{ width: "30px", display: "inline-block" }} onClick={this.handleShareClick}><MdShare id="share" size={25} /></div><ShareModal id="modal" onToggle={this.handleModalChange} isShow={this.state.isShow} card={card}></ShareModal></Card.Title>
                        <Image variant="top" src={card.image} thumbnail />
                        <div className="mt-2 mb-3">
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4} className="cardDate">
                                <span>{card.date}</span>
                            </Col>
                            <Col xs={8} sm={8} md={8} lg={8} style={{ textAlign: "end" }}>
                                {badgesMap[card.section.toLowerCase()] ? badgesMap[card.section.toLowerCase()] : <Badge variant="secondary" style={{ color: "white", height: "18px", fontSize: "11px" }}>{card.section.toUpperCase()}</Badge>}
                            </Col>
                        </Row>
                        </div>
                    </Card>
                </Link>
            </Col>
        )
    }
}

export default ResultCardComp;

