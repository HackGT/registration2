import React from "react";
import { useParams } from "react-router-dom";

const User: React.FC = () => {
  const { userId } = useParams();
  return (
    <div>
      <h1>This is the user page with user id: {userId}</h1>
    </div>
  );
};

export default User;
