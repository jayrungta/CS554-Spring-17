import React, { Component } from 'react';
import { getFirstPage } from '../../Data/users';
import FirstPage from './FirstPage';

class UserListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: []
        };
    }

    async componentDidMount() {
        const userList = await getFirstPage();        
        this.setState({ userList });
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        if (this.state.userList.length === 0) return <div>Loading...</div>;

        return <FirstPage users={this.state.userList} page="1"/>
    }
}

export default UserListContainer; 
