const router = require("express").Router();
const slack = require("slack");
let clientId = process.env.SLACK_CLIENT_ID; // TODO: Create environment var store
let clientSecret = process.env.SLACK_CLIENT_SECRET;
let botToken = process.env.SLACK_BOT_TOKEN;
const bot = new slack({ botToken });
let authCode = ""; //TODO: make it for various users. Also, i cant cache the auth code cuz it's one time exchange
let access_token = ""; //"xapp-1-A02G7ST95AL-2535227706164-1d1aef3adfa6d640119868037387b60ec11e89f8536de1aa7eafba6c5c4063a3";  //261563897047.2590653963744.6f690d493bcf54093bea8892af6e19facc508a350a4be3053459fd4f9e58cfef

console.log(`clientId ${clientId}`);
console.log(`client_secret ${clientSecret}`);
console.log(`code ${authCode}`);

//https://stackoverflow.com/questions/17978883/what-is-the-purpose-of-a-semicolon-before-an-iife
(async function main() {
  // logs {args:{hyper:'card'}}
  var result = await bot.api.test({ hyper: "card" });
  console.log(result);
})();

router.post("/receiveAuthCode", async (req, res) => {
  try {
    let reqAuthCode = req.body.code;
    console.log(req.body);
    if (reqAuthCode && reqAuthCode.length != 0) {
      authCode = reqAuthCode;
    } else {
      throw "Received auth code is invalid!";
    }
    let resMsg = {
      message: "SUCCESSLY SUBMITTED",
    };
    res.status(200).json(resMsg);
  } catch (err) {
    console.log("Receive Auth Code ERROR");
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/testSlack", async (req, res) => {
  try {
    const slackRes = await bot.api.test({ hyper: "card" });
    console.log(slackRes);
    res.status(200).json(slackRes);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/convoList", async (req, res) => {
  try {
    if (!clientId || !clientSecret || !botToken) {
      clientId = process.env.SLACK_CLIENT_ID; // TODO: Create environment var store
      clientSecret = process.env.SLACK_CLIENT_SECRET;
      botToken = process.env.SLACK_BOT_TOKEN;
    }
    console.log(`clientId ${clientId}`);
    console.log(`client_secret ${clientSecret}`);
    console.log(`code ${authCode}`);
    let isOk = false;
    if (access_token.length == 0) {
      let accessTokenReq = await bot.oauth.access({
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode,
      });
      isOk = accessTokenReq.ok;
      if (isOk) {
        access_token = accessTokenReq.access_token;
      }
      console.log(`access_token: ${access_token}`);
      console.log(access_token);
    }
    const slackRes = await bot.conversations.list({ token: access_token }); //I suspect need access token lmao
    console.log(slackRes);
    isOk = slackRes.ok;
    let finalPayload = {};
    if (isOk) {
      finalPayload["channels"] = slackRes.channels;
    } else {
      finalPayload["ok"] = "not ok";
    }
    res.status(200).json(finalPayload);
  } catch (err) {
    console.log("/convoList Error!");
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/convoHistory", async (req, res) => {
  try {
    if (!clientId || !clientSecret || !botToken) {
      clientId = process.env.SLACK_CLIENT_ID; // TODO: Create environment var store
      clientSecret = process.env.SLACK_CLIENT_SECRET;
      botToken = process.env.SLACK_BOT_TOKEN;
    }
    let isOk = false;
    if (access_token.length == 0) {
      let accessTokenReq = await bot.oauth.access({
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode,
      });
      isOk = accessTokenReq.ok;
      if (isOk) {
        access_token = accessTokenReq.access_token;
      }
      console.log(`access_token: ${access_token}`);
      console.log(access_token);
    }
    let channelID = req.params.channel || "C7NJ5RHEZ"; //default channel ID for debugging purposes
    console.log(`channelID: ${channelID}`)
    const slackRes = await bot.conversations.history({
      token: access_token,
      channel: channelID,
    }); //I suspect need access token lmao
    console.log(slackRes);
    isOk = slackRes.ok;
    res.status(200).json(slackRes);
  } catch (err) {
    console.log("/convoHistory Error!");
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
