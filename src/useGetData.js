import { useState, useEffect } from 'react';

const checkPromiseStatus = (response) => {
  let status = 'pending';
  let result;

  console.log({ status, result });

  if (response.ok) {
    status = 'fulfilled';
    result = response;
  } else {
    status = 'rejected';
    result = 'error';
  }

  return { status, result };
};

function useGetData(url) {
  const [Data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = await fetch(url);
      const promiseStatus = checkPromiseStatus(promise);
      console.log(promiseStatus);
      const data = await promise.json();
      setData(data);
    };

    getData();
  }, [url]);

  return Data;
}

export default useGetData;
