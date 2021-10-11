import {unicodeBase64Decode} from './Utils'



export function parseGmailHTML(htmlBody){
    return unicodeBase64Decode(htmlBody.replace(/\s+/g, '').replace(/\-/g, '+').replace(/\_/g, '/'))
}



export function listThreads(gapi = window.gapi){
    console.log("listThreads")
    console.log(gapi.client.gmail.users)
    gapi.client.gmail.users.threads.list({
        'userId': 'hjunleon@gmail.com',
        'maxResults': 20
    }).then(function(response) {
        //console.log(response)
    })
}


//maybe create a message object?


//https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
export async function listMessages(gapi = window.gapi){
    console.log("listMessages")
    console.log(gapi.client.gmail.users)
    let response = await gapi.client.gmail.users.messages.list({
        'userId': 'hjunleon@gmail.com',
        'maxResults': 20,
        //'labelIds':["INBOX"]
    })
    console.log(response)
    
    let messages = response.result.messages
    for (let i = 0; i < messages.length; i += 1){
        response.result.messages[i] = await getMessage(messages[i])
    }

    // response.result.messages.forEach(msg => {
        
    // });


    console.log("FUNCTION END")
    return response.result
}


async function getMessage(msg, gapi = window.gapi){
    let response = await gapi.client.gmail.users.messages.get({
        'userId': 'hjunleon@gmail.com',
        'id': msg.id
    })
    console.log(response)
    return response.result
}