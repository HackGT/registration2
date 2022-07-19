import React, { useEffect, useState } from 'react'
import { Text, SimpleGrid} from "@chakra-ui/react";
import useAxios from "axios-hooks";
import { DateTime } from 'luxon'

import Loading from "../../util/Loading";
import Tile from "./Tile";
import useCurrentHexathon from '../../hooks/useCurrentHexathon';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationStatus from '../../types/ApplicationStatus';

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
  const { user } = useAuth();
  const [currApp, setCurrApp] = useState<any>({})
  const [currStatus, setCurrStatus] = useState(ApplicationStatus.NotStarted)
  const currentHexathon = useCurrentHexathon();

  const [{ data: branches, loading: branchesLoading, error: branchesError }] = useAxios(
      `https://registration.api.hexlabs.org/branches/?hexathon=${currentHexathon._id}`
  );
  const [{ data: applications, loading: app_loading, error: app_error }] = useAxios(
    `https://registration.api.hexlabs.org/applications/?hexathon=${currentHexathon._id}&userId=${user?.uid}`
  );

  useEffect(() => {
    if (applications && applications.length != 0) {
      setCurrApp(applications[0])
      if (currApp) {
        if (currApp.applied) {
          setCurrStatus(ApplicationStatus.Submitted)
        } else {
          setCurrStatus(ApplicationStatus.InProgress)
        }
      }
    } 
  }, [applications, branches]);

  const chooseBranch = async (appBranchID: any) => {

    try {
      const response = await axios.post(
        `https://registration.api.hexlabs.org/applications/actions/choose-application-branch`,
        {
          hexathon: currentHexathon._id,
          applicationBranch: appBranchID,
        }
      );
      return (`/${currentHexathon._id}/application/${response.data._id}`)
    } catch (error) {
      console.log(error);
    }
    return ("")
  };


  if (branchesLoading || app_loading || branchesError || app_error) {
    return <Loading />;
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
            branch = {branch}
            status={branch._id == currApp?.applicationBranch?._id ? currStatus : ApplicationStatus.NotStarted}
            hasApplication = {Object.keys(currApp).length != 0}
            chooseBranch={chooseBranch}
            currAppLink={branch._id == currApp?.applicationBranch?._id ? `/${currentHexathon._id}/application/${currApp._id}` : ""}
          />
        ))
      )}
      </SimpleGrid>
  )
}

export default Branches