const url='ws://localhost:9876'
const server = new WebSocket(url)

const message=document.getElementById('messages')
const input=document.getElementById('message')
const button=document.getElementById('send')

button.disabled=true
button.addEventListener('click',sendMessage,false)

server.onopen=function(){
    server.send("Hello World")
    button.disabled=false
}
server.onmessage=function(event){
    const {data}=event
    generateMessage(data,'Server')
    
} 
function generateMessage(msg,type){
    const newMessage=document.createElement("div")
    newMessage.innerText=`${type} Says ${msg}`
    message.appendChild(newMessage)
}
function sendMessage(){
    const text= input.value
    generateMessage(text,'client')
    server.send(text)
}