import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Heading,
  Tag,
} from "@chakra-ui/react";
import { apiUrl, ErrorScreen, LoadingScreen, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import { DateTime } from "luxon";
import React from "react";
import { useParams } from "react-router-dom";
import ApplicationStatusTag from "../../../util/ApplicationStatusTag";

const PastEmailsScreen: React.FC = () => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    method: "GET",
    url: apiUrl(Service.REGISTRATION, "/email"),
    params: {
      hexathon: hexathonId,
    },
  });

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  console.log(data);

  return (
    <>
      <Heading size="xl" mb="10px">
        Past Emails
      </Heading>
      <TableContainer>
        <Table variant="striped" size="sm">
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
                <Td>{email.subject}</Td>
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
                    <Tag mr="2" bgColor="gray.200">
                      {branch.name}
                    </Tag>
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PastEmailsScreen;
