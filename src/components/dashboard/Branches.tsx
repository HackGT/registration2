/* eslint-disable no-underscore-dangle */
import React from "react";
import { Text, SimpleGrid } from "@chakra-ui/react";
import { ErrorScreen, Loading } from "@hex-labs/core";
import useAxios from "axios-hooks";
import axios from "axios";
import { useParams } from "react-router-dom";

import Tile from "./Tile";
import { useAuth } from "../../contexts/AuthContext";

const Branches: React.FC = () => {
  const { user } = useAuth();
  const { hexathonId } = useParams();

  const [{ data: branches, loading: branchesLoading, error: branchesError }] = useAxios(
    `https://registration.api.hexlabs.org/branches/?hexathon=${hexathonId}`
  );
  const [{ data: applications, loading: applicationsLoading, error: applicationsError }] = useAxios(
    `https://registration.api.hexlabs.org/applications/?hexathon=${hexathonId}&userId=${user?.uid}`
  );

  const chooseBranch = async (appBranchID: any) => {
    try {
      const response = await axios.post(
        `https://registration.api.hexlabs.org/applications/actions/choose-application-branch`,
        {
          hexathon: hexathonId,
          applicationBranch: appBranchID,
        }
      );
      return `/${hexathonId}/application/${response.data._id}`;
    } catch (error) {
      console.log(error);
    }
    return "";
  };

  if (branchesLoading || applicationsLoading) {
    return <Loading />;
  }

  if (branchesError) return <ErrorScreen error={branchesError} />;
  if (applicationsError) return <ErrorScreen error={applicationsError} />;

  const currApp = applications?.length > 0 ? applications[0] : undefined;

  return (
    <SimpleGrid columns={branches.length === 0 ? 1 : { base: 1, md: 2 }} spacing={4}>
      {branches.length === 0 ? (
        <Text textAlign="center" fontStyle="italic" paddingX="40px">
          We are currently working hard to finalize the tracks. Please check back later!
        </Text>
      ) : (
        branches.map((branch: any) => (
          <Tile branch={branch} currApp={currApp} chooseBranch={chooseBranch} key={branch._id} />
        ))
      )}
    </SimpleGrid>
  );
};

export default Branches;
