const router = require('express').Router()
const Tweet = require('../model/Tweet')

//CREATE POST
router.post("/createtweet", async (req, res) => {
  const newTweet= new Tweet(req.body);
  try {
    const savedPost = await newTweet.save();
    res.status(200).json("post is saved " + savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put("/updatetweet/:id", async (req, res) => {
  try {
    const post = await Tweet.findById(req.params.id);
    if (post.username==req.body.username) {
      try {
        const updatedPost = await Tweet.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json("user is updated " + updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/deletetweet/:id", async (req, res) => {
  try {
        const post = await Tweet.findById(req.params.id);
        if (post.username === req.body.username || post.isadmin==true) {
          try {
            await post.delete();
            res.status(200).json("Post has been deleted...");
          } catch (err) {
            res.status(500).json(err);
          }
        } else {
          res.status(401).json("You can delete only your post!");
        }
    }
 catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/gettweet/:id", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    res.status(200).json(tweet);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/getall", async (req, res)=>{
    try{
      const posts = await Tweet.find();
      res.status(200).json(posts);
    }
    catch (err) {
      res.status(500).json(err);
  }
});

module.exports=router;