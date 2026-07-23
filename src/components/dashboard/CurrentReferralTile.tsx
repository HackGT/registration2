import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Tag,
  Text,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, handleAxiosError, Service } from "@hex-labs/core";

import { Referral } from "../../util/types";

interface Props {
  referral: Referral;
  onDeleted: () => void | Promise<unknown>;
}

const CurrentReferralTile: React.FC<Props> = ({ referral, onDeleted }) => {
  const { hexathonId } = useParams();
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const cancelRef = React.useRef(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const statusLabel = useMemo(() => {
    if (referral?.status === "SUBMITTED") {
      return "Submitted";
    }
    return "In Progress";
  }, [referral?.status]);

  const statusColor = referral?.status === "SUBMITTED" ? "teal" : "orange";
  const referralName = [referral.referralData?.firstName, referral.referralData?.lastName]
    .filter(Boolean)
    .join(" ");

  const openReferral = () => {
    navigate(`/${hexathonId}/referral/${referral.id}`);
  };

  const deleteReferral = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(apiUrl(Service.REGISTRATION, `/referrals/${referral.id}`));
      await onDeleted();
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setDeleteLoading(false);
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
      height="100%"
    >
      <AlertDialog
        isOpen={deleteModal.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteModal.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Referral
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this referral?
              <Text as="span" fontStyle="italic">
                {" "}
                This action cannot be undone.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteModal.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await deleteReferral();
                  deleteModal.onClose();
                }}
                ml={3}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Spinner size="sm" mr="2" /> : <Text>Delete</Text>}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Flex
        bgGradient="linear(to-l, #33c2ff, #7b69ec)"
        borderTopRadius="4px"
        height="70px"
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Tag size="sm" variant="solid" colorScheme={statusColor} margin="5px">
          {statusLabel}
        </Tag>
      </Flex>
      <Flex padding="20px 32px" direction="column" height="calc(100% - 70px)">
        <Heading fontSize="18px" fontWeight="semibold" marginBottom="4px" color="#212121">
          {referralName || referral.referralData?.email || "Unnamed Referral"}
        </Heading>
        {referralName && referral.referralData?.email && (
          <Text fontSize="sm" color="#555" marginBottom="8px">
            {referral.referralData.email}
          </Text>
        )}
        <Text fontSize="sm" color="#858585" marginBottom="12px">
          {referral.updatedAt
            ? `Last updated ${new Date(referral.updatedAt).toLocaleString()}`
            : "Referral is ready to continue"}
        </Text>
        <Box marginTop="auto">
          <Button onClick={openReferral} variant="outline" width="100%" colorScheme="purple">
            {referral.status === "SUBMITTED" ? "Edit Referral" : "Continue Referral"}
          </Button>
          <Button
            onClick={deleteModal.onOpen}
            variant="link"
            colorScheme="red"
            fontSize="sm"
            width="100%"
            mt={4}
          >
            Delete Referral
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default CurrentReferralTile;
