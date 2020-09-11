import React from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends React.Component {
    componentDidMount() {

        this.removeCommentBox = commentBox('5664339084181504-proj');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {
        return (
            <div id={this.props.id} className="commentbox" />
        );
    }

}

export default CommentBox;