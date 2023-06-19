import { TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";

import CHeader from "@/layouts/CHeader";
import CLive from "@/pages/CLive";

const App: React.FC = () => {
  return (
    <Tabs
      isLazy
      variant="soft-rounded"
      colorScheme="green"
      display="flex"
      size="sm"
      h="100vh"
      w="100vw"
      flexDirection="column"
      bg="gray.800"
      overflow="hidden"
    >
      <CHeader />
      <TabPanels flex="1" display="flex" flexDirection="column">
        <CLive />
      </TabPanels>
    </Tabs>
  );
};

export default App;
