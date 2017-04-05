import React from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import UserListContainer from './UserListContainer';
import FirstPageContainer from './FirstPageContainer';
import SingleUserContainer from './SingleUserContainer';

export const Users = () => (
    <Router>
        <div>
            <Route exact path="/" component={FirstPageContainer} />
            <Route path="/user/:id" component={SingleUserContainer} />
            <Route path="/archive/:page" component={UserListContainer} />
        </div>
    </Router>
);
