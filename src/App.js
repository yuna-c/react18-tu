import News from './components/news/News';
import Pics from './components/pics/Pics';
import Visual from './components/visual/Visual';
import './global.scss';
import { useState } from 'react';
import { flushSync } from 'react-dom';

function App() {
  console.log('re-render');
  const [Count1, setCount1] = useState(1);
  const [Count2, setCount2] = useState(2);
  const [Count3, setCount3] = useState(3);

  const returnPromise = () => {
    return new Promise((res) => setTimeout(res, 500));
  };

  const changeState = () => {
    returnPromise().then(() => {
      //특정 State값을 Auto Batching에서 제외처리
      flushSync(() => {
        setCount1(Count1 + 1);
      });
      flushSync(() => {
        setCount2(Count2 + 1);
      });
      setCount3(Count3 + 1);
    });
  };
  return (
    <div className="App">
      <button onClick={changeState}>변경</button>
      <h1>
        {Count1}-{Count2}-{Count3}
      </h1>
      <Visual />
      <News />
      <Pics />
    </div>
  );
}

export default App;
/*
  Automatic Batching
  :여러개의 state가 하나의 핸들러함수 안쪽에서 동시에 변경이 될때 그룹으로 묶어서 한번만 렌더링 처리
  :17에도 Batching기능이 동작되긴 하나 Promise를 반환하는 핸들러안쪽에 여러개의 state가 변경될 경우에는 동작안됨
*/
