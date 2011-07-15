class User
  include MongoMapper::Document

  key :name, String

  belongs_to :video

end