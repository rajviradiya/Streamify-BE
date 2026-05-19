const { StreamChat } = require("stream-chat");
const dotenv = require('dotenv');

dotenv.config();

const streamApiKey = process.env.STREAM_API_KEY;
const streamSecretKey = process.env.STREAM_SECRET_KEY;

if (!streamApiKey || !streamSecretKey) {
  throw new Error("STREAM_API_KEY or STREAM_SECRET_KEY is missing in .env");
}

const streamClient = StreamChat.getInstance(streamApiKey, streamSecretKey);

const upsertStreamUser = async (user) => {
  try {
    const streamUser = await streamClient.upsertUser(user);
    return streamUser;
  } catch (err) {
    console.log("Error in upsertStreamUser:", err);
    throw err;
  }
};

const generateStreamToken = (userId) => {
  try {
    return streamClient.createToken(userId.toString());
  } catch (err) {
    console.log("Error in generateStreamToken:", err);
    throw err;
  }
};

module.exports = {
  upsertStreamUser,
  generateStreamToken,
};