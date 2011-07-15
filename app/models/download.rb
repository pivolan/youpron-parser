class User
  include MongoMapper::Document

  key :name, String
  key :url, String

end