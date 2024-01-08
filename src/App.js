import { useState } from 'react';
import './global.scss';

function App() {
  const [Count, setCount] = useState(0);
  const [Items, setItems] = useState([]);

  const handleClick = () => {
    setCount(Count + 1);

    const arr = Array(20000)
      .fill(1)
      .map((_, idx) => Count + idx);

    setItems(arr);
  };

  return (
    <div className="App">
      <button onClick={handleClick}>{Count}</button>
      <ul>
        {Items.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

/*
  useTransition
  : 컴포넌트 렌더링시 연산의 우선순위를 둬서 좀 늦게 렌더링해도 될 것들을 선별지정
  : 기존(17)에는 한번 렌더링 연산이 시작되면 중간에 멈추는게 불가능
  : 특정 핸들러함수에 의해서 화면을 재연산해야 되는 경우 중간에 무거운 로직이 실행되는 연산이 있다면 굳이 무서운 연산이 필요없는 컴포넌트까지 같이 지연이 일어나서 전반적인 로딩속도에 악영향 
*/
