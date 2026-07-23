import React, { useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import {
  apiUrl,
  ErrorScreen,
  handleAxiosError,
  LoadingScreen,
  Service,
} from "@hex-labs/core";
import axios from "axios";
import useAxios from "axios-hooks";
import { useNavigate, useParams } from "react-router-dom";

import ReferralStatusTag from "../../../util/ReferralStatusTag";

interface ReferralData {
  firstName?: string;
  lastName?: string;
  email?: string;
  school?: string;
  resume?: {
    name?: string;
  };
  referForEarlyApplication?: boolean;
  referForReimbursement?: boolean;
  essay?: string;
}

interface Referral {
  id: string;
  status: string;
  referrerId?: string;
  referrerName?: string;
  referrerEmail?: string;
  hexathon?: string;
  referralData?: ReferralData;
}

interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value }) => (
  <Box>
    <Text color="gray" fontSize="sm">
      {label}
    </Text>
    <Text>{value ?? "Not provided"}</Text>
  </Box>
);

const ReferralDetailPage: React.FC = () => {
  const { referralId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [{ data, loading, error }] = useAxios<Referral>(
    apiUrl(Service.REGISTRATION, `/referrals/${referralId}`)
  );

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const referralData = data?.referralData;
  const name = [referralData?.firstName, referralData?.lastName].filter(Boolean).join(" ");

  const handleDeleteReferral = async () => {
    if (
      !data ||
      !window.confirm(
        `Are you sure you want to delete ${name || "this referral"}${
          referralData?.email ? ` (${referralData.email})` : ""
        }?`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(apiUrl(Service.REGISTRATION, `/referrals/${data.id}`));
      toast({
        title: "Success",
        description: "Referral deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate(`/${data.hexathon}/admin/referrals`);
        window.location.reload();
      }, 1000);
    } catch (deleteError: any) {
      handleAxiosError(deleteError);
      setIsDeleting(false);
    }
  };

  return (
    <Box paddingX={{ base: "10px", sm: "30px" }} paddingTop="20px">
      <Stack spacing="1px" paddingBottom="10px">
        <Stack flexDirection={{ base: "column", sm: "row" }} gap="1.5">
          <ReferralStatusTag status={data?.status ?? ""} includeColor alignSelf="start" />
          <Tag alignSelf="start" margin="0 !important">
            <TagLabel>{`ID: ${data?.id ?? referralId}`}</TagLabel>
            <TagRightIcon
              as={CopyIcon}
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(data?.id ?? referralId ?? "");
                if (!toast.isActive("referral-id-copy")) {
                  toast({
                    id: "referral-id-copy",
                    description: "Referral ID copied to clipboard",
                    duration: 3000,
                    position: "top",
                  });
                }
              }}
              _hover={{ color: "purple" }}
            />
          </Tag>
        </Stack>
        <Stack justifyContent="space-between" flexDirection={{ base: "column", md: "row" }}>
          <Heading as="h1" size="xl" fontWeight={700}>
            {name || "Referral"}
          </Heading>
          <Button
            colorScheme="red"
            size="sm"
            alignSelf="start"
            onClick={handleDeleteReferral}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Accordion defaultIndex={[0, 1, 2, 3]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Referrer Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <DetailField label="Name" value={data?.referrerName} />
              <DetailField label="Email" value={data?.referrerEmail} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Personal Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <DetailField label="First Name" value={referralData?.firstName} />
              <DetailField label="Last Name" value={referralData?.lastName} />
              <DetailField label="Email" value={referralData?.email} />
              <DetailField label="University" value={referralData?.school} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Referral Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <DetailField
                label="Refer For Early Application"
                value={referralData?.referForEarlyApplication ? "Yes" : "No"}
              />
              <DetailField
                label="Refer For Travel Reimbursement"
                value={referralData?.referForReimbursement ? "Yes" : "No"}
              />
              <DetailField label="Resume" value={referralData?.resume?.name} />
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Candidate Recommendation</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <DetailField
              label="Why Would They Make a Good Candidate?"
              value={referralData?.essay}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default ReferralDetailPage;
