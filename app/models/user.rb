class User
  include MongoMapper::Document

  many :playlists

end