import React from "react";

const Backdrop = ({ children }: React.PropsWithChildren) => {
  return (
    <div className=" backdrop-blur-3xl bg-black/30 top-0 left-0 absolute h-full w-full z-10 all-center flex-col p-6">
      {children}
    </div>
  );
};

export default Backdrop;
