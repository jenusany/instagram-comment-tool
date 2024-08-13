import React from 'react';
import Login from './pages/login';
import Main from './pages/main';
import Data from './pages/data';
import { useState } from 'react';

function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  const [commentsCollected,setcommentsCollected] = useState([]);
  const [likes,setLikes] = useState();
  const [timestamp,setTimeStamp] = useState();

  const FacebookLogin = (e) => {
    e.preventDefault()
    const appId = '803246971960239';
    const redirectUri = 'https://jenusany.github.io/instagram-comment-tool/';
    const authUrl = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,pages_show_list,business_management,pages_read_engagement`;
    window.location.href = authUrl;
  }

  function AnalyseComments(url, comments){
    setLikes(likes)
    setTimeStamp(timestamp)
    let arr = []
    for(let i = 0; i <  comments[url][0]["data"].length; i++){
      arr.push(comments[url][0]["data"][i]["text"])
    }
    //console.log([arr, comments[url][1], comments[url][2]])
    setcommentsCollected([arr, comments[url][1], comments[url][2]])
}

  if (code === null){
    return(
      <Login method={FacebookLogin}/>
    )
  }else{
    if (commentsCollected.length === 0){
      return(
        <Main method={AnalyseComments}/>
      )
    }else{
      return(
        <Data commentArr={commentsCollected} />
      )
    }
  }
}

export default App;