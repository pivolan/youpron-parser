class Playlist
  include MongoMapper::Document

  many :videos
	key :title, String
	key :description, String

end