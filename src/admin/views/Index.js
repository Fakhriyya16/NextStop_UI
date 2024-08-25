import { useState } from "react";
import Header from "../components/Headers/Header";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  return (
    <>
      <Header />
    </>
  );
};

export default Index;
