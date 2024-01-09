import Anime from '../../asset/anime';
import './Btns.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

export default function Btns(opt) {
  //동적으로 button생성시키위한 State 초기화
  const [Num, setNum] = useState(0);

  //디폴트 컴포넌트 옵션
  const defOpt = useRef({
    items: '.myScroll',
    base: -window.innerHeight / 2,
    isAuto: false,
  });

  //결합된 컴포넌트 옵션
  const resultOpt = useRef({ ...defOpt.current, ...opt });

  //autoScrolling기능 활성화 유무를 위한 참조객체
  const isAutoScroll = useRef(resultOpt.current.isAuto);

  //sections요소를 담을 참조객체
  const secs = useRef(null);

  //btns 요소를 담을 참조객체
  const btns = useRef(null);

  //scroll 기준점
  const baseLine = useRef(resultOpt.current.base);

  //스크롤시 버튼 활성화시킬 함수
  const activation = () => {
    const scroll = window.scrollY;

    secs.current.forEach((_, idx) => {
      if (scroll >= secs.current[idx].offsetTop + baseLine.current) {
        const btnsArr = btns.current?.querySelectorAll('li');
        btnsArr?.forEach((btn) => btn.classList.remove('on'));
        btns.current?.querySelectorAll('li')[idx]?.classList.add('on');
      }
    });
  };

  //클릭시 자동 스크롤 이동 함수
  const moveScroll = (idx) => {
    new Anime(window, { scroll: secs.current[idx].offsetTop });
  };

  //마우스휠 시 자동 스크롤 이동함수
  const autoScroll = useCallback(
    (e) => {
      const btnsArr = Array.from(btns.current.children);
      const activeEl = btns.current.querySelector('li.on');
      const activeIndex = btnsArr.indexOf(activeEl);

      if (e.deltaY > 0) {
        activeIndex !== Num - 1 && moveScroll(activeIndex + 1);
      } else {
        activeIndex !== 0 && moveScroll(activeIndex - 1);
      }
    },
    [Num]
  );

  //리사이즈시 최신 위치값 갱신해주고 해당 위치로 스크롤위치 보정하는 함수
  const modifyPos = () => {
    const btnsArr = Array.from(btns.current.children);
    const activeEl = btns.current.querySelector('li.on');
    const activeIndex = btnsArr.indexOf(activeEl);
    window.scrollTo(0, secs.current[activeIndex].offsetTop);
  };

  //activation, modifyPos 쓰로틀링
  const throttledActivation = useThrottle(activation);
  const throttledModifyPos = useThrottle(modifyPos, 200);

  //동적으로 버튼 생성하고 window객체에 이벤트 연결 (scroll, resize, mousewheel)
  useEffect(() => {
    secs.current = document.querySelectorAll(resultOpt.current.items);
    setNum(secs.current.length);

    window.addEventListener('resize', throttledModifyPos);
    window.addEventListener('scroll', throttledActivation);
    isAutoScroll.current && window.addEventListener('mousewheel', autoScroll);

    return () => {
      window.removeEventListener('resize', throttledModifyPos);
      window.removeEventListener('scroll', throttledActivation);
      window.removeEventListener('mousewheel', autoScroll);
    };
  }, [autoScroll, throttledActivation, throttledModifyPos]);

  return (
    <ul className="Btns" ref={btns}>
      {Array(Num)
        .fill()
        .map((_, idx) => {
          //동적으로 버튼 생성 및 클릭 이벤트 핸들러 연결
          return (
            <li
              key={idx}
              className={idx === 0 ? 'on' : ''}
              onClick={() => moveScroll(idx)}
            ></li>
          );
        })}
    </ul>
  );
}
