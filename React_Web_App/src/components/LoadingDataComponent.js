import React from "react"
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: purple;
`;
class LoaderIcon extends React.Component{

    constructor(){
        super();
        this.state = {
            loading : true
        }
    }

    render(){
        return (
            <div className="LoadingIcon">
              <BounceLoader
                css={override}
                size={30}
                color={"#2449a8"}
                loading={this.state.loading}
              /><p>Loading</p>
            </div>
          );
    }
}

export default LoaderIcon;