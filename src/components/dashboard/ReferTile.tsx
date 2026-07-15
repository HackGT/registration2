import React, { useState } from "react";
import { Box, Heading, Text, Tag, Flex, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

const ReferTile: React.FC = () => {
  const { hexathonId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startReferral = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl(Service.REGISTRATION, "/referrals/actions/create-referral"),
        {
          hexathon: hexathonId,
        }
      );
      navigate(`/${hexathonId}/referral/${response.data.id}`);
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      borderRadius="4px"
      boxShadow={{
        base: "rgba(0, 0, 0, 0.15) 0px 0px 6px 1px",
      }}
      _hover={{
        boxShadow: "rgba(0, 0, 0, 0.20) 0px 0px 8px 2px",
      }}
      transition="box-shadow 0.2s ease-in-out"
      style={{ cursor: loading ? "default" : "pointer" }}
      onClick={() => {
        if (!loading) {
          startReferral();
        }
      }}
      bg={loading ? "gray.200" : "white"}
      maxWidth={{ md: "calc((100% - 16px) / 2)", xl: "calc((100% - 32px) / 3)" }}
    >
      <Flex
        bgGradient="linear(to-l, #33c2ff, #7b69ec)"
        borderTopRadius="4px"
        height="70px"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Tag size="sm" variant="solid" colorScheme="teal" margin="5px">
          Not Started
        </Tag>
      </Flex>

      <Box padding="20px 32px">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="6px" color="#212121">
          <Text>
            Refer
            {loading && <Spinner ml={3} />}
          </Text>
        </Heading>
        <Text fontSize="sm" color="#858585" marginBottom="10px">
          Open now
        </Text>
        <Text fontSize="md">
          Refer someone to this event.
        </Text>
      </Box>
    </Box>
  );
};

export default ReferTile;
