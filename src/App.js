import React, { useEffect, useReducer, useState } from "react";
import "./styles.css";


// create fetchReducer
function fetchReducer(state, action) {
  switch(action.type) {
    case 'fetch':
      return {
        ...state,
        loading: true
      }
    case 'success': 
      return {
        loading: false,
        data: action.data,
        error: null
      }
    case 'error':
      return {
        ...state,
        loading: false,
        error: 'Problem fetching results...'
    }
    default:
      return state 
  }
}


// the hook
function useFetch(url) {
  const [ state, dispatch ] = useReducer( fetchReducer, {
    data: '',
    loading: true,
    error: null
  })

  const {loading, error, data} = state;

  // Side Effect here 
  useEffect(() => {
    dispatch({type: 'fetch'})

    fetch(url)
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'success',
          data
        })
      }).catch(err => {
        console.warn(err.message)
        dispatch('error')
      })
  },[url])

  return {
    loading,
    error,
    data
  }
}

const postIds = [1,2,3,4,5,6,7,8]

export default function App() {
  const [index, setIndex] = useState(0);

  const { loading, data: post, error } = useFetch(
   `https://jsonplaceholder.typicode.com/posts/${postIds[index]}`
  )
  
  const handleIndex = () => {
    setIndex(index => index === postIds.length - 1 ? index : index + 1)
  }

  console.count('Render')

  if(loading) {
    return <p>Loading...</p>
  }

  if(error) {
    return (<React.Fragment>
      <p>{error}</p>
      <button onClick={handleIndex}>Generate Post</button>
      </React.Fragment>)
  }

  return (
    <div className="App">
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <button onClick={handleIndex}>Generate Post</button>
    </div>
  );
}
