class Video
  include MongoMapper::Document

  key :name, String
  key :images, Array
  key :url, String
  key :duration, String
  key :view, Integer
  key :rating, Float
  key :date, DateTime
  key :tags, Array
  many :downloads
  many :comments
  many :actors
	key :category_ids, Array
	many :categorys, :in => :category_ids

  belongs_to :playlist

end