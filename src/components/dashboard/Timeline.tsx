import React from "react";
import { Stack, Box } from "@chakra-ui/react";

import Hex from "./hex";

interface Props {
  hexathons: any;
  curHexathon: any;
}

const Timeline: React.FC<Props> = (props: any) => (
  <Stack
    margin="auto"
    direction={{ base: 'column', md: 'row' }}
    width={{ base: "300px", md: "100%" }}
    height={{ base: `${props.hexathons.length * 200 + 120}px`, md: "220px" }}
    spacing="0"
    paddingY={{ base: "30px", md: 0 }}
  >
    {
      props.hexathons.map((hexathon: any) => (
        <React.Fragment key={hexathon.name}>
          <Box
            display="flex"
            flexDirection={{ base: 'row', md: 'column' }}
            maxWidth={{ base: "100%", md: "69.28px" }}
            maxHeight={76}
            paddingTop={{ base: 0, md:"60px" }}
          >
            <Hex
              rotation={90}
              className="hex"
              size={40}
              borderSize={6}
              borderColor={props.hexathon === props.curHexathon ? "#7B69EC" : "#E0E0E0"}
              color={props.hexathon === props.curHexathon ? "#7B69EC" : "white"}
            />
            <Box
              width={{ base: "100%", md: "160%" }}
              margin="auto"
              marginTop={{ md: "15px" }}
              marginLeft={{ base: "50px", md: "-30%" }}
              marginRight={{ base: "0", md: "-30%" }}
              textAlign="center"
              color={props.hexathon === props.curHexathon ? "#7B69EC" : "#E0E0E0"}
              fontSize="20px"
              fontWeight={500}
            >
              {hexathon.name}
            </Box>
          </Box>
          <Box
            width="100%"
            height="100%"
            paddingTop={{ base: 0, md: "97px" }}
            paddingLeft={{ base: "31.641", md: 0 }}
          >
            <Box
              width={{base: "6px", md: "100%"}}
              height={{base: "100%", md: "6px"}}
              bg={props.hexathon === props.curHexathon ? "" : "#E0E0E0"}
              bgGradient={props.hexathon === props.curHexathon ? { base: "linear(to-b, #7B69EC 50%, #E0E0E0 50%)", md: "linear(to-r, #7B69EC 50%, #E0E0E0 50%)" } : ""}
              verticalAlign="center"
            />
          </Box>
        </React.Fragment>
      ))
    }
    <Box
      display="flex"
      flexDirection={{ base: 'row', md: 'column' }}
      maxWidth={{ base: "100%", md: "69.28px" }}
      maxHeight={76}
      paddingTop={{ base: 0, md:"60px" }}
      marginX={(Object.keys(props.curHexathon).length === 0) ? "auto" : "0px"}
    >
      <Hex
        rotation={90}
        size={40}
        borderSize={6}
        borderColor="#E0E0E0"
        color="white"
      />
      <Box
        width={{ base: "100%", md: "200%" }}
        margin="auto"
        marginTop={{ md: "15px" }}
        marginLeft={{ base: "50px", md: "-50%" }}
        marginRight={{ base: "0", md: "-50%" }}
        textAlign="center"
        color="#E0E0E0"
        fontSize="20px"
        fontWeight={500}
      >
        Coming soon...
      </Box>
    </Box>
  </Stack>
)

export default Timeline;