const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Connection URI
const uri = 'mongodb+srv://skfeat:Raj1775@cluster0.clqoh73.mongodb.net/RealTime';

// Connect to the MongoDB cluster using Mongoose
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB using Mongoose');

    const yourSchema = new mongoose.Schema({
      view: { type: Number, default: 0 },
    });

    const YourModel = mongoose.model('YourModel', yourSchema);

    app.get('/updateview', async (req, res) => {
        try {
          // Find the document and update the 'view' field by incrementing it by 1
          const updatedDocument = await YourModel.findOneAndUpdate(
            {},
            { $inc: { view: 1 } }, // Increment the 'view' field by 1
            { new: true } // Return the modified document
          );
  
          res.json({ message: 'View updated successfully', updatedDocument });
        } catch (error) {
          console.error('Error updating view:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });


    app.get('/getdata', async (req, res) => {
      try {
        // Fetch all documents from the database
        const documents = await YourModel.find({});
        
        // Send the documents as a JSON response
        res.json(documents);
      } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

app.post('/createDocument', async (req, res) => {
  try {
    // Create a new document with the default values
    const newDocument = new YourModel();
    
    // Save the new document to the database
    const savedDocument = await newDocument.save();

    res.json({ message: 'Document created successfully', savedDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
setInterval(async () => {
  try {
    // Find and update all documents in the collection
    const updatedDocuments = await YourModel.updateMany({}, { $set: { view: 0 } });

    console.log(`View values reset to zero.`);
  } catch (error) {
    console.error('Error resetting view values:', error);
  }
},5*60*1000); 
    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB using Mongoose:', error);
  });
