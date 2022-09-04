import React from "react";
import { Text, SimpleGrid } from "@chakra-ui/react";

import Tile from "./Tile";
import { BranchType } from "../admin/branchSettings/BranchSettings";

interface Props {
  application: any;
  branches: any;
}
const Branches: React.FC<Props> = props => {
  let branchesToRender = props.application
    ? props.branches.filter((branch: any) => branch.id !== props.application.applicationBranch?.id)
    : props.branches;

  branchesToRender = props.branches.filter((branch: any) => branch.type === BranchType.APPLICATION);

  return branchesToRender.length === 0 ? (
    <Text textAlign="center" fontStyle="italic">
      We are currently working hard to finalize the paths. Please check back later!
    </Text>
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
      {branchesToRender.map((branch: any) => (
        <Tile branch={branch} currApp={props.application} key={branch.id} />
      ))}
    </SimpleGrid>
  );
};

export default Branches;
