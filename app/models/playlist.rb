class Playlist
  include MongoMapper::Document

  many :videos

end