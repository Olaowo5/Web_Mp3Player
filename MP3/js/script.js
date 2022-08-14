//Lets select all required tags or elements


const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progessbar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");






let musicIndex = 2 ;
var IsShuffle = false; //this will be used to randomize choice for nex song if shuffle is true
let previousIndex = -1;

window.addEventListener("load", ()=>
{
    loadMusic(musicIndex);//calling the load music function once on windows load
    playingSong();
})
//load music function
function loadMusic(indexNumb)
{
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

function playMusic()
{
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();

}

function pauseMusic()
{
    wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();

}

function nextMusic()
{
    //we  will increment by 1
    //go to the next music

    if(IsShuffle)
    {
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex || randIndex == previousIndex);
         //this loop run until the next random number won't be the same of current musicIndex
       previousIndex = musicIndex; //making sure its not previous musisc
        musicIndex = randIndex; //passing randomIndex to musicIndex
    }
    else
    {
    musicIndex++;
    //if greter than array length reset am to 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
}

function prevMusic()
{
    //we will decremnt by -1
    //go to the previous music
    musicIndex--;
    if(musicIndex<1)
        {musicIndex = allMusic.length;}

    loadMusic(musicIndex);
    playMusic();
  playingSong(); 
}
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");

    //if is MusicPaused is true then call pauseMusic else call PlayMusic

    isMusicPaused? pauseMusic() : playMusic();
    playingSong();
});

nextBtn.addEventListener("click",  ()=>
{
    nextMusic();
});

prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

//update progress bar with music progress inrealtime
mainAudio.addEventListener("timeupdate", (e)=>
{
    const currentTimed = e.target.currentTime; //getting playing song currentTime
    const durattion = e.target.duration; //getting playing song total duration
  
    let test = durattion/10;
    let progressWidth = (currentTimed / durattion) * 100;
    progessbar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata", ()=>{
       

         //update  song total duartion
         let audioDuration = mainAudio.duration;
         let totalMin = Math.floor(audioDuration/60);
         let totalsec =  Math.floor(audioDuration % 60);

         if(totalsec< 10)
         {
            totalsec = `0${totalsec}`;
         }
         musicDuration.innerText = `${totalMin}:${totalsec}`;

        
    });

     //update  Playing song total duartion
         
     let currentMin = Math.floor(currentTimed/60);
     let currentsec=  Math.floor(currentTimed % 60);

     if(currentsec< 10)
     {
        currentsec = `0${currentsec}`;
     }

     musicCurrentTime.innerText = `${currentMin}:${currentsec}`;

});

// update playing song currentTime on according to the progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidth = progressArea.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration
    
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic(); //calling playMusic function
    playingSong();
  });
  
  //change loop, shuffle, repeat icon onclick
  const repeatBtn = wrapper.querySelector("#repeat-plist");
  repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title", "Song looped");
        IsShuffle = false;
        break;
      case "repeat_one":
        repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title", "Playback shuffled");
        IsShuffle = true;
        break;
      case "shuffle":
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title", "Playlist looped");
        IsShuffle = false;
        break;
    }
  });
  
  //code for what to do after song ended
  mainAudio.addEventListener("ended", ()=>{
    // we'll do according to the icon means if user has set icon to
    // loop song then we'll repeat the current song and will do accordingly
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch(getText){
      case "repeat":
        nextMusic(); //calling nextMusic function
        break;
      case "repeat_one":
        mainAudio.currentTime = 0; //setting audio current time to 0
        loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
        playMusic(); //calling playMusic function
        break;
      case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
        do{
          randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
        musicIndex = randIndex; //passing randomIndex to musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingSong();
        break;
    }
  });
  
  //button to show muskc list
  showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
    });
    
    hideMusicBtn.addEventListener("click",()=>{
       showMoreBtn.click();//call the previous one its a toggle
        });
  
  const ulTag = wrapper.querySelector("ul");
  // let create li tags according to array length for list
  for (let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from the array
    let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
      if(totalSec < 10){ //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
      };
      liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
      liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
    });
  }
  
  //play particular song from the list onclick of li tag
  function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
      
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
  
      //if the li tag index is equal to the musicIndex then add playing class in it
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
  
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }
  
  //particular li clicked function
  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
  }
