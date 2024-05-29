const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username,
      array_agg(json_build_object(
        'id', songs.id, 'title', songs.title, 'performer', songs.performer)) AS songs 
        FROM playlists 
        JOIN users ON playlists.owner = users.id
        JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1
        GROUP BY playlists.id, users.username`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = PlaylistsService;
