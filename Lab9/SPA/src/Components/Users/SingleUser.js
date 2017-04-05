import './SingleUser.css';
import React from 'react';
import {
    Link
} from 'react-router-dom'

const SingleUser = ({ user }) => (
    <article>
        <h3>First Name: {user.first_name}</h3>
        <h3> Last Name: {user.last_name}</h3>
        <h4>Email: {user.email}</h4>
        <h4>Gender: {user.gender}</h4>
        <h4>IP Address: {user.ip_address}</h4>
        <p>
            <small>
                <Link to={`/`}>Home Page</Link>
            </small>
        </p>
    </article>
);

export default SingleUser;
