import './global.scss';

function App() {
  return <div className="App"></div>;
}

export default App;

/*
  React18에서의 Suspense를 활용한 컴포넌트 렌더링의 동기화처리
  - 각 페이지에 구성되어 있는 컴포넌트들을 동시에 호출하는 것이 아닌 영역별로 렌더링 시점을 동기화처리
  - 이전 버전까지는 클라이언트컴포넌트에서만 제한적으로 동작되는 기술이었지만 18버전에서부터는 SSR방식의 컴포넌트에서도 활용가능하도록 개선

  활용예: 비동기 데이터를 활용하는 컴포넌트의 경우 비동기 데이터 fetching이 완료될때까지 해당 비동기 데이터 관련 컴포넌트의 렌더링을 시작않으면서 Suspense가 Promise의 상태값을 감시
  Promise가 fullfilled나 rejected로 상태가 전환되면 동기적으로 해당데이터를 활용하는 컴포넌트를 렌더링

  활용예: 비동기데이터의 pending상태가 길어질때는 대신 fallback을 통해서 정적인 UI를 대신 호출 (로딩바 같은)


  useTransition vs Suspense의 차이
  - useTranstion은 컴포넌트간의 동기화처리가 아닌 동시에 실행되는 비동기 방식이지만 startTransition으로 묶어놓은 연산이 우선순위기 밀리는 것 뿐

  - Suspense는 해당 컴포넌트에서 관리는 promise객체의 상태를 실시간으로 감시하면서 pending이 끝났을때 동기적으로 컴포넌트를 호출
*/
