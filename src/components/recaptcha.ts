import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface recaptchaProps {
  children: React.ReactNode;
}

// Correct usage as a component
export const RecaptchaProvider = ({ children }: recaptchaProps) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
    ></GoogleReCaptchaProvider>
  );
};
