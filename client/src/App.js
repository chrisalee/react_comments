import './App.css';
import TopCommentBox from './components/commentsBox/topCommentBox/TopCommentBox';
import MessageScroll from './MessageScroll';

const App = () => {
  return (
    <div className="colHolder">
      <TopCommentBox autoFocus={false} />
      <MessageScroll />
    </div>  
  );
}

export default App;
