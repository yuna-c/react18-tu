import { useState, useEffect } from 'react';

const checkPromiseStatus = (response) => {
  console.log(response);
  let status = 'pending';
  let result;
  console.log({ status, result });

  if (response.ok) {
    status = 'fulfilled';
    result = response;
    console.log({ status, result });
  } else {
    status = 'rejected';
    result = 'error';
    console.log({ status, result });
  }

  if (status === 'penidng') throw new Error('Still Loading');
  if (status === 'fulfilled') {
    return result.json();
  }
  if (status === 'rejected') throw result;
};

function useGetData(url) {
  const [Data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = await fetch(url);
      console.log(
        checkPromiseStatus(promise).then((json) => {
          console.log(json);
          setData(json);
        })
      );

      //const promiseStatus = checkPromiseStatus(promise);
      //console.log(promiseStatus);
    };

    getData();
  }, [url]);

  return Data;
}

export default useGetData;
