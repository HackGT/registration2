import React from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export interface IUserProps {}

const User: React.FunctionComponent<IUserProps> = (props) => 
(
        <div>
            <h1>This is the user page.</h1>
        </div>
    );


export default User;