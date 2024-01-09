//data fetching   (axios, fetch)
//axios (라이브러리) : 데이터입출력요청에 대한 전용메서드, 비동데이터 반환에러의 상태값을 실시간 체크해서 catch로 잡을 수 있음
//fetch (js내장함수) : 데이터입출력요청에 대한 전용메서드 없음, network상의 문제가 있을때만 catch로 에러를 잡아주기 때문에
//비동기데이터 반환실패에 대한 상태값을 수동으로 직접 연결

import { useState, useEffect } from 'react';
import axios from 'axios';

//promise객체를 인수로 받아서 해당 promise상태에 따라 반환되는 값을 직접 리턴해주는 함수를 반환
const checkPromiseStatus = (promise) => {
  let status = 'pending';
  let result;

  //promise의 상태에 따라 현재 상태값과 반환값을 각각 status, result변수에 담아줌
  const setPromise = promise.then(
    (value) => {
      status = 'fulfilled';
      result = value;
    },
    (error) => {
      status = 'rejected';
      result = error;
    }
  );

  //위에서 저장되는 status값에 따라 fetching된 결과값을 반환하는 함수를 리턴
  return () => {
    switch (status) {
      case 'pending':
        throw setPromise;
      case 'fulfilled':
        return result;
      case 'rejected':
        throw result;
      default:
        throw new Error('Unknown Staus');
    }
  };
};

function useGetData(url) {
  const [Data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      //데이터 요청후 현재 데이터 상태를 확인하는 promise객체 자체를 비동기적으로 받음
      const promise = axios.get(url).then((response) => response.data);

      //해당 promise객체를 checkPromiseState함수의 인수로 전달해서 직접 동기화시키는 커스텀함수 호출후 반환된 결과값을 state에 담아줌
      setData(checkPromiseStatus(promise));
    };

    getData();
  }, [url]);

  //state에 담아진 promise반환값을 리턴
  return Data;
}

export default useGetData;
