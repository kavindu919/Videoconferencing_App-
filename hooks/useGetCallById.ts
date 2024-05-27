import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  //loader
  const [isCallLoading, setIsCallLoading] = useState(true);
  //get the client
  const client = useStreamVideoClient();
  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      //destcuture the calls
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });
      if (calls.length > 0) setCall(calls[0]);
      setIsCallLoading(false);
    };
    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
