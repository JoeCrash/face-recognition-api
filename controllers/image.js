//const clarifai = require("clarifai"); //old, kept for console.log MODEL_ID references only

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${PAT}`);

const handleApiCall = (req, res) => {
  const { imageUrl } = req.body;
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID,
      inputs: [
        { data: { image: { url: imageUrl, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }

      const output = response.outputs[0];
      if (output) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json("could not access imageApi");
      }
    }
  );
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.status(200).json(entries[0].entries);
    })
    .catch((err) => res.status(404).json("user not found for img"));
};

module.exports = {
  handleApiCall,
  handleImage,
};
