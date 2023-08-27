import { useEffect, useState } from 'react';

const App = () => {
  
  const [state , setState] = useState({
    username : 'loading',
    password : '',
  })
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  setTimeout(() => {
    setState(prevState => ({
      ...prevState,
      username: 'new loading'
    }));
  }, 1000);
  
  useEffect(() =>{
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {};
  }, [count]);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  return (
    <div>
      { isLoading ? (
        <div>{state.username}</div>
      ) : (
        <div>
          <button onClick={handleClick}>Click Me</button>
          <div>clicked: {count} times.</div>
        </div>
      )}
    </div>
  );
}

export default App;
