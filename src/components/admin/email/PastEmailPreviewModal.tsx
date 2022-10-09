import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import { apiUrl, Service, LoadingScreen, ErrorScreen } from "@hex-labs/core";
import useAxios from "axios-hooks";
import React from "react";
import { Letter } from "react-letter";
import { useParams } from "react-router-dom";

import styles from "./email.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedEmailMessage: string;
  setSelectedEmailMessage: React.Dispatch<React.SetStateAction<string>>;
}

const PastEmailPreviewModal: React.FC<Props> = props => {
  const { hexathonId } = useParams();
  const [{ data, loading, error }] = useAxios({
    method: "POST",
    url: apiUrl(Service.NOTIFICATIONS, "/email/render"),
    data: {
      hexathon: hexathonId,
      message: props.selectedEmailMessage,
    },
  });

  const onClose = () => {
    props.setSelectedEmailMessage("");
    props.onClose();
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const ModalTemplate = (modalTemplateProps: any) => (
    <Modal onClose={onClose} size="full" isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent backgroundColor="rgb(246, 248, 249)">
        <ModalCloseButton />
        <ModalBody>{modalTemplateProps.children}</ModalBody>
      </ModalContent>
    </Modal>
  );

  if (loading)
    return (
      <ModalTemplate>
        <LoadingScreen />
      </ModalTemplate>
    );
  if (error)
    return (
      <ModalTemplate>
        <ErrorScreen error={error} />
      </ModalTemplate>
    );

  return (
    <ModalTemplate>
      <Letter html={data?.html} text={data?.text} className={styles["email-screen"]} />
    </ModalTemplate>
  );
};

export default PastEmailPreviewModal;
