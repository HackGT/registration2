import React, { MutableRefObject, useEffect } from "react";
import {
  Box,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
  Tag,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

interface Props {
  title: string;
  description: string;
  branchId: string;
  image?: string;
  status: string;
  hasApplication: boolean;
  currAppLink: string;
  chooseBranch: (appBranchID: any) => Promise<string | undefined>;
}


const Tile: React.FC<Props> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const onConfirm = async () => {
    onClose()
    try {
      const newAppLink = await props.chooseBranch(props.branchId)
      window.open(newAppLink)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Start a new application?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You have already started another application. If you start a new one, all previous progress will be lost.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue' onClick={onConfirm} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <LinkBox
      borderRadius="4px"
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      onClick={async () => {
        console.log("clicked!")
        if (props.hasApplication) {
          if (props.status=="Not Started") {
            onOpen()
          } else if (props.status=="In Progress") {
            window.open(props.currAppLink)
          } else {
            console.log("submitted!")
          }
        } else {
          const newAppLink = await props.chooseBranch(props.branchId)
          window.open(newAppLink)
        }
      }}
    >
      <Flex
        bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
        borderTopRadius="4px"
        height="150px"
        onClick={() => console.log("Clicked!")}
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Tag size='sm' key='sm' variant='solid' colorScheme='teal' margin="5px">
          {props.status}
        </Tag>
      </Flex>

      <Box padding="20px 32px">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="10px" color="#212121">
          <LinkOverlay href="#">
            {props.title}
          </LinkOverlay>
        </Heading>
        <Text fontSize="sm" color="#858585">
          {props.description}
        </Text>
      </Box>
    </LinkBox>
    </>
    
  )
};

export default Tile;
