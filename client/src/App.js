import './App.css';
import TopCommentBox from './components/commentsBox/topCommentBox/TopCommentBox';
import MessageScroll from './MessageScroll';
// Main Context 
import { ContextProvider } from './context/Context'

const App = () => {
  return (
    <ContextProvider>
      <div className="colHolder">
        <TopCommentBox autoFocus={false} />
        <MessageScroll />
      </div>  
    </ContextProvider>
  );
}

export default App;
