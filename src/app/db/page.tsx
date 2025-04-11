"use client";

import { useEffect, useState } from "react";

export default function DbPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db");
        if (!response.ok) {
          setError("Failed to fetch data");
          return;
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return <div>test , {JSON.stringify(data)}</div>;
}

