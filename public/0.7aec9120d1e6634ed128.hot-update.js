webpackHotUpdate(0,{144:function(t,e,n){"use strict";function o(t){h.fillStyle="rgba(0, 0, 0, 0.1)",h.fillRect(0,0,f.width,f.height),h.fillStyle="rgba(255, 255, 255, 1)";for(var e in w)if(w.hasOwnProperty(e)){var n=w[e];n.id,Math.floor(n.x),Math.floor(n.y),h.beginPath(),h.arc(n.x,n.y,m,0,2*Math.PI),h.fill(),h.stroke()}requestAnimationFrame(o)}function i(t){var e=t.targetTouches[0];g=e.clientX,v=e.clientY}function c(t){g=t.x,v=t.y}function r(){u.emit("event",{id:u.id,x:Math.floor(g),y:Math.floor(v)}),setTimeout(r,s)}function l(){f.width=document.documentElement.clientWidth,f.height=document.documentElement.clientHeight}var d=n(366),a=function(t){return t&&t.__esModule?t:{default:t}}(d),u=(0,a.default)("http://localhost:9090"),m=5,s=.06,f=document.createElement("canvas"),h=f.getContext("2d"),g=0,v=0,w={},y=0;document.body.appendChild(f),window.addEventListener("resize",l),l(),o(),u.on("connect_error",function(t){console.log("Error connecting to server")}),u.on("connect",function(t){console.log("-> on connect"),console.log(u.id),window.addEventListener("mousemove",c),window.addEventListener("touchstart",i),window.addEventListener("touchmove",i),r()}),u.on("tick",function(t){w=t.clients,document.querySelector(".timer").innerText=moment(t.gameNowTime).format("HH:mm:ss")}),u.on("pong",function(t){y=t,console.log(y)})}});