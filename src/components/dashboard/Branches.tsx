import React from "react";
import { Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Tile from "./Tile";
import { handleAxiosError } from "../../util/util";

interface Props {
  currentApplication: boolean;
  application: any;
  branches: any;
}
const Branches: React.FC<Props> = props => {
  const { hexathonId } = useParams();

  console.log(props.currentApplication);
  console.log(props.application);

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
    } catch (error: any) {
      handleAxiosError(error);
    }
    return "";
  };

  let branchesToRender =
    props.application === undefined && !props.currentApplication ? props.branches : [];
  if (props.application) {
    branchesToRender = props.currentApplication
      ? props.branches.filter((branch: any) => branch.id === props.application.applicationBranch.id)
      : props.branches.filter(
          (branch: any) => branch.id !== props.application.applicationBranch.id
        );
  }

  const emptyBranchesText = props.currentApplication
    ? "You have not started any applications. Select a branch below!"
    : "We are currently working hard to finalize the tracks. Please check back later!";

  return (
    <SimpleGrid columns={props.branches.length === 0 ? 1 : { base: 1, md: 2 }} spacing={4}>
      {branchesToRender.length === 0 ? (
        <Text textAlign="center" fontStyle="italic" paddingX="40px">
          {emptyBranchesText}
        </Text>
      ) : (
        branchesToRender.map((branch: any) => (
          <Tile
            branch={branch}
            currApp={props.application}
            chooseBranch={chooseBranch}
            key={branch._id}
          />
        ))
      )}
    </SimpleGrid>
  );
};

export default Branches;
