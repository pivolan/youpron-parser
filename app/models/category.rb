class Category
  include MongoMapper::Document

  key :name, String
	key :videos, Integer

end