# Music browser

This project is a music platform capable of generating playlists based on perceptual features. It uses Koa and Node.js for the backend and Angular and Bootstrap for the frontend.

To start the application:

1. Set up a MySQL database with a schema following the rules in the create_song_table.sql and create_feedback_table.sql files.    
1a. Populate the song table with data for your songs. Each song needs all the features, which should be a number from 0 to 100. 

2. Add your database details to a file called DATABASE_DETAILS.json following the DATABASE_DETAILS_TEMPLATE.json format.    
   songTable is the is the name of the table with the songs' feature data and feedbackTable is the name of the table with feedback data.

3. Add your songs to the /app/api/music folder. The completely supported formats are wav, mp4 and ogg. The mp3 format almost works, but seeking in songs is bugged and seeks to a slightly wrong location.

4. Install npm and node.js. Application has only been tested with node.js version 5.4.0, earlier versions are not recommended.

5. Start (and install) the application by entering "npm start" at the root of the application using a terminal.
