import React, { useState, useEffect } from "react";
import "./main.css";
import Loading from "./loading.jsx";

function Main({method}) {

    const [selectedSuite, setSelectedSuite] = useState(false);
    const [MainaccessToken, setMainaccessToken] = useState();
    const [FBaccounts, setFBaccounts] = useState([]);
    const [FBaccountsIDS, setFBaccountsIDS] = useState([]);

    const [selectedAccount, setSelectedAccount] = useState();

    const [imageArray, setImageArray] = useState([]);
    const [videoarray, setvideoarray] = useState([]);

    const [CommentJSON, setCommentJSON] = useState({});
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    
    const [suiteLabels, setSuiteLabels] = useState([]);
    const [suiteId, setSuiteId] = useState([]);

    const [loadingSuite, setLoadingSuite] = useState(true);


    const fetchData = async () => {
        fetch(`https://graph.facebook.com/v11.0/oauth/access_token?client_id=803246971960239&redirect_uri=https://jenusany.github.io/testRepo/&client_secret=c19298b4ce75926bf2dc0177b77e5912&code=${code}`)
            .then(response => response.json())
            .then(data => {
                const accessToken = data["access_token"];
                //const accessToken = ("EAALajIJuO68BO7NrDU8WIZB8EZC7CBqOZCmB8s5nPEpu8kc9aadMc4R7jFdjanswZAaNkX0FKRe5jEXppcRCXHDPoNQMzy4NlTaq6yWGlqfm5un5btIOlUZC3rbfBkrBEiBvQyOX3eiKieIP4jZCmjizwZArtMEBXtJk0Bl9Dp5ELmYZANK8drPDEIcsktwZASuc1xEobDzOeg9RHsvWaogZDZD")
                setMainaccessToken(accessToken)
                fetch(`https://graph.facebook.com/v20.0/me/businesses?access_token=${accessToken}`)
                .then(response => response.json())
                .then(data => {
                    const businesses = data["data"]
                    let arr = []
                    let ids = []

                    if(businesses.length === 0){
                      throw("This Meta login has no associated Meta Business Suites")
                    }

                    for(let i = 0; i < businesses.length; i++){
                        arr.push(businesses[i]["name"])
                        ids.push(businesses[i]["id"])
                    }

                    setSuiteId(ids)
                    setSuiteLabels(arr)
                })
            })
        return new Promise(resolve => {
          setTimeout(() => {
            resolve("Data loaded");
          }, 250);
        });
      };

      useEffect(() => {
        fetchData().then(response => {
          setLoadingSuite(false);
        });
      }, []);


        const [loadingAccount, setLoadingAccount] = useState(true);

        function selectSuite(id){
              const fetchData = async (id) => {
                fetch(`https://graph.facebook.com/v14.0/${suiteId[id]}/owned_pages?access_token=${MainaccessToken}`)
                    .then(response => response.json())
                    .then(data => {
                        const accounts = data["data"]
                        let arr = []
                        let ids = []

                        if(accounts.length === 0){
                          throw("This Meta Business Suite has no associated Facebook Business Accounts")
                        }

                            for(let i = 0; i < accounts.length; i++){
                                arr.push(accounts[i]["name"])
                                ids.push(accounts[i]["id"])
                            }
                        setFBaccounts(arr)
                        setFBaccountsIDS(ids)
                    })
                    setSelectedSuite(true)
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve("Data loaded");
                  }, 250);
                });
              };

              fetchData(id).then(response => {
                setLoadingAccount(false);
              });
        }

        const [loadingPosts, setLoadingPosts] = useState(true);
        function selectAccount(id){
            const fetchData = async (id) => {

                fetch(`https://graph.facebook.com/v20.0/${FBaccountsIDS[id]}?fields=instagram_business_account&access_token=${MainaccessToken}`)
            .then(response => response.json())
            .then(data => {
                const id = data["instagram_business_account"]["id"]
                fetch(`https://graph.facebook.com/v20.0/${id}/media?access_token=${MainaccessToken}`)
                .then(response => response.json())
                .then(data => {
                    const posts = data["data"]
                    
                    let images = []
                    let videos = []
                    let comments = {}
                    
                    if(posts.length === 0){
                      throw("This Instagram business Account has no Posts")
                    }

                    for(let i = 0; i < posts.length; i++){
                        fetch(`https://graph.facebook.com/v20.0/${posts[i]["id"]}?fields=media_url,timestamp,like_count,comments,media_type&access_token=${MainaccessToken}`)
                        .then(response => response.json())
                        .then(data => {
                            comments[data["media_url"]] = [data["comments"], data["like_count"],data["timestamp"]]

                            if(data["media_type"] === 'IMAGE'){
                                images.push(data["media_url"])
                            }else{
                                videos.push(data["media_url"])
                            }
                            if (i === posts.length -1){
                                setImageArray(images)
                                setvideoarray(videos)
                                setCommentJSON(comments)
                            }
                    })
                }

                

                })
            })
            setSelectedAccount(true)
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve("Data loaded");
                  }, 1500);
                });
              };

              fetchData(id).then(response => {
                setLoadingPosts(false);
              });
        }


        if (!selectedSuite){
            if (loadingSuite) {
                return <Loading />;
              }else{
                return (
                    <div className="main">
                    <h1 className="select animate">Select a Meta Business Suite</h1>
                    {suiteLabels.map((label, index) => (
                        <button onClick={()=> {
                          try{
                            selectSuite((index))
                          } catch(error){
                            alert(error)
                          }
                      
                        }} className="suites animate" key={index}>{label}</button>
                      ))}
                      
                    </div>  
                  );
              }
        }else{
            if (!selectedAccount){
                if (loadingAccount) {
                    return <Loading />;
                  }else{
                    return (
                        <div className="main">
                        <h1 className="select animate">Select a Facebook Business Account</h1>
                        {FBaccounts.map((label, index) => (
                            <button onClick={() => selectAccount(index)} className="suites animate" key={index}>{label}</button>
                          ))}
                          <button className="back" onClick={()=> {
                            try{
                              setSelectedSuite(false)
                            } catch(error){
                              alert(error)
                            }
                            }}>Back</button>
                        </div> 
                    )
                  }
            }else{
                if (loadingPosts){
                    return <Loading />;
                }else{
                    return (
                        <>
                        <h1 className="select">Select a Post to Analyse</h1>
                        {imageArray.map((label, index) => (
                            <img className="media animate" src={label} onClick={()=> {
                              try{
                                method(label, CommentJSON)
                              }catch (error){
                                alert(error)
                              }
                            }} key={index}></img>
                          ))}
                          {videoarray.map((label, index) => (
                            <video className="media animate" onClick={()=> {
                              try{
                                method(label, CommentJSON)
                              }catch (error){
                                alert(error)
                              }
                            }} src={label} key={index}></video>
                          ))}
                          <button className="back" onClick={()=> setSelectedAccount(false)}>Back</button>
                        </> 
                    )
                }
            }
        }
}

export default Main;
