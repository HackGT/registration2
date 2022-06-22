/* eslint-disable no-underscore-dangle */
import React from "react";
import { Accordion, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

import AccordionSection from "./AccordionSection";
import Loading from "../../util/Loading";

const InternalSettings: React.FC = () => {
  const { hexathonId } = useParams();

  const [{ data: applications, loading, error }] = useAxios(
    `https://registration.api.hexlabs.org/applications/`
  );

  if (loading) return <Loading />;
  if (error) console.log(error.message);
  return (
    <Stack>
      <Accordion>
        {applications
          .filter((application: any) => application.hexathon === hexathonId)
          .map(
            (application: any) =>
              (application.applicationBranch && (
                <AccordionSection
                  {...application.applicationBranch}
                  id={application.applicationBranch._id}
                />
              )) ||
              (application.confirmationBranch && (
                <AccordionSection
                  {...application.confirmationBranch}
                  id={application.confirmationBranch._id}
                />
              ))
          )}
      </Accordion>
    </Stack>
  );
};

export default InternalSettings;
