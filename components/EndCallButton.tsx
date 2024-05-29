"use client";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
  //get the call  information
  const call = useCall();
  const router = useRouter();
  //get access to the local partisipant of the meeting
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  //cheking the id of meeing owner is same as the current participant id
  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;
  return (
    <Button
      onClick={async () => {
        await call.endCall();
        router.push("/");
      }}
      className="bg-red-500"
    >
      End Meeting For All{" "}
    </Button>
  );
};

export default EndCallButton;
