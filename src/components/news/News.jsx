import { useEffect, useRef } from 'react';
import './News.scss';

export default function News() {
  const thisEl = useRef(null);
  const boxEl = useRef(null);

  const handleScroll = () => {
    const currentPos = thisEl.current.offsetTop;
    const scroll = window.scrollY;
    const modifiedScroll = scroll - currentPos;

    if (modifiedScroll >= 0) {
      boxEl.current.style.transform = `rotate(${modifiedScroll}deg)`;
    } else {
      boxEl.current.style.transform = `rotate(0deg)`;
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="News myScroll" ref={thisEl}>
      <div className="box" ref={boxEl}></div>
    </section>
  );
}
