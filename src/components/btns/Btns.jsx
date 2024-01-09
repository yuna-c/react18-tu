import Anime from '../../asset/anime';
import './Btns.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

export default function Btns(opt) {
  //Btns Nums
  const [Num, setNum] = useState(0);

  //default Options
  const defOpt = useRef({
    items: '.myScroll',
    base: -window.innerHeight / 2,
    isAuto: false,
  });

  //combined Options
  const resultOpt = useRef({ ...defOpt.current, ...opt });

  //enable AutoScroll option
  const isAutoScroll = useRef(resultOpt.current.isAuto);
  //myScroll sections ref array
  const secs = useRef(null);
  //btns ref array
  const btns = useRef(null);
  //scroll baseLine
  const baseLine = useRef(resultOpt.current.base);

  //btn activation func when scroll
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

  //scroll motion func when click
  const moveScroll = (idx) => {
    new Anime(window, { scroll: secs.current[idx].offsetTop });
  };

  //auto scrolling func when mouse wheel
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

  //modify scroll position when resize
  const modifyPos = () => {
    const btnsArr = Array.from(btns.current.children);
    const activeEl = btns.current.querySelector('li.on');
    const activeIndex = btnsArr.indexOf(activeEl);
    window.scrollTo(0, secs.current[activeIndex].offsetTop);
  };

  //throttling activation, modify func
  const throttledActivation = useThrottle(activation);
  const throttledModifyPos = useThrottle(modifyPos, 200);

  //Btns creates, Binding Window Events(scroll, resize, mousewheel) When component mounts
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
          //create button and event Binding
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
