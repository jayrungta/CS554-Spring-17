import React, { Component } from 'react';
import { getUser } from '../../Data/users';
import SingleUser from './SingleUser';

class SingleUserContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        };
    }

    setStateFromUser(user) {
        // const blob = new Blob([user.userText], { type: 'text/html' });
        // const userBlobUrl = window.URL.createObjectURL(blob);

        this.setState({ user });
    }

    async componentDidMount() {
        const user = await getUser(this.props.match.params.id);
        this.setStateFromUser(user);
    }

    async componentWillReceiveProps(nextProps) {
        const user = await getUser(nextProps.match.params.id);
        this.setStateFromUser(user);
    }

    render() {
        if (this.state.user === undefined) return <div>Loading...</div>;

        return <SingleUser user={this.state.user}/>
    }
}

export default SingleUserContainer;
