// pages/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    // Function to extract the token from the URL
    const extractToken = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#' at the beginning
      const idToken = params.get("id_token");

      if (idToken) {
        // Store the token in session storage
        sessionStorage.setItem("sui_jwt_token", idToken);
        // Optionally, redirect to another page after storing the token
        router.push("/"); // Redirect to the home page or any other page
      } else {
        console.error("ID token not found in URL");
      }
    };

    extractToken();
  }, [router]);

  return (
    <div className="h-[80vh] w-full text-center justify-center items-center font-bold text-3xl">
      <h1>Callback</h1>
      <p>Processing authentication...</p>
    </div>
  );
};

export default Callback;
