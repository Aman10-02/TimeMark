
console.log("first");
let youtubeLeftControls, youtubePlayer;
let currentVideo = "";
let currentVideoBookmarks = [];  
  

const fetchBookmarks = () => {
    console.log(" fetch")
    return new Promise((resolve) => {
        currentVideo && 
        chrome.storage.sync.get([currentVideo] , (obj) => {
            console.log("Value currently is " + obj);
            resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
          });
    });
  };

const addNewBookmarkEventHandler = async () => {
    youtubePlayer.pause();
    const desc = prompt("Give Description", "No description")
    const currentTime = youtubePlayer.currentTime;
    if(desc){

        const newBookmark = {
            time: currentTime,
            desc: desc,
        };
        console.log("newBookmark", newBookmark);
        
        currentVideoBookmarks = await fetchBookmarks();
        console.log(currentVideoBookmarks);
        
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }else{
        console.log("not saved")
    }

}

const newVideoLoaded = async () => {
    console.log("inside func")
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    // currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
        console.log("btn")
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("images/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName('video-stream')[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };
  chrome.runtime.onMessage.addListener( (msg, sender, sendResponse) => {
    const { type, value, videoId } = msg;
    console.log("msg = ", msg)
    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    }
    else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
      youtubePlayer.play();
    } else if ( type === "DELETE") {
      // return new Promise( async (resolve, reject) => {
      //   try{
      //     currentVideoBookmarks = await fetchBookmarks();
      //     console.log("value :", value)
      //     currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
      //     await chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
      //     console.log("shvbfuwd sgdisuhvsd" , currentVideoBookmarks);
      //     resolve({res : "sucess"});        
      //   } catch (error) {
      //       reject(error);
      //     }
      //   } )
            const del =  async () => {

              currentVideoBookmarks = await fetchBookmarks();
              console.log("value :", value)
              currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
              await chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
              console.log("shvbfuwd sgdisuhvsd" , currentVideoBookmarks);
              sendResponse(currentVideoBookmarks);   
            }
            del();
            return true;
        }
        
  });
// newVideoLoaded();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };