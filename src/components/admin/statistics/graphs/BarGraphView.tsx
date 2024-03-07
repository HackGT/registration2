import { Bar } from "react-chartjs-2";
import React from "react";
import { Chart, registerables } from "chart.js";
import { Box, Heading } from "@chakra-ui/react";

Chart.register(...registerables);

interface IProps {
    heading: string;
    data: Record<string, number>;
}

const BarGraphView: React.FC<IProps> = props => (
  <Box style={{ height: "230px", width: "300px", marginTop: "20px"}}>
    <Heading style={{ textAlign: "center", fontSize: "25px" }}>School Year</Heading>
      <Bar
        data={{
          labels: Object.keys(props.data),
          datasets: [
            {
              label: "Number of applicants",
              data: Object.values(props.data),
              
              borderWidth: 0.5,
            },
          ],
        }}
      />
  </Box>
);

export default BarGraphView;
