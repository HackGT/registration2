import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ApplicationStatusTag from "../../../util/ApplicationStatusTag";
import PastEmailPreviewModal from "./PastEmailPreviewModal";

const PastEmailsTab: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/email"),
    params: {
      hexathon: hexathonId,
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmailMessage, setSelectedEmailMessage] = useState("");

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const openEmailPreviewModal = (message: string) => {
    setSelectedEmailMessage(message);
    onOpen();
  };

  return (
    <>
      <Heading size="xl" mb="10px">
        Past Emails
      </Heading>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Subject</Th>
              <Th>Application Status</Th>
              <Th># of Recipients</Th>
              <Th>Time</Th>
              <Th>Sender</Th>
              <Th>Recipient Branches</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((email: any) => (
              <Tr>
                <Td
                  onClick={() => openEmailPreviewModal(email.message)}
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  {email.subject}
                </Td>
                <Td>
                  {email.filter.statusList.map((status: any) => (
                    <ApplicationStatusTag status={status} includeColor />
                  ))}
                </Td>
                <Td>{email.recipients.length}</Td>
                <Td>
                  {DateTime.fromISO(new Date(email.timestamp).toISOString()).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Td>
                <Td>{`${email.sender.name.first} ${email.sender.name.last}`}</Td>
                <Td>
                  {email.filter.branchList.map((branch: any) => (
                    <Tag mr="2">{branch.name}</Tag>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <PastEmailPreviewModal
        isOpen={isOpen}
        onClose={onClose}
        selectedEmailMessage={selectedEmailMessage}
        setSelectedEmailMessage={setSelectedEmailMessage}
      />
    </>
  );
};

export default PastEmailsTab;
