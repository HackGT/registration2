import React, { useEffect, useMemo, useState } from "react";
import { apiUrl, ErrorScreen, SearchableTable, Service } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";
import {
    Button,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
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
        params: { hexathon: hexathonId, status, applicationBranch, confirmationBranch },
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

const ApplicationCSVModal: React.FC = (props: any) => {
    const { isOpen, onOpen, onClose, hexathonId, status, applicationBranch, confirmationBranch, totalApplicants } = props;
    const [ rowLimit, setRowLimit ] = useState(200);
    return(
        <>
        
            <Modal isOpen={isOpen} onClose={onClose}>
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
            </Modal>
        </>
    );
};

export default ApplicationCSVModal;