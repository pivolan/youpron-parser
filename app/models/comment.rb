class Comment
  include MongoMapper::Document

  key :name, String
  key :message, String

end