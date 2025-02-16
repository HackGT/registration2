import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import {
    Button,
    Input,
    Heading,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter
  } from "@chakra-ui/react";

const generateCSV = async (
    hexathonId: any,
    status: any,
    applicationBranch: any,
    confirmationBranch: any,
    rowLimit: any
  ) => {
    await axios
      .get(apiUrl(Service.REGISTRATION, `applications/generate-csv`), {
        params: { hexathon: hexathonId, status, applicationBranch, confirmationBranch, limit: rowLimit },
        responseType: "blob",
      })
      .then(response => {
        const href = URL.createObjectURL(response.data);
  
        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "Applications.csv");
        document.body.appendChild(link);
        link.click();
  
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
};

interface ApplicationCSVModalProps {
    isOpen: any;
    onOpen: any;
    onClose: any;
    hexathonId: any;
    status: any;
    applicationBranch: any;
    confirmationBranch: any;
    totalApplicants: any;
};

const ApplicationCSVModal: React.FC<ApplicationCSVModalProps> = ({isOpen, onOpen, onClose, hexathonId, status, applicationBranch, confirmationBranch, totalApplicants}) => {
    const [ rowLimit, setRowLimit ] = useState(totalApplicants);

    useEffect(() => {
        setRowLimit(totalApplicants);
    }, [totalApplicants]);

    return(
        <Modal size="md" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading>Set CSV Row Limit</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>
                        Type in number of applicants to be exported to CSV (default value is all applicants):
                    </Text>
                    <Input onChange={(e: any)=> setRowLimit(e.target.value)} value={rowLimit}/>
                    <br />
                </ModalBody>
                <ModalFooter>
                <Button
                    onClick={(e: any) =>
                        generateCSV(
                        hexathonId,
                        status,
                        applicationBranch,
                        confirmationBranch,
                        rowLimit
                        )
                    }
                    >
                    Generate CSV
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ApplicationCSVModal;