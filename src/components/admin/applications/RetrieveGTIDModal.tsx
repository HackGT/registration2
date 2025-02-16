import {
  chakra,
  Box,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  useDisclosure,
  Text,
  Button,
  useToast,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import BaseHighlight, { defaultProps } from "prism-react-renderer";
import React from "react";
import { parseFullName } from "parse-full-name";
import { DateTime } from "luxon";

interface Props {
  data: any;
}

const RetrieveGTIDModal: React.FC<Props> = props => {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  // Create code to autofill GTID lookup form
  let copyCode: string | null = null;
  if (props.data.name && props.data.applicationData.dateOfBirth) {
    const parsedName = parseFullName(props.data.name);
    const dateOfBirth = DateTime.fromISO(props.data.applicationData.dateOfBirth);

    copyCode = `document.gtid_ind_lookup_par_form.fname.value = "${parsedName.first}";
document.gtid_ind_lookup_par_form.lname.value = "${parsedName.last}";
document.gtid_ind_lookup_par_form.bmonth.value = "${dateOfBirth.toFormat("LL")}";
document.gtid_ind_lookup_par_form.bday.value = "${dateOfBirth.toFormat("dd")}";
document.gtid_ind_lookup_par_form.byear.value = "${dateOfBirth.year}";`;
  }

  return (
    <>
      <Link onClick={onOpen} color="teal.500">
        Click to Retrieve
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to Retrieve GTID</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            {copyCode !== null ? (
              <>
                <Alert status="warning" mb="4">
                  <AlertIcon />
                  <Text fontSize="sm">
                    This method may not work everytime. You can also try manually inputting the
                    user's information in the look-up form from the application detail page.
                  </Text>
                </Alert>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="sm">1. Copy Autofill Code</Heading>
                    <BaseHighlight {...defaultProps} code={copyCode} language="javascript">
                      {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <chakra.pre
                          className={className}
                          style={style}
                          fontSize="0.5em"
                          padding="3"
                          borderRadius="0.8em"
                          mt={2}
                        >
                          <Button
                            size="xs"
                            onClick={() => {
                              navigator.clipboard.writeText(copyCode as string);
                              if (!toast.isActive("gtid-code-copy")) {
                                toast({
                                  id: "gtid-code-copy",
                                  description: "Code copied to clipboard",
                                  duration: 3000,
                                  position: "top",
                                });
                              }
                            }}
                            mb="3"
                          >
                            Copy
                          </Button>
                          {tokens.map((line, i) => (
                            <Box {...getLineProps({ line, key: i })} margin={0}>
                              {line.map((token, key) => (
                                <chakra.span
                                  {...getTokenProps({ token, key })}
                                  fontSize="12px"
                                  padding={0}
                                />
                              ))}
                            </Box>
                          ))}
                        </chakra.pre>
                      )}
                    </BaseHighlight>
                  </Box>
                  <Box>
                    <Heading size="sm">2. Visit GTID Look-Up Site</Heading>
                    <Text mt="2" fontSize="sm">
                      Visit the site{" "}
                      <Link
                        href="https://webapps.gatech.edu/cfeis/buzzid/buzzid_ind_lookup_par.cfm"
                        target="_blank"
                        color="teal.500"
                      >
                        here
                      </Link>
                      .
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="sm">3. Open Developer Tools</Heading>
                    <Text mt="2" fontSize="sm">
                      Open the developer tools in your browser and paste the code into the console.
                      Then, complete the CAPTCHA and press "Continue" to retrieve the student's
                      GTID.
                    </Text>
                  </Box>
                </Stack>
              </>
            ) : (
              <Text as="i" fontSize="sm">
                Unable to retrieve GTID since either name or date of birth is missing.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RetrieveGTIDModal;
