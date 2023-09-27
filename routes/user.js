const router = require("express").Router();
const {Webhook} = require("svix");
const dotenv = require("dotenv");
const User = require("../models/user");
const bodyParser=require("body-parser")
const {WebhookEvent}=require("@clerk/clerk-sdk-node")

dotenv.config();

router.get('/',async (req,res)=>{
  try{
    const data=await User.find();

    res.status(200).json(data)
  }catch(err){
    return res.status(500).json(err)
  }
  
})

router.put('/update/:userId',async (req,res)=>{
  const userId=req.params.userId
  const updatedUser=req.body
  
  try{
    await User.updateOne({externalId:userId},{$set:updatedUser})

    const updateUser=await User.findOne({externalId:userId})

    res.status(200).json(updateUser)
  }catch(err){
    return res.status(500).json(err)
  }
})

router.put('/update/:userId/media',async (req,res)=>{
  const userId=req.params.userId
  const updatedUser=req.body
  console.log(updatedUser)
  
  try{
    await User.updateOne({externalId:userId},{ $push: { media: { $each: updatedUser } } })

    const updateUser=await User.findOne({externalId:userId})

    res.status(200).json(updateUser)
  }catch(err){
    return res.status(500).json(err)
  }
})


router.post('/', async function(req, res) {
  const payload = req.body;
  console.log(payload)
  const headersList = req.headers;
  const heads = {
    "svix-id": headersList['svix-id'],
    "svix-timestamp": headersList['svix-timestamp'],
    "svix-signature": headersList['svix-signature'],
  };

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_KEY; // Replace with your actual webhook secret
  const wh = new Webhook(webhookSecret);

  try {
    const evt = wh.verify(JSON.stringify(payload), heads);

    if (evt) {
      const eventType=evt.type;
      const eventData=evt.data;
      console.log(evt)

      if(eventType==='user.created')
      {
        const newUser= new User({
          externalId:eventData.id,
          username:eventData.username,
          firstname:eventData.first_name,
          lastname:eventData.last_name,
          fullname:eventData.first_name+" "+eventData.last_name,
          profile_img:eventData.image_url,
          lastSignInAt:eventData.last_sign_in_at,
          cover_img:"",
          media:[],
          gender:""
        })

        await newUser.save()
      }
      else if(eventType==='user.updated')
      {

        const updatedUser={
          externalId:eventData.id,
          username:eventData.username,
          firstname:eventData.first_name,
          lastname:eventData.last_name,
          fullname:eventData.first_name+" "+eventData.last_name,
          profile_img:eventData.image_url,
          lastSignInAt:eventData.last_sign_in_at,
        }

        await User.updateOne({externalId:eventData.id},{$set:updatedUser})
      }
      else{

        await User.deleteOne({externalId:eventData.id})
      }
    }

    res.status(200).json({ message: 'Webhook received and processed successfully' });

  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Webhook verification failed' });
  }
})

router.get('/:userId',async (req,res)=>{
  const userId=req.params.userId
  try{
    const user=await User.findOne({externalId:userId})

    res.status(200).json(user)
  }catch(err){
    return res.status(500).json(err)
  }
})

module.exports = router;
