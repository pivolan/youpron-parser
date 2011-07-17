class TestController < ActionController::Base

	def test
		@date = Integer(DateTime.strptime('October 3, 2006', "%B %e, %Y"))
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