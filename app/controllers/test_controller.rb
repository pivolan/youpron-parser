class TestController < ActionController::Base
	layout 'application'

	def test
		@test = "test"
	end 

	def test2
		@vasya = "kol"
		@niger = "sdfffweweew"
		massive = {'vas'=>'erter', 'kol'=>'$$%%'}
		test = {}
		for key, value in massive
			test[key] = massive[key]
			puts key
			puts massive[key]
			puts value
		end
		@test = test
	end
end