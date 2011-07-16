class Download
  include MongoMapper::Document

  key :name, String
  key :url, String

end