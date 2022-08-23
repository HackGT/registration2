import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Heading } from "@chakra-ui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  heading: string;
  data: Record<string, number>;
}

const PieGraphView: React.FC<IProps> = props => {
  const data = {
    labels: Object.keys(props.data),
    datasets: [
      {
        data: Object.values(props.data),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#db3d44", "#4257b2", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#db3d44", "#4257b2", "#36A2EB"],
      },
    ],
  };

  return (
    <div className="col-12 col-sm-6">
      <Box style={{ width: "300px", maxWidth: "300px", display: "inline-block" }}>
        <Heading style={{ textAlign: "center", fontSize: "25px" }}>{props.heading}</Heading>
        <Pie style={{ width: "300px" }} data={data} />
      </Box>
    </div>
  );
};

export default PieGraphView;
