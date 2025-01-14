import React, { useEffect, useState } from "react";

const formatPhoneNumber = (phoneNumber) => {
  const match = phoneNumber.match(/(\d{3})(\d{3})(\d{4})\s(\d+)/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]} Ext. ${match[4]}`;
  }
  return phoneNumber;
};

const getAccessToken = async () => {
  const tokenURL = "/api/token";

  const postFields = new URLSearchParams({
    grant_type: "password",
    username: process.env.NEXT_PUBLIC_UNIWEB_CLIENT_NAME,
    password: process.env.NEXT_PUBLIC_UNIWEB_CLIENT_SECRET,
  });

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

const useUniWebProfile = (id) => {
  const [result, setResult] = useState({ loading: true });
  const resourceReq = `resources[]=profile/biography&resources[]=profile/membership_information&resources[]=profile/research_description&resources[]=profile/research_interests`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = await getAccessToken();

        const response = await fetch(`/api/resource?action=read&${resourceReq}&id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setResult({ data });
      } catch (error) {
        console.error("Error fetching data:", error);
        setResult({ error: error.message });
      }
    };

    fetchData();
  }, [id]);

  return result;
};

const UniWebProfileRaw = ({ id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = await getAccessToken();

        const response = await fetch(`/api/resource?action=read&resources[]=profile/research_interests&resources[]=profile/membership_information&id=${id}`,
          {
            headers: {
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
  }, [id]);

  return (
    <div>{error ? <p>Error: {error}</p> : data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}</div>
  );
};

const UniWebUnitMembers = ({ unitName }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = await getAccessToken();

        const response = await fetch(
          `/api/resource?action=getMembers&unitName=${unitName}`,
          {
            headers: {
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
  }, [unitName]);

  return (
    <div>{error ? <p>Error: {error}</p> : data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}</div>
  );
};

export {
  formatPhoneNumber,
  getAccessToken,
  useUniWebProfile,
  UniWebProfileRaw,
  UniWebUnitMembers,
};
