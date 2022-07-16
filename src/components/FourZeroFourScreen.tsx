import * as React from "react";
import { Box, Button, Center, Flex, Text, Icon } from "@chakra-ui/react";
import { MdSettings } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

interface Props {
  error: Error | undefined;
}

const FourZeroFourScreen: React.FC = () => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate('');
  };
  return (
  <Box p="5" borderWidth="1px">
    <Center>
      <Flex align="baseline" mt={5}>
        <Icon as={MdSettings} w={375} h={175} />
      </Flex>
    </Center>
    <Center>
      <Text
        mt={2}
        fontSize="4xl"
        fontWeight="semibold"
        lineHeight="short"
        noOfLines={2}
      >
        Hmm, Something is Not Right here...
      </Text>
    </Center>
    <Center>
      <Text mt={2}>
        We'll find a CS Major to fix this. For now, we'll get you on the right
        track.
      </Text>
    </Center>
    <Center>
      <Flex mt={55} align="center">
        <Button colorScheme="blue" onClick={navigateToHome}>Go Home</Button>
      </Flex>
    </Center>
  </Box>
);
}

export default FourZeroFourScreen;
