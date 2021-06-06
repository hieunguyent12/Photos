import { useContext } from "react";
import { AuthContext } from "../AuthContext";

function SignIn() {
  const { onSignIn } = useContext(AuthContext);

  return <button onClick={onSignIn}>Sign In</button>;
}

export default SignIn;
