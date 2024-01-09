import Anime from '../../asset/anime';
import './Btns.scss';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useThrottle } from '../../hooks/useThrottle';

export default function Btns(opt) {
  const defOpt = useRef({
    items: '.myScroll',
    base: -window.innerHeight / 2,
    isAuto: false,
  });
  const resultOpt = useRef({ ...defOpt.current, ...opt });
  const [Num, setNum] = useState(0);

  const isAutoScroll = useRef(resultOpt.current.isAuto);
  const secs = useRef(null);
  const btns = useRef(null);
  const baseLine = useRef(resultOpt.current.base);

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

  const moveScroll = (idx) => {
    new Anime(window, { scroll: secs.current[idx].offsetTop });
  };

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

  const modifyPos = () => {
    const btnsArr = Array.from(btns.current.children);
    const activeEl = btns.current.querySelector('li.on');
    const activeIndex = btnsArr.indexOf(activeEl);
    window.scrollTo(0, secs.current[activeIndex].offsetTop);
  };

  const throttledActivation = useThrottle(activation);
  const throttledModifyPos = useThrottle(modifyPos, 200);

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
