import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
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
            isGuardian: !localStorage.getItem('newsSelection') || localStorage.getItem('newsSelection') == "Guardian" ? true : false,
            query: null,
            bookMarkStatus: false,
            searchKey: 1,
            location: window.location.pathname
        }
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.toggle2Status = this.toggle2Status.bind(this);
        this.changeQueryType = this.changeQueryType.bind(this);
        this.activateBookMark = this.activateBookMark.bind(this);
    }

    handleToggleChange = (toggleValue) => {
        if (!toggleValue) {
            localStorage.setItem("newsSelection", "NewYork")
            this.setState({ isGuardian: false })
        } else {
            this.setState({ isGuardian: true })
            localStorage.setItem("newsSelection", "Guardian")
        }
        window.location.reload();
    };

    toggleStatus(queryValue) {
        this.setState({
            query: queryValue
        })
    }

    toggle2Status(queryValue) {
        this.setState({
            query: queryValue,
            bookMarkStatus: false
        })
    }

    activateBookMark() {
        this.tooltip.hideTooltip()
        this.setState({
            bookMarkStatus: true
        })
    }

    changeQueryType() {
        this.setState({
            query: null,
            bookMarkStatus: false,
            active: false
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.location != window.location.href && window.location.href.indexOf("search") == -1) {
            this.setState({
                searchKey: this.state.searchKey * 2 + 1,
                location: window.location.href
            })
        }
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
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="bg-gradient-2">
                    <SearchKeys key={this.state.searchKey} onSearch={this.toggleStatus} />
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav key={this.state.searchKey+1} className="mr-auto">
                            <Nav.Link as={Link} to={"/"} href={"/"} onClick={this.changeQueryType} className={window.location.href.endsWith("/#/") ? "nav-link active" : ""} >Home</Nav.Link>
                            <Nav.Link as={Link} to={"/world"} href={"/world"} onClick={this.changeQueryType} className={window.location.href.endsWith("world") ? "nav-link active" : ""}>World</Nav.Link>
                            <Nav.Link as={Link} to={"/politics"} href={"/politics"} onClick={this.changeQueryType} className={window.location.href.endsWith("politics") ? "nav-link active" : ""}>Politics</Nav.Link>
                            <Nav.Link as={Link} to={"/business"} href={"/business"} onClick={this.changeQueryType} className={window.location.href.endsWith("business") ? "nav-link active" : ""}>Buisness</Nav.Link>
                            <Nav.Link as={Link} to={"/technology"} href={"/technology"} onClick={this.changeQueryType} className={window.location.href.endsWith("technology") ? "nav-link active" : ""}>Technology</Nav.Link>
                            <Nav.Link as={Link} to={"/sports"} href={"/sports"} onClick={this.changeQueryType} className={window.location.href.endsWith("sports") ? "nav-link active" : ""}>Sports</Nav.Link>
                        </Nav>
                        {!this.state.bookMarkStatus ? <Link to={"/favorites"} data-tip='Bookmark' data-place="bottom"><div style={{ color: 'white' }} >
                            <FaRegBookmark onClick={this.activateBookMark} size={25} /> </div> </Link> : <Link to={"/favorites"} data-tip='Bookmark' data-place="bottom"> <div style={{ color: 'white' }}><FaBookmark size={25} /></div></Link>}
                        <ReactTooltip ref={(node) => this.tooltip = node} delayHide={10} />
                        <Nav>
                            {this.state.query == null ? <><div className="NYGuard">NYTimes</div><Link style={{ paddingTop: "11px" }}><ToggleSwitch onToggleChange={this.handleToggleChange} /></Link><div xs={12} className="NYGuard">Guardian</div></> : null}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>
                    <Route path={"/"} render={(props) => <NewsComponent {...props} newsType={element} tabType="home" />} exact></Route>
                    <Route path={"/world"} render={(props) => <NewsComponent {...props} newsType={element} tabType="world" />} exact></Route>
                    <Route path={"/politics"} render={(props) => <NewsComponent {...props} newsType={element} tabType="politics" />} exact></Route>
                    <Route path={"/business"} render={(props) => <NewsComponent {...props} newsType={element} tabType="business" />} exact></Route>
                    <Route path={"/technology"} render={(props) => <NewsComponent {...props} newsType={element} tabType="technology" />} exact></Route>
                    <Route path={"/sports"} render={(props) => <NewsComponent {...props} newsType={element} tabType="sports" />} exact></Route>
                    <Route path={"/article"} render={(props) => <DetailedCard {...props} onLoad={this.toggle2Status} />} />
                    <Route path={"/favorites"} render={(props) => <Favorite {...props} onLoad={this.toggleStatus} />} />
                </Switch>
            </div>
        );
    }

}

export default Navigation