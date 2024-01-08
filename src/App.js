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

  useTransition을 주로 쓰는 사례 (hydration처리할때)
  굳이 데이터 fetching이 필요없는 정적인 컨텐츠를 먼저 빠르게 화면에 출력하고 나서
  서버나 외부 API에서 불러와야 되는 비동기 데이터를 나중에 선별적으로 호출할때

  프론트엔드 개발에 따른 화면렌더링 연산흐름의 변화

  예전 SSR (Server Side Rendering) 작업방식 (HTML,CSS,jQuery, ajax)
  1. 처음 서버로부터 HTML파일을 가져옴
  2. 추후 동적데이터가 필요할때마다 다시 서버쪽에 요청을 해서 전체 화면을 Full load (화면 깜박임) (jQuery등장전)
  3. 이후 jQuery Ajax기능을 사용할 수 있게 됨에 따라 전체화면을 다시 Full load하지 않고 필요한 데이터만 실시간 호출가능
  4. 비동기 데이터를 jQuery를 이용해서 일일이 동적 DOM을 생성해야되는 번거로움 생김

  리액트를 활용한 CSR(Client Side Rendering) 방식 등장 (React17)
  1. 빈 HTML파일을 브라우저가 서버로부터 호출
  2. 자바스크립트(리액트) 파일 로드 (React);
  3. 리액트 컴포넌트 로드 (useEffect에 의해서 Data fetching 시작)
  4. 컴포넌트 해석후 렌더링 시작
  5. 최종화면에 Data fetching까지 적용된 동적 DOM화면에 출력 (이때까지 사용자는 빈화면을 보게됨)

  리액트18버전에서의 SSR,CSR작업흐름 (React18)
  1. 서버쪽에서 미리 static하게 프리렌더링된 HTML파일을 가져옴 
  2. 동적으로 바뀔필요가 없는 정적인 데이터를 미리 서버쪽에서 HTML파일로 만들어서 준비해뒀다가 URL입력시 미리 완성된 HTML파일을 전송해줌
  3. 리액트관련 자바스크립트 파일 로드
  4. 미리 프리렌더된 정적인 컨텐츠를 먼저 출력해둔 상태에서 동적데이터를 다루는 컴포넌트 해석
  5. 동적데이터가 해석되면 기존 정적페이지에 동적데이터를 기반으로 한 컨텐츠를 부드럽게 호출 (Hydration)

  Next에서의 작업흐름 
  1. 클라이언트 컴포넌트, 서버 컴포넌트가 분리
  2. 기본적으로 모든 컴포넌트는 서버 컴포넌트로 구현됨 (미리 서버쪽에서 정적인 데이터를 바탕으로해서 pre-render된 HTML파일을 바로 전달되는 방식)
  3. 미리 어느정도 데이터가 있는 형태로 일단은 SSR방식으로 출력을 함
  4. 추후 사용자 이벤트에 의해서 동적 데이터를 가져올 확률이 있는 컨텐츠는 클라이언트 컴포넌트로 제작
*/
