import React from "react";
import "./threenavnav.css";
export default function Threenavnav() {
  return (
     
    <div className="w-full flex h-screen bg-zinc-900 text-white">
      
      {/* Dedicated canvas container */}
      <div className="canvas w-1/2 h-screen relative z-0">
        <a
          className="text-2xl opacity-60 font-nmregular fixed top-10 right-10"
          href=""
        >
          close menu<i className="ri-close-large-fill"></i>
        </a>
      </div>

      {/* Images container */}
      <div className="images w-[25vw] h-[32vw] absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/3 z-10">
        <img
          className="absolute w-auto h-auto object-cover"
          src="/images/discord.png"
          alt="Discord"
        />
        <img
          className="absolute w-auto h-auto object-cover"
          src="/images/spotify.png"
          alt="Spotify"
        />
        <img
          className="absolute w-auto h-auto object-cover"
          src="/images/instagram.png"
          alt="Instagram"
        />
        <img
          className="absolute w-auto h-auto object-cover"
          src="/images/game.png"
          alt="Game"
        />
      </div>

      {/* Links section */}
      <div className="w-1/2 h-screen items-center flex justify-center">
        <div className="links font-nmregular flex flex-col gap-10">
          <a
            className="lowercase transition-all hover:ml-5 opacity-30 hover:opacity-100 block tracking-tighter text-6xl"
            href=""
          >
            <small className="text-xl tracking-normal">01.</small>
            DISCORD
          </a>
          <a
            className="lowercase transition-all hover:ml-5 opacity-30 hover:opacity-100 block tracking-tighter text-6xl"
            href=""
          >
            <small className="text-xl tracking-normal">02.</small>
            SPOTIFY
          </a>
          <a
            className="lowercase transition-all hover:ml-5 opacity-30 hover:opacity-100 block tracking-tighter text-6xl"
            href=""
          >
            <small className="text-xl tracking-normal">03.</small>
            INSTAGRAM
          </a>
          <a
            className="lowercase transition-all hover:ml-5 opacity-30 hover:opacity-100 block tracking-tighter text-6xl"
            href=""
          >
            <small className="text-xl tracking-normal">04.</small>
            GAME
          </a>
        </div>
      </div>
    </div>
    
  );
}
