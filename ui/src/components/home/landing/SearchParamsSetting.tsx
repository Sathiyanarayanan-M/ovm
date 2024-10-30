import { useSearchParams } from "next/navigation";
import React from "react";

const SearchParamsSetting = ({
  setRoomId,
}: {
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const queryRoom = searchParams.get("room");
    console.log("queryRoom", queryRoom);
    if (queryRoom) setRoomId(queryRoom);
  }, []);
  return <></>;
};

export default SearchParamsSetting;
