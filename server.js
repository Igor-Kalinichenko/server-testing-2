const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// GET all blog posts
app.get('/posts', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error getting blog posts' });
    } else {
      const json = JSON.parse(data);
      res.status(200).json({ success: true, blogPosts: json.blogPosts });
    }
  });
});

// POST a new blog post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error creating blog post' });
    } else {
      const json = JSON.parse(data);
      const newBlogPost = { title, content };
      json.blogPosts.push(newBlogPost);
      fs.writeFile('data.json', JSON.stringify(json), err => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false, message: 'Error creating blog post' });
        } else {
          res.status(201).json({ success: true, message: 'Blog post created successfully' });
        }
      });
    }
  });
});

// PATCH a blog post
app.patch('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    fs.readFile('data.json', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error updating blog post' });
      } else {
        const json = JSON.parse(data);
        const index = json.blogPosts.findIndex(post => post.id === id);
        if (index === -1) {
          res.status(404).json({ success: false, message: 'Blog post not found' });
        } else {
          json.blogPosts[index].title = title || json.blogPosts[index].title;
          json.blogPosts[index].content = content || json.blogPosts[index].content;
          fs.writeFile('data.json', JSON.stringify(json), err => {
            if (err) {
              console.error(err);
              res.status(500).json({ success: false, message: 'Error updating blog post' });
            } else {
              res.status(200).json({ success: true, message: 'Blog post updated successfully' });
            }
          });
        }
      }
    });
  });


// DELETE a blog post
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
  
    fs.readFile('data.json', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error deleting blog post' });
      } else {
        const json = JSON.parse(data);
        const index = json.blogPosts.findIndex(post => post.id === id);
        if (index === -1) {
          res.status(404).json({ success: false, message: 'Blog post not found' });
        } else {
          json.blogPosts.splice(index, 1);
          fs.writeFile('data.json', JSON.stringify(json), err => {
            if (err) {
              console.error(err);
              res.status(500).json({ success: false, message: 'Error deleting blog post' });
            } else {
              res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
            }
          });
        }
      }
    });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
