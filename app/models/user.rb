class User
  include MongoMapper::Document

  many :playlists
	key :firstname, String
	key :lastname, String
	key :cookie_id, String
	key :short_url, String

	def generate_short_url
		dict = (0..9).to_a + ('a'..'z').to_a
		new_short_url = Array.new(6) { (dict[rand(35)]) }.join until User.where(:short_url => new_short_url).count == 0
		@short_url = new_short_url
		return new_short_url
	end
end