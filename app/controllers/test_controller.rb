class TestController < ActionController::Base

	def test
    @incUser = Incrementor[:user].inc
    @incVideo = Incrementor[:video].inc
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