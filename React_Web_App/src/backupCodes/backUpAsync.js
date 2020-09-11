import React from "react";
import AsyncSelect from 'react-select/async';
import _ from "lodash";

class SearchKeys extends React.Component {
    constructor() {
        super();
        this.state = {
            keyResults: [],
            selectedResult: null
        }
        this.getOptions = this.getOptions.bind(this);
        this.getOptions = _.debounce(this.getOptions, 250,{
            'leading': false,
           'trailing': true
          });
    }

    async getOptions(value) {
        if (value != "") {
            console.log(value);
            try {
                const response = await fetch(
                    `https://prabhat-mishra.cognitiveservices.azure.com/bing/v7.0/suggestions?q=${value}`,
                    {
                        headers: {
                            "Ocp-Apim-Subscription-Key": "92014f23f3a64269bf3131dddf58fd55"
                        }
                    }
                );
                const data = await response.json();
                if(data.suggestionGroups && data.suggestionGroups[0]){
                const resultsRaw = data.suggestionGroups[0].searchSuggestions;
                const keyResults = resultsRaw.map(result => ({ label: result.displayText, value: result.displayText }));
                this.setState({ keyResults });
                // const result = this.state.keyResults.filter(i =>
                //     i.title.toLowerCase().includes(value.toLowerCase())
                // );
                // const elements = [];
                // elements.push({
                //     label : value,
                //     value : value
                // })
                // for(var i=0; i< result.length;i++){
                //     elements.push({
                //         label : result[i].title,
                //         value : result[i].title
                //     });
                // }
                return keyResults;
             }
            } catch (error) {
                console.log(error);
                console.error(`Error fetching search ${value}`);
            }
        }
    }

    render() {
        return (
            <div className="keywordContainer">
            <AsyncSelect cacheOptions defaultOptions loadOptions={this.getOptions} onInputChange={opt => console.log(opt)} placeholder="Enter Keyword .." />
            </div>
        );
    }
}

export default SearchKeys; 