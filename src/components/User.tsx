import React from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import {useParams } from "react-router-dom";

export interface IUserProps {}

const User: React.FunctionComponent<IUserProps> = (props) => 
{
    const {userId} = useParams();
         return <div>
            <h1>This is the user page and the user id : {userId}</h1>
        </div>;
};


export default User;