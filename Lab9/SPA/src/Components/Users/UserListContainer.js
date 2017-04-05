import React, { Component } from 'react';
import { getUserList } from '../../Data/users';
import UserList from './UserList';
import FirstPageContainer from './FirstPageContainer';

class UserListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: []
        };
    }

    async componentDidMount() {
        window.scrollTo(0, 0);
        const userList = await getUserList(this.props.match.params.page);        
        this.setState({ userList });
    }

    async componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);
        const userList = await getUserList(nextProps.match.params.page);        
        this.setState({ userList });
    }

    render() {
        if (this.state.userList.length === 0) return <div>Loading...</div>;
        if (this.props.match.params.page <= 0 || this.props.match.params.page >= 39 || !this.props.match.params.page ) {
            return <FirstPageContainer/>
        }

        return <UserList users={this.state.userList} page={this.props.match.params.page}/>
    }
}

export default UserListContainer;
