class Download
  include MongoMapper::EmbeddedDocument

  key :name, String
  key :url, String

end