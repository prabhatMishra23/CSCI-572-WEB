import React from "react";
import Modal from 'react-bootstrap/Modal'
import {Row,Container,Col} from 'react-bootstrap'
import {
    EmailShareButton,
    FacebookShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    TwitterIcon,
} from 'react-share'


class ShareModal extends React.Component {
    constructor() {
        super();
        this.state = {
            toShow: false
        }
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.isShow != prevProps.isShow) {
            this.setState({
                toShow: this.props.isShow
            })
        }
    }
    

    handleClose = (e) =>{
        this.setState(prevState => (
            {
                toShow: !prevState.toShow
            }
        ), this.closedState);
    }

    closedState() {
        this.props.onToggle(this.state.toShow)
    }

    render() {
        return (
            <div onClick={e => {e.stopPropagation(); e.nativeEvent.stopImmediatePropagation();}}>
            <Modal show={this.state.toShow} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                {this.props.card.newsType?<div className="modalHeading">{this.props.card.newsType=="NewYorkTimes"?"NYTimes":"Guardian"}</div>:null}
                    <p>{this.props.card.title}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Container>
                        <Row className="show-grid" style={{justifyContent: "center", marginBottom: "3px"}}>
                             Share Via
                        </Row>

                        <Row className="show-grid">
                            <Col xs={4} md={4} style={{textAlign: "center"}}>
                            <FacebookShareButton url={this.props.card.url} hashtag="#CSCI_571_NewsApp" ><FacebookIcon size={48} round={true} /></FacebookShareButton>
                            </Col>
                            <Col xs={4} md={4} style={{textAlign: "center"}}>
                            <TwitterShareButton hashtags={["CSCI_571_NewsApp"]} url={this.props.card.url}><TwitterIcon size={48} round={true} /></TwitterShareButton>
                            </Col>
                            <Col xs={4} md={4} style={{textAlign: "center"}}>
                            <EmailShareButton subject="#CSCI_571_NewsApp" url={this.props.card.url}><EmailIcon size={48} round={true} /></EmailShareButton>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>
            </div>
        )
    }
}

export default ShareModal;