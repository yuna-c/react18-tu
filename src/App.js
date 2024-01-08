import { useState, useTransition } from 'react';
import './global.scss';

function App() {
  const [Count, setCount] = useState(0);
  const [Items, setItems] = useState([]);
  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  //아래 함수에서는 덜중요하고 무거운 연산때문에 급하고 중요한 연산까지 덩달아 늦게 화면에 렌더링
  const handleClick = () => {
    //급하게 처리해야될 중요한 연산 urgent op
    setCount(Count + 1);

    //시간이 많이 걸리고 우선순위가 떨어지는 덜 중요한 연산 not urgent op
    //우선순위가 떨어지는 연산구문을 startTransition의 콜백함수로 전달
    startTransition(() => {
      const arr = Array(20000)
        .fill(1)
        .map((_, idx) => Count + idx);

      setItems(arr);
    });
  };

  return (
    <div className="App">
      {/* 버튼 클릭할때마다 Count값만 먼저 연산이 일어나서 부분적으로 중요한 버튼 내용 먼저 갱신 */}
      {/* 초기 로딩시 연산이 오래걸리지 않는 컨텐츠를 미리 화면에 띄워줌 */}
      {/* isPending값을 이용해서 startTransition으로 실행되는 무거운 연산이 끝났을때 다시 이벤트 호출가능하게 처리 */}
      <button onClick={handleClick} disabled={isPending}>
        {Count}
      </button>
      <ul>
        {/* startTransition으로 우선순위를 뒤로 빼놓은 Items값은 좀 뒤에 연산처리 */}
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
