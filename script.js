
let currentSong = new Audio();

let songs;

function secondsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + remainingSeconds;
}

// Example usage:
// console.log(secondsToMinutesAndSeconds(13.4343)); // Output: "0:13"


// // Example usage:
// console.log(secondsToMinutesAndSeconds(90)); // Output: "1:30"
// console.log(secondsToMinutesAndSeconds(3665)); // Output: "61:05"


// // Example usage:
// console.log(secondsToMinutesAndSeconds(90)); // Output: "01:30"
// console.log(secondsToMinutesAndSeconds(3665)); // Output: "


async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/song/")
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let song = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            song.push(element.href.split("/song/")[1]);
        }
        
    }
    return song;
}

const playMusic = (track , pause=false) => {
    
    // let audio = new Audio("/song/" + track);
    currentSong.src = "/song/" + track
    if(!pause){
        currentSong.play();
        play.src = "pause.svg";
    }
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    
}

async function main(){

    
    //for get song list
     songs =  await getSongs();
    playMusic(songs[0] , true);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img src="icons.jpg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20" , " ")} </div>
            <div>Abhishek</div>
        </div>
        <img class="invert" src="play.svg" alt="">
        
        </li>`;
    }


    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" , element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })
    
   
    //Add event listner to play 
    play.addEventListener("click" , ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })


    //listen for timeupdate event
    currentSong.addEventListener("timeupdate" , () =>{
        // console.log(currentSong.currentTime , currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}` ;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%"
    })

    //add eventlistner to seek bar
    document.querySelector(".seekbar").addEventListener("click" , e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)* percent)/100;


    })


    //Add eventListner for Hamburger
    document.querySelector(".hamburger").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "0";
    })
    
    
    //Add eventListner for close button
    document.querySelector(".close").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "-100%";
    })
    

    //Add eventListener for previous 
    document.querySelector("#prev").addEventListener("click" , ()=> {
        console.log(currentSong.src);
        console.log(songs);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0 ){
            playMusic(songs[index-1]);
        }
    })
    
    //Add eventListener for next 
    document.querySelector("#next").addEventListener("click" , ()=> {
        currentSong.pause();
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) <  songs.length){
            playMusic(songs[index+1]);
        }

    })

  
}

main();