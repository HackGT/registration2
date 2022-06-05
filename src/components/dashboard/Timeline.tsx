import React from "react";
import { Stack, Box } from "@chakra-ui/react";

import Hex from "./hex";

const Timeline: React.FC<{events: string[]}> = (props: any) => (
  <Stack
    margin="auto"
    direction={{ base: 'column', md: 'row' }}
    width={{ base: "300px", md: "100%" }}
    height={{ base: props.events.length * 200, md: "200px" }}
    spacing="0"
    paddingY={{ base: "30px", md: 0 }}
  >
    {
      props.events.map((event: string, index: number) => (
        <React.Fragment key={event}>
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
              borderColor={index === 0 ? "#7B69EC" : "#E0E0E0"}
              color={index === 0 ? "#7B69EC" : "white"}
            />
            <Box
              width={{ base: "100%", md: "160%" }}
              margin="auto"
              marginTop={{ md: "15px" }}
              marginLeft={{ base: "50px", md: "-30%" }}
              marginRight={{ base: "0", md: "-30%" }}
              textAlign="center"
              color={index === 0 ? "#7B69EC" : "#E0E0E0"}
              fontSize="20px"
              fontWeight={500}
            >
              {event}
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
              bg={index === 0 ? "" : "#E0E0E0"}
              bgGradient={index === 0 ? { base: "linear(to-b, #7B69EC 50%, #E0E0E0 50%)", md: "linear(to-r, #7B69EC 50%, #E0E0E0 50%)" } : ""}
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
    >
      <Hex
        rotation={90}
        size={40}
        borderSize={6}
        borderColor="#E0E0E0"
        color="white"
      />
      <Box
        width={{ base: "100%", md: "160%" }}
        margin="auto"
        marginTop={{ md: "15px" }}
        marginLeft={{ base: "50px", md: "-30%" }}
        marginRight={{ base: "0", md: "-30%" }}
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