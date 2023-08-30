import React, { useState } from "react";
import Navbar from "./Navbar";
import Body from "./Body";
function App() {
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <Navbar setIsDisabled={setIsDisabled} />
      <Body isDisabled={isDisabled} />
    </>
  );
}

export default App;
