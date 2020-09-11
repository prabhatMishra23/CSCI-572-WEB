import React from "react";
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import { withRouter } from 'react-router-dom';

class SearchKeys extends React.Component {
    constructor() {
        super();
        this.state = {
            keyResults: [],
            selectedResult: null
        }
        this.getOptions = this.getOptions.bind(this);
        this.getOptions = debounce(this.getOptions, 890, {
            'leading': false,
            'trailing': true
        });
        this.searchAll = this.searchAll.bind(this);
    }

    searchAll(value) {
        let query = value.value;
        
        this.setState({ selectedResult: query }, () => {
            this.props.history.push({
              pathname: "/search",
              search : '?q=' + query,
            //   newsData : {
            //       newsQuery : query
            //   }
            });
        });
        this.props.onSearch(query);
    }

    async getOptions(value) {
        if (value != "") {
            try {
                const response = await fetch(
                    `https://prabhat-mishra.cognitiveservices.azure.com/bing/v7.0/suggestions?q=${value}`,
                    {
                        headers: {
                            "Ocp-Apim-Subscription-Key": "##########################"
                        }
                    }
                );
                const data = await response.json();
                if (data.suggestionGroups && data.suggestionGroups[0]) {
                    const resultsRaw = data.suggestionGroups[0].searchSuggestions;
                    const keyResults = resultsRaw.map(result => ({ label: result.displayText, value: result.displayText }));
                    this.setState({ keyResults });
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
            <div  className="keywordContainer" >
                <AsyncSelect cacheOptions defaultOptions loadOptions={this.getOptions} onChange={this.searchAll} placeholder={"Enter Keyword..."}/>
            </div>
        );
    }
}

export default withRouter(SearchKeys);
