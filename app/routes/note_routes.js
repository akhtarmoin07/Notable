const { ObjectId } = require('bson'); // Modern import for ObjectId
module.exports = function (app, db) {
  app.get('/notes/:id', async (req, res) => {
    try {
      const id = req.params.id;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid ID format' });
      }

      const details = { _id: new ObjectId(id) }; // Create the filter object

      // Use async/await to fetch the document
      const item = await db.collection('notes').findOne(details);

      if (!item) {
        return res.status(404).send({ error: 'Note not found' }); // Handle not found
      }

      res.status(200).send(item); // Send the found item
    } catch (err) {
      console.error('Error fetching note:', err);
      res.status(500).send({ error: 'An error occurred while fetching the note' });
    }
  });

  
  app.put('/notes/:id', async (req, res) => {
    try {
      const id = req.params.id;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid ID format' });
      }

      const details = { _id: new ObjectId(id) }; // Filter for the document to update
      const update = {
        $set: { // Use $set to update only the provided fields
          text: req.body.body,
          title: req.body.title,
        },
      };

      // Update the document
      const result = await db.collection('notes').updateOne(details, update);

      if (result.matchedCount === 0) {
        return res.status(404).send({ error: 'Note not found' }); // Handle if no document matches the ID
      }

      res.status(200).send({ message: `Note ${id} updated successfully!` });
    } catch (err) {
      console.error('Error while updating note:', err);
      res.status(500).send({ error: 'An error occurred while updating the note' });
    }
  });


  app.delete('/notes/:id', async (req, res) => {
    try {
      const id = req.params.id;

      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid ID format' });
      }

      const details = { _id: new ObjectId(id) }; // Create filter object for deletion

      // Delete the document
      const result = await db.collection('notes').deleteOne(details);

      if (result.deletedCount === 0) {
        return res.status(404).send({ error: 'Note not found' }); // Handle if no document was deleted
      }

      res.status(200).send({ message: `Note ${id} deleted successfully!` });
    } catch (err) {
      console.error('Error while deleting note:', err);
      res.status(500).send({ error: 'An error occurred while deleting the note' });
    }
  });

  
   
  app.post('/notes', async (req, res) => {
    try {
      const note = { text: req.body.body, title: req.body.title };

      // Insert the document into the collection
      const result = await db.collection('notes').insertOne(note);

      // Send the inserted document back as the response
      res.status(201).send({ _id: result.insertedId, ...note });
    } catch (err) {
      console.error("Error while inserting note:", err);
      res.status(500).send({ error: 'An error occurred while adding the note' });
    }
  });
};

//akhtarmoin07
//2V0zOAKjpSIqA8O7

