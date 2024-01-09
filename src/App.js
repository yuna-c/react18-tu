import Anime from './asset/anime';
import Btns from './components/btns/Btns';
import News from './components/news/News';
import Pics from './components/pics/Pics';
import Visual from './components/visual/Visual';
import './global.scss';
import { useEffect, useRef } from 'react';

function App() {
  const btnTop = useRef(null);

  const handleScroll = () => {
    const scroll = window.scrollY;
    scroll >= 200
      ? btnTop.current.classList.add('on')
      : btnTop.current.classList.remove('on');
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="App">
      <Visual />
      <News />
      <Pics />
      <Btns />

      <button
        ref={btnTop}
        className="btnTop"
        onClick={() => {
          new Anime(window, { scroll: 0 });
        }}
      >
        top
      </button>
    </div>
  );
}

export default App;
