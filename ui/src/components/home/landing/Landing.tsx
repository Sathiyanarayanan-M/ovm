import React from "react";
import AvatarSelection from "./AvatarSelection";
import JoinRoom from "./JoinRoom";
import Footer from "./Footer";

const Landing = () => {
  return (
    <div className="">
      <div className="grid grid-cols-2 place-content-center px-10 py-16 all-center md:grid-cols-1 md:gap-10">
        <AvatarSelection />
        <div className="md:order-1">
          <h1 className="all-center mb-10 font-fruk text-pr-text text-7xl">
            OVM
          </h1>
          <JoinRoom />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
