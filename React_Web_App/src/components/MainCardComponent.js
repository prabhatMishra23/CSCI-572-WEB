import React from "react";
import Card from 'react-bootstrap/Card';
import { Row, Col} from 'react-bootstrap';
import { MdShare } from 'react-icons/md';
import { badgesMap } from './Badges';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import ShareModal from './ShareModalComponent';
import Truncate from 'react-truncate';

import {
    Link
} from "react-router-dom";


class CardComp extends React.Component {

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
            description: this.props.cardData.description,
            url: this.props.cardData.url,
            detailedCardId: this.props.cardData.detailedCardId
        }
        const location = {
            key: 'detCar', // not with HashHistory!
            pathname: '/article',
            search: '?' + this.props.cardData.detailedCardId,
            state: {
                newsType: this.props.newsType
            }
        }
        return (
            <React.Fragment key={this.props.cardData.id}>
                <Link to={location} style={{ textDecoration: 'none', color: "black" }}>
                    <Card className="shadow mb-2 bg-white rounded">
                        <Card.Body>
                            {/* <Container fluid> */}
                            <Row className="justify-content-md-center">
                                <Col xs={12} sm={12} md={3} lg={3}>
                                    <Image src={this.props.cardData.image} thumbnail />
                                </Col>
                                <Col xs={12} sm={12} md={9} lg={9}>
                                    <Card.Title style={{ fontStyle: "italic",fontWeight:'bolder',fontSize:'20px'}}>{this.props.cardData.title}<div style={{ width: "30px", display: "inline-block" }} onClick={this.handleShareClick}><MdShare id="share" size={25} /></div><ShareModal id="modal" onToggle={this.handleModalChange} isShow={this.state.isShow} card={card}></ShareModal></Card.Title>
                                    <Card.Text>
                                    <Truncate lines={3} ellipsis={<span>...</span>}>
                                       {this.props.cardData.description}
                                    </Truncate>
                                    </Card.Text>
                                    <div>
                                        <Row className="justify-content-md-between">
                                            <Col xs={6} sm={6} md={4} lg={4} className="cardDate">
                                                <span>{this.props.cardData.date}</span>
                                            </Col>
                                            <Col xs={6} sm={6} md={4} lg={4} style={{ textAlign: "end" }}>
                                                {badgesMap[this.props.cardData.section.toLowerCase()] ? badgesMap[this.props.cardData.section.toLowerCase()] : <Badge variant="secondary" style={{ color: "white", height: "18px", fontSize: "11px" }}>{this.props.cardData.section.toUpperCase()}</Badge>}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            {/* </Container> */}
                        </Card.Body>
                    </Card>
                </Link>
                <br></br>
            </React.Fragment>
        )
    }
}

export default CardComp;

