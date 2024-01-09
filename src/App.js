import Btns from './components/btns/Btns';
import News from './components/news/News';
import Pics from './components/pics/Pics';
import Visual from './components/visual/Visual';
import './global.scss';

function App() {
  return (
    <div className="App">
      <Visual />
      <News />
      <Pics />
      <Btns />
    </div>
  );
}

export default App;
