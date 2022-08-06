import React, { useEffect } from "react";

function App() {
  const getData = async () => {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=fairy&limit=20`);
    const resData = await res.json();
    console.log(resData);
  };

  useEffect(() => {
    getData();
  }, []);

  return <></>;
}

export default App;
