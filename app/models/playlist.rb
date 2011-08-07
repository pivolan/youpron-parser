class Playlist
  include MongoMapper::Document

  many :video
	key :title, String
	key :description, String
	key :viewed, Array

end