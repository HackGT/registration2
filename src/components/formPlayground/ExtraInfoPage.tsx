import React, { useState } from "react";
import { Box, Button, ButtonGroup, Checkbox, Flex, Text, Stack, Divider, Textarea } from "@chakra-ui/react";
import Form from "@rjsf/chakra-ui";

import defaultExtraInfoSchema from "./ExtraInfo_Schemas/defaultFormSchema.json"
import defaultExtraInfoUISchema from "./ExtraInfo_Schemas/defaultFormUISchema.json"
import ExtraInfoTemplate from "./ExtraInfoTemplate";
import SelectFieldTemplate from "./SelectFieldTemplate";

interface props {
  setFormPage: (value: number | ((prevVar: number) => number)) => void;
  extraInfoData: string;
  setExtraInfoData: React.Dispatch<React.SetStateAction<string>>;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExtraInfoPage = ({ setFormPage, extraInfoData, setExtraInfoData, setSubmit }: props) => {
  const rules = ["I have read and agree to the MLH Code of Conduct",
    "I agree to the HackGT Liability Waiver",
    "I agree to the HackGT Photo Release Waiver",
    "I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the MLH Privacy Policy. I further agree to the terms of both the MLH Contest Terms and Conditions and the MLH Privacy Policy.",
    "I authorize MLH to send me pre- and post-event informational emails, which contain free credit and opportunities from their partners",
    "I agree to the HexLabs Privacy Policy"]

  const ruleChecks = rules.map(rule => <Checkbox><Text fontSize="20px">{rule}</Text></Checkbox>)

  return (
    <Flex align="center" justify="center" direction="column">
      <Flex
        padding="15px"
        verticalAlign="top"
        width={{ base: "100%", md: "45%" }}
        height="100%"
        display="inline-block"
        align="center"
        justify="center"
        direction="column"
      >
        <Box fontSize="36px" marginY="5px" >
          <b>Welcome Noah Longhi!</b>
        </Box>
        <Divider />
        <Box fontSize="20px" marginY="15px">
          Enter quick note/disclaimer here, like ayo you gotta be a student at GT or u can turn your goofy flat ass around and attend your own hackathons preciate it, we boutta check em buzzcards during check in so you better watch it buddy or else
        </Box>
        <br/>
        <Box fontSize="25px" marginY="15px">
          <b>Please Confirm the Following</b>
        </Box>
        <Stack marginLeft="25px" spacing={5} direction='column'>
          {ruleChecks}
        </Stack>
        <br/>
        <Box fontSize="25px" marginY="15px">
          <b>Anything else you'd like us to know?</b>
        </Box>
        <Textarea
          value={extraInfoData}
          onChange={(e: any) =>
            setExtraInfoData(e.target.value)
          }
          placeholder='Extra Information here'
          size='sm'
          marginY="5px"
        />
        {/* <Form
          schema={JSON.parse(confirmationSchema)}
          uiSchema={JSON.parse(confirmationUISchema)}
          formData={JSON.parse(extraInfoData)}
          onChange={(val: any, event: any) => {
            setExtraInfoData(JSON.stringify(val.formData, null, 2));
            // console.log(formData)
          }}
          ObjectFieldTemplate={ExtraInfoTemplate}
          fields={{ select: SelectFieldTemplate }}

        > */}
        <ButtonGroup
          width="100%"
          spacing='6'
        >
          <Button width="100%" colorScheme='purple' type="submit" onClick={() => setFormPage(2)}>Previous</Button>
          <Button width="100%" colorScheme='purple' type="submit" onClick={() => setSubmit(true)}>SUBMIT</Button>
        </ButtonGroup>
        {/* </Form> */}
      </Flex>
    </Flex>
  );
};


export default ExtraInfoPage;
