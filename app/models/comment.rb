class Comment
  include MongoMapper::EmbeddedDocument

  key :name, String
  key :message, String
	key :published, Time

end