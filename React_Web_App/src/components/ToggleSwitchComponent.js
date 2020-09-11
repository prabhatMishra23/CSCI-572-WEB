import React from 'react';
import Switch from 'react-switch';


class ToggleSwitch extends React.Component {

    constructor(){
        super();
        this.state = {
            checked : !localStorage.getItem('newsSelection') || localStorage.getItem('newsSelection') == "Guardian" ? true : false,
        }
      this.handleChange = this.handleChange.bind(this);
    }


    handleChange(){
        this.setState(prevState =>(
            {
                checked : !prevState.checked
            }
        ),this.callToggle);
    }

    callToggle(){
        this.props.onToggleChange(this.state.checked);
    }
    render() { 
        return (
            < label htmlFor="material-switch" >
                {/* <div className="toggleSwitchNYG"> */}
                <Switch
                    checked={this.state.checked}
                    onChange={this.handleChange}
                    onColor="#489bf3"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={41}
                    offColor="#E4DFDF"
                    className="react-switch"
                    id="material-switch"
                />
                {/* <div className="NYGuard">Guardian</div> */}
                {/* </div> */}
            </label >
        );
    }
}

export default ToggleSwitch;
