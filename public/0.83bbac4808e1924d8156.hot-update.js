webpackHotUpdate(0,{144:function(t,e,n){"use strict";function o(t){m.fillStyle="rgba(0, 0, 0, 0.1)",m.fillRect(0,0,h.width,h.height),m.fillStyle="rgba(255, 255, 255, 1)";for(var e in w)if(w.hasOwnProperty(e)){var n=w[e];n.id,Math.floor(n.x),Math.floor(n.y),m.beginPath(),m.arc(n.x,n.y,f,0,2*Math.PI),m.fill(),m.stroke()}requestAnimationFrame(o)}function i(t){var e=t.targetTouches[0];v=e.clientX,g=e.clientY}function c(t){v=t.x,g=t.y}function r(){u.emit("event",{id:u.id,x:Math.floor(v),y:Math.floor(g)}),setTimeout(r,s)}function d(){h.width=document.documentElement.clientWidth,h.height=document.documentElement.clientHeight}var l=n(366),a=function(t){return t&&t.__esModule?t:{default:t}}(l),u=(0,a.default)("http://vps290277.ovh.net:9090"),f=5,s=.06,h=document.createElement("canvas"),m=h.getContext("2d"),v=0,g=0,w={};document.body.appendChild(h),window.addEventListener("resize",d),d(),o(),u.on("connect_error",function(t){console.log("Error connecting to server")}),u.on("connect",function(t){console.log("-> on connect"),console.log(u.id),window.addEventListener("mousemove",c),window.addEventListener("touchstart",i),window.addEventListener("touchmove",i),r()}),u.on("clients",function(t){w=t})}});