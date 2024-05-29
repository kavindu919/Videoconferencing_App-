"use client";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);
  const call = useCall();
  //   if (!call) {
  //     throw new Error("Use call must be used with in streamcall component");
  //   }
  useEffect(() => {
    if (isMicCamToggled) {
      //disable cam and microphone
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      //enable the cam and microphone
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggled, call?.camera, call?.microphone]);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      {/* video conferencing  */}
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex justify-center gap-2 font-medium">
          {/* make icheak box for the cheak mic cam is opean  */}
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
