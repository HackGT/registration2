import React from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { Box } from "@chakra-ui/react";

enum DatumColor {
  DATE = "hsl(233, 100%, 62%)",
  TYPE = "hsl(324, 100%, 62%)",
  EVENT = "hsl(153, 100%, 62%)",
}

const getTreeData = (data: any) => {
  const children: any = [];
  const treeData = {
    name: "",
    color: "hsl(360, 100%, 100%)",
    children,
  };

  Object.keys(data).forEach((date: string) => {
    const dateChildren: any = [];
    children.push({
      name: date,
      color: DatumColor.DATE,
      children: dateChildren,
    });

    Object.keys(data[date]).forEach((type: string) => {
      const typeChildren: any = [];
      dateChildren.push({
        name: type,
        color: DatumColor.TYPE,
        children: typeChildren,
      });

      Object.keys(data[date][type]).forEach((event: string) => {
        typeChildren.push({
          name: event,
          color: DatumColor.EVENT,
          loc: data[date][type][event],
        });
      });
    });
  });

  return treeData;
};

const TreeMapView: React.FC<any> = props => (
  <Box height="80vh" width="95vw">
    <ResponsiveTreeMap
      data={getTreeData(props.data)}
      identity="name"
      value="loc"
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.2]],
      }}
      parentLabelTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.1]],
      }}
    />
  </Box>
);

export default TreeMapView;
