class User
  include MongoMapper::Document

  key :name, String
  many :images
  key :url, String
  key :duration, String
  key :view, Integer
  key :rating, Float
  key :date, DateTime
  many :comments
  many :tags
  many :categories
  many :downloads
  many :actors

  belongs_to :playlist

end