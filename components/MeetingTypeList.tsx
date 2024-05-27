"use client";
import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";

const MeetingTypeList = () => {
  const router = useRouter();
  //make a use state
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  //get user
  const { user } = useUser();
  //initalized stream video client
  const client = useStreamVideoClient();
  //make use state for get the meeting time
  const [values, setValues] = useState({
    dateTime: new Date(),
    discription: "",
    link: "",
  });
  //make use state for the call details
  const [callDetails, setCallDetails] = useState<Call>();

  const { toast } = useToast();
  //function for create meeting
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select date and time",
        });
        return;
      }
      //random genarate id
      const id = crypto.randomUUID();
      //make call
      const call = client.call("default", id);
      //get meeting start time, hee ISOString make this date as string
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      //get meeting description
      const description = values.discription || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      if (!call) throw new Error("Faild to create call");

      setCallDetails(call);
      if (!values.discription) {
        router.push(`/meeting/${call.id}`);
        toast({
          title: "Meeting Created",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Falild to create meeting",
      });
    }
  };

  return (
    <section className=" grid grid-cols-1 gap-5 md:grid-col-2 xl:grid-cols-4 ">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push("/recordings")}
      />
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
