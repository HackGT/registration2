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
import { useNavigate } from "react-router-dom";
import ApplicationStatus from "../../types/ApplicationStatus";

interface Props {
  branch: any;
  image?: string;
  status: string;
  hasApplication: boolean;
  currAppLink: string;
  chooseBranch: (appBranchID: any) => Promise<string | undefined>;
}


const Tile: React.FC<Props> = props => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const onConfirm = async () => {
    onClose()
    try {
      const newAppLink = await props.chooseBranch(props.branch._id)
      if (newAppLink) {
        navigate(newAppLink, { replace: true });
      } else {
        console.log("Undefined link form after choosing branch")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinkBox
      borderRadius="4px"
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      onClick={async () => {
        if (props.hasApplication) {
          if (props.status == ApplicationStatus.NotStarted) {
            onOpen()
          } else if (props.status == ApplicationStatus.InProgress) {
            navigate(props.currAppLink, { replace: true });
          } else {
            console.log("submitted!")
          }
        } else {
          const newAppLink = await props.chooseBranch(props.branch._id)
          if (newAppLink) {
            navigate(newAppLink, { replace: true });
          } else {
            console.log("Issue getting new app link")
          }
        }
      }}
    >
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay >
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
      <Flex
        bgGradient={props.image ? "" : "linear(to-l, #33c2ff, #7b69ec)"}
        borderTopRadius="4px"
        height="150px"
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
            {props.branch.name}
          </LinkOverlay>
        </Heading>
        <Text fontSize="sm" color="#858585">
          {`${new Date(props.branch.settings.open).toDateString()} - ${new Date(
            props.branch.settings.close
          ).toDateString()}`}
        </Text>
      </Box>
    </LinkBox>
  )
};

export default Tile;
