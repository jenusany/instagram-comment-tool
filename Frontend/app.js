document.getElementById('loginButton').onclick = function() {
    const appId = '803246971960239';
    const redirectUri = 'https://jenusany.github.io/tesing/';
    const authUrl = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,pages_show_list,business_management,pages_read_engagement`;
  
    window.location.href = authUrl;
  };
  const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
// Exchange the code for an access token
fetch(`https://graph.facebook.com/v11.0/oauth/access_token?client_id=803246971960239&redirect_uri=https://jenusany.github.io/tesing/&client_secret=c19298b4ce75926bf2dc0177b77e5912&code=${code}`)
  .then(response => response.json())
  .then(data => {
    const accessToken = data["access_token"];

    fetch(`https://graph.facebook.com/v20.0/me/businesses?access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
            let businesses = data["data"]
            const businessesHTML = document.getElementById('businesses')
            for(let i = 0; i < businesses.length; i++){
              const portfolio = document.createElement("button");
              portfolio.innerText = businesses[i]["name"]
              businessesHTML.appendChild(portfolio)
              portfolio.addEventListener("click", () => {
                console.log(businesses[i]["name"])
                ownedPages(businesses[i]["id"], accessToken)
              })
            }
        })
  })
  .catch(error => console.error('Error:', error));
}

function ownedPages(pageid, accessToken){
  fetch(`https://graph.facebook.com/v14.0/${pageid}/owned_pages?access_token=${accessToken}`)
    .then(response => response.json())
    .then(data => {
      const accounts = data["data"]
      console.log(accounts)
      const accountsHTML = document.getElementById('accounts')
      for(let i = 0; i < accounts.length; i++){
        const indAcc = document.createElement("button");
        indAcc.innerText = accounts[i]["name"]
        accountsHTML.appendChild(indAcc)
        indAcc.addEventListener("click", () => {
          instaAccount(accounts[i]["id"], accessToken)
        })
      }
    })
}

function instaAccount(pageid, accessToken){
  fetch(`https://graph.facebook.com/v20.0/${pageid}?fields=instagram_business_account&access_token=${accessToken}`)
    .then(response => response.json())
    .then(data => {
      const id = data["instagram_business_account"]["id"]
      fetch(`https://graph.facebook.com/v20.0/${id}/media?access_token=${accessToken}`)
      .then(response => response.json())
      .then(data => {
        const posts = data["data"]
        const postHTML = document.getElementById("posts")
        for(let i = 0; i < posts.length; i++){
          fetch(`https://graph.facebook.com/v20.0/${posts[i]["id"]}?fields=media_url,caption,comments&access_token=${accessToken}`)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            const pic = data["media_url"]
            console.log(data["comments"])
            const comments = data["comments"]["data"]
            const img = document.createElement("img")
            img.src = String(pic)
            postHTML.appendChild(img)
            img.addEventListener("click", () => {
              let commentList = [];
              for(let i = 0; i < comments.length; i++){
                commentList.push(comments[i]["text"])
              }
              let json = {
                "comment-list":commentList
              }
              console.log(commentList)
            })
          })
        }


      })

    })
}

