class Playlist
  include MongoMapper::Document

  many :videos
	key :title, String
	key :description, String
	key :viewed, Array

end