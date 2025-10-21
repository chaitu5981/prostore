import { auth } from "@/auth";
import UserButtonClient from "./user-button-client";

const UserButton = async () => {
  const session = await auth();
  return <UserButtonClient sessionUser={session?.user} />;
};
export default UserButton;
