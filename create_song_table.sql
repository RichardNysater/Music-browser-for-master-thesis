CREATE DATABASE IF NOT EXISTS Music;
CREATE TABLE IF NOT EXISTS Music.songs
(
songID varchar(20),
Activity int,
Valence int,
Speed int,
Modality int,
Articulation int,
Dynamics int,
Pitch int,
Dissonance int,
HarmonicComplexity int,
RhythmicComplexity int,
RhythmicClarity int
);
