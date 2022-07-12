import React from "react";
import {ChakraProvider, theme, Text} from "@chakra-ui/react";
import { Stack, HStack, VStack, Box, Button } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons';

interface Props {
  error: Error | undefined;
}

const ErrorScreen: React.FC<Props> = props => {
  try {
    console.error(JSON.parse(JSON.stringify(props.error)));
  } catch {
    console.error(props.error);
  }
  return (
    <ChakraProvider theme={theme}>
      <VStack>
        <Text fontSize='6xl'>Hmm, You seem to have encountered an error.</Text>
        <WarningIcon/>
        <Text fontSize='4xl'>We'll find a nearby CS Major to fix this. For now, we'll get you on the right track.</Text>
        <Button colorScheme='teal' size='md'>
          Go Home
        </Button>
      </VStack>

    </ChakraProvider>
  )
}
