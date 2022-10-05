import React, { useEffect, useState } from "react";
import { apiUrl, Header, HeaderItem, Service, useAuth } from "@hex-labs/core";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const Navigation: React.FC = () => {
  const { currentHexathon } = useCurrentHexathon();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const [role, setRoles] = useState<any>({
    member: false,
    exec: false,
    admin: false,
  });

  const changeEvent = () => {
    window.localStorage.removeItem("hexathonId");
  };

  const logOut = async () => {
    window.localStorage.removeItem("hexathonId");
    await axios.post(apiUrl(Service.AUTH, "/auth/logout"));
    window.location.href = `https://login.hexlabs.org/login?redirect=${window.location.href}`;
  };

  useEffect(() => {
    const getRoles = async () => {
      if (user?.uid) {
        const response = await axios.get(apiUrl(Service.USERS, `/users/${user?.uid}`));
        setRoles({ ...response.data.roles });
      }
    };

    getRoles();
  }, [user?.uid]);

  const rightHeaderItem = currentHexathon ? (
    <HeaderItem onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Menu isOpen={isOpen}>
        <MenuButton>
          <Box display="flex" alignItems="center" role="group">
            <Image
              src={`/events/${currentHexathon.id}.jpeg`}
              borderRadius="full"
              boxSize="30px"
              padding="1px"
              _groupHover={{
                borderColor: "#7B69EC",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            />
            <Text marginLeft="5px">{currentHexathon.name}</Text>
            <ChevronDownIcon marginLeft="3px" />
          </Box>
        </MenuButton>
        <MenuList lineHeight="2" onClick={onClose}>
          <Link to="/" onClick={changeEvent}>
            <MenuItem>Change Event</MenuItem>
          </Link>
          <Link to="/" onClick={logOut}>
            <MenuItem>Sign Out</MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </HeaderItem>
  ) : (
    <Link to="/" onClick={logOut}>
      <HeaderItem>Sign Out</HeaderItem>
    </Link>
  );

  const rightHeaderItemMobile = currentHexathon ? (
    <>
      <Link to="/" onClick={changeEvent}>
        <HeaderItem>Change Event</HeaderItem>
      </Link>
      <Link to="/" onClick={logOut}>
        <HeaderItem>Sign Out</HeaderItem>
      </Link>
    </>
  ) : (
    <Link to="/" onClick={logOut}>
      <HeaderItem>Sign Out</HeaderItem>
    </Link>
  );

  return (
    <Header rightItem={rightHeaderItem} rightItemMobile={rightHeaderItemMobile}>
      {currentHexathon && (
        <>
          <Link to={`/${currentHexathon.id}`}>
            <HeaderItem>Dashboard</HeaderItem>
          </Link>
          <Link to={`/${currentHexathon.id}/team/dashboard`}>
            <HeaderItem>Team Management</HeaderItem>
          </Link>
          {(role.admin || role.exec) && (
            <Link to={`/${currentHexathon.id}/admin`}>
              <HeaderItem>Admin Home</HeaderItem>
            </Link>
          )}
          {role.member && (
            <Link to={`/${currentHexathon.id}/grading`}>
              <HeaderItem>Grading</HeaderItem>
            </Link>
          )}
        </>
      )}
    </Header>
  );
};

export default Navigation;
