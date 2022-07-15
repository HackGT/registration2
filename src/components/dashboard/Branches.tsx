import React from 'react'
import { Text, SimpleGrid} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { DateTime } from 'luxon'

import Loading from "../../util/Loading";
import Tile from "./Tile";
import useCurrentHexathon from '../../hooks/useCurrentHexathon';

function getDescription(branch: any) {
  const openDate = DateTime.fromISO((new Date(branch.settings.open)).toISOString());
  const closeDate = DateTime.fromISO((new Date(branch.settings.close)).toISOString());
  const currDate = DateTime.fromISO((new Date()).toISOString());

  if (currDate < openDate) {
    return `Application opens on ${openDate.toLocaleString(DateTime.DATETIME_FULL)}`
  } 
  if (currDate > closeDate) {
    return `Applications closed on ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`
  }
  return `Accepting applications until ${closeDate.toLocaleString(DateTime.DATETIME_FULL)}`
}

const Branches: React.FC = () => {

  const currentHexathon = useCurrentHexathon();

  const [{ data: branches, loading: branchesLoading, error: branchesError }] = useAxios(
      `https://registration.api.hexlabs.org/branches/?hexathon=${currentHexathon._id}`
  );

  if (branchesLoading || branchesError) {
      return <Loading />
  }

  return (
      <SimpleGrid columns={branches.length === 0 ? 1 : { base: 1, md: 2 }} spacing={4}>
      {branches.length === 0 ? (
      <Text textAlign="center" fontStyle="italic" paddingX="40px">
          We are currently working hard to finalize the tracks for {currentHexathon.name}!
          Please check back later!
      </Text>
      ) : (
      branches.map((branch: any) => (
          <Tile
          key={branch.name}
          title={branch.name}
          description={getDescription(branch)}
          />
      ))
      )}
      </SimpleGrid>
  )
}

export default Branches