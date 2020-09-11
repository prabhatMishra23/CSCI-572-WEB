import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { MdBookmarkBorder,MdBookmark } from 'react-icons/md';
import ToggleSwitch from './ToggleSwitchComponent';
import SearchKeys from './NavSearchKeyWord';
import NewsComponent from './MainNewsComponent';
import DetailedCard from './SpecificCardComponent';
import Favorite from './Favorite';
import ReactTooltip from "react-tooltip";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


class Navigation extends React.Component {
    constructor() {
        super();
        this.state = {
            isGuardian: localStorage.getItem('newsSelection')=="Guardian"?true:false,
            query:null,
            bookMarkStatus: false,
            fooKey : 1 
        }
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.toggle2Status = this.toggle2Status.bind(this);
        this.changeQueryType = this.changeQueryType.bind(this);
        this.activateBookMark = this.activateBookMark.bind(this);
    }

    handleToggleChange = (toggleValue) => {
        if (!toggleValue) {
            localStorage.setItem("newsSelection","NewYork")
            this.setState({ isGuardian: false })
        } else {
            this.setState({ isGuardian: true })
            localStorage.setItem("newsSelection","Guardian")
        }
        window.location.reload();
    };

    toggleStatus(queryValue){
        this.setState({
            query : queryValue
        })
    }

    toggle2Status(queryValue){
        this.setState({
            query : queryValue,
            bookMarkStatus : false
        })
    }

    activateBookMark(){
         this.setState({
            bookMarkStatus: true
         })
    }

    changeQueryType(){
        this.setState({
            query : null,
            bookMarkStatus: false,
            fooKey : this.state.fooKey+1
        })
    }

    render() {
        let element;
        const isGuardian = this.state.isGuardian;
        if (isGuardian) {
            element = "Guardian";
        } else {
            element = "NewYork";
        }
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="bg-custom-2">
                    <SearchKeys key={this.state.fooKey} onSearch={this.toggleStatus}/>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/" to={"/"}>Home</Nav.Link>
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/world" to={"/world"}>World</Nav.Link>
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/politics" to={"/politics"}>Politics</Nav.Link>
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/business" to={"/business"}>Buisness</Nav.Link>
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/technology" to={"/technology"}>Technology</Nav.Link>
                                <Nav.Link as={Link} onClick={this.changeQueryType} href="/sports" to={"/sports"}>Sports</Nav.Link>
                            </Nav>
                        <Nav>
                            <Nav.Link as={Link} to={"/favorites"}><div style={{ color: 'white' }} data-tip='Bookmark' data-place="bottom" data-for="toolTip">
                             {!this.state.bookMarkStatus?<MdBookmarkBorder onClick ={this.activateBookMark} size={25} />:<MdBookmark size={25} />}
                             <ReactTooltip id="toolTip" delayHide={1000} effect='solid' />
                            </div>
                            </Nav.Link>
                            {this.state.query==null?<Nav.Link><ToggleSwitch onToggleChange={this.handleToggleChange} /></Nav.Link>:null}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>
                <Route path={"/"} render={(props) => <NewsComponent {...props} newsType={element} tabType="home"/>} exact></Route>
                <Route path={"/world"} render={(props) => <NewsComponent {...props} newsType={element} tabType="world"/>}exact></Route>
                <Route path={"/politics"} render={(props) => <NewsComponent {...props} newsType={element} tabType="politics"/>}exact></Route>
                <Route path={"/business"} render={(props) => <NewsComponent {...props} newsType={element} tabType="business"/>}exact></Route>
                <Route path={"/technology"} render={(props) => <NewsComponent {...props} newsType={element} tabType="technology"/>}exact></Route>
                <Route path={"/sports"} render={(props) => <NewsComponent {...props} newsType={element} tabType="sports"/>}exact></Route>
                <Route path={"/article"} render={(props) => <DetailedCard {...props} onLoad = {this.toggle2Status}/>} />
                <Route path={"/favorites"} render={(props) => <Favorite {...props} onLoad = {this.toggleStatus} />} />
                </Switch>
            </div>
        );
    }

}

export default Navigation