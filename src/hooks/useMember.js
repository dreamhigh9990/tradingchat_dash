import { useAuth } from "@/context/authContext";

const useMember = () => {
  const { currentUser } = useAuth();
  const curSecondsTime = (new Date()).getTime() / 1000;
  const isMember = (currentUser && currentUser.uid && currentUser.period_end && curSecondsTime < currentUser.period_end) ? true : false;

  return [isMember];
};

export default useMember;
