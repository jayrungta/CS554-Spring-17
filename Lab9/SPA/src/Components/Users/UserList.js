import React from 'react';
import {
    Link
} from 'react-router-dom'

const UserList = ({ users, page }) => (
    <div>
        <h3>This is a list of users:</h3>
        
        {
            users.map((user, index) => (
            <article key={index}>
                <header>
                    <h4>{user.id+"."} <Link to={`/user/${user.id}`}> {user.first_name} {user.last_name}</Link></h4>
                </header>
            </article>
        ))}
        <div>
            <p>
                <Link to={`/archive/${parseInt(page) - 1}`}>Previous Page</Link>
                <br/>
                <Link to={`/archive/${parseInt(page) + 1}`}>Next Page</Link>
            </p>
        </div>
    </div>
);

export default UserList;