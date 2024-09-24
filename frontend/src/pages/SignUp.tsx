import Auth from "../components/Auth";
import { Quotes } from "../components/Quotes";

export const SignUp = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <Auth type="signup" />
      <div className="none md:visible">
        <Quotes />
      </div>
    </div>
  );
};
