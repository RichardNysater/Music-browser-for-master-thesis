# Music browser

This project is/will be a music platform based on perceptual features. This project is under heavy construction and is still in alpha.

Uses Koa and Node on the backend, Angular and Bootstrap on the frontend.

The music set used for the evaluation of the browser is available at https://shaan.se/i/kpop_music_used_for_perceptual_browser.7z.

To start the application (instructions not yet complete):

1. Set up a MySQL database with a schema following the rules in the create_song_table.sql and create_feedback_table.sql files.    
1a. Populate the song table with data for your songs. Each song needs all the features, which should be a number from 0 to 100. 
   If using the music set I used, you can import the following data: https://shaan.se/i/songdata.csv.

2. Add your database details to a file called DATABASE_DETAILS.json following the DATABASE_DETAILS_TEMPLATE.json format.    
2a. The songtable field is the name of the table with the songs' feature data.

3. Add your songs to the /app/api/music folder. The 100% supported formats are wav, mp4 and ogg. The mp3 format almost works, but seeking in songs is slightly bugged (seeks to the wrong location).

4. Start the application by opening a command window at the root of the application and typing "npm start".
