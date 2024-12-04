import React, { useEffect, useState } from "react";

const getAccessToken = async () => {
  const tokenURL = "/api/token";

  const postFields = new URLSearchParams({
    grant_type: "password",
    username: process.env.NEXT_PUBLIC_UNIWEB_CLIENT_NAME,
    password: process.env.NEXT_PUBLIC_UNIWEB_CLIENT_SECRET,
  });

  console.log("Post Fields:", postFields.toString()); // Log the payload

  try {
    const response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postFields.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(`Error: ${result.error}`);
    }

    const expiry = Date.now() + result.expires_in * 1000;

    return {
      token: result.access_token,
      expiration: expiry,
    };
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const UniWebProfile = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = await getAccessToken();

        const response = await fetch(
          "/api/resource?action=read&resources[]=profile/affiliations&resources[]=profile/membership_information&id=353",
          {
            headers: {
              "Client-Name": process.env.NEXT_PUBLIC_UNIWEB_CLIENT_NAME,
              "Client-Secret": process.env.NEXT_PUBLIC_UNIWEB_CLIENT_SECRET,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>{error ? <p>Error: {error}</p> : data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}</div>
  );
};

export default UniWebProfile;
